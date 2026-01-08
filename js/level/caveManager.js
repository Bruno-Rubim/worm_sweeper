import { ChangeCursorState, ChangeScene, NextLevel, RingBell, StartBattle, } from "../action.js";
import { CURSORARROW, CURSORDEFAULT, CURSORDETONATOR, CURSORGOLDWATER, CURSORPICAXE, } from "../cursor.js";
import { CLICKLEFT } from "../global.js";
import { Chisel } from "../items/passives/chisel.js";
import Position from "../position.js";
import sounds from "../sounds.js";
import { sprites } from "../sprites.js";
import { Timer } from "../timer/timer.js";
import { timerQueue } from "../timer/timerQueue.js";
import { blockSheetPos, CONTENTBOMB, CONTENTBOMBOVERLAY, CONTENTDOOREXIT, CONTENTDOOREXITOPEN, CONTENTDOORSHOP, CONTENTDOORSHOPOPEN, CONTENTEMPTY, CONTENTWATER, } from "./block.js";
import SceneManager from "./sceneManager.js";
export default class CaveManager extends SceneManager {
    chiselActive = null;
    constructor(gameState, scenePos, soundManager) {
        super(gameState, scenePos, soundManager);
    }
    getBlockFromGamePos(pos) {
        const blockPos = pos
            .subtract(this.pos)
            .divide(this.gameState.level.cave.levelScale * 16);
        return this.gameState.level.cave.blockMatrix[blockPos.x][blockPos.y];
    }
    checkCaveClear() {
        if (this.gameState.level.cave.checkClear()) {
            if (this.gameState.hasItem("health_insurance")) {
                this.gameState.health++;
            }
            this.gameState.gold += 5;
            if (this.gameState.hasItem("gold_bug")) {
                this.gameState.gold += 5;
            }
            this.soundManager.playSound(sounds.clear);
        }
    }
    render = (canvasManager) => {
        const blockSize = 16 * this.gameState.level.cave.levelScale;
        for (let i = 0; i < this.gameState.level.cave.size; i++) {
            for (let j = 0; j < this.gameState.level.cave.size; j++) {
                const blockPos = new Position(i * blockSize, j * blockSize).add(this.pos);
                const block = this.gameState.level.cave.blockMatrix[i][j];
                if (!this.gameState.level.cave.started) {
                    canvasManager.renderSpriteFromSheet(sprites.block_sheet, blockPos, blockSize, blockSize, blockSheetPos.hidden, 16, 16);
                    continue;
                }
                canvasManager.renderSpriteFromSheet(sprites.block_sheet, blockPos, blockSize, blockSize, block.sheetBlockPos, 16, 16);
                if ((block.broken && block.content != CONTENTEMPTY) || block.marked) {
                    canvasManager.renderSpriteFromSheet(sprites.block_sheet, blockPos, blockSize, blockSize, block.sheetContentPos, 16, 16);
                }
                if (this.gameState.level.cave.bellRang &&
                    [CONTENTDOOREXIT, CONTENTDOORSHOP].includes(block.content) &&
                    !block.broken) {
                    canvasManager.renderSpriteFromSheet(sprites.block_sheet, blockPos, blockSize, blockSize, blockSheetPos.bell, 16, 16);
                }
            }
        }
        if (this.chiselActive) {
            canvasManager.renderSpriteFromSheet(sprites.block_sheet, this.chiselActive.gamePos
                .add(-blockSize / 2, blockSize / 2)
                .add(this.pos), blockSize, blockSize, blockSheetPos.chisel.add(Math.floor(this.chiselActive.timer.percentage / (100 / 6)) % 2, 0), 16, 16);
        }
    };
    handleClick = (cursorPos, button) => {
        const block = this.getBlockFromGamePos(cursorPos);
        if (!this.gameState.level.cave.started) {
            this.gameState.level.cave.start(block.gridPos, this.gameState.itemNames);
            this.gameState.gameTimer.start();
            this.soundManager.playSound(sounds.break);
            if (!this.gameState.started) {
                this.gameState.started = true;
            }
            return;
        }
        if (button == CLICKLEFT) {
            if (this.gameState.holding == "bomb") {
                if (!block.broken || block.content != CONTENTBOMBOVERLAY) {
                    return;
                }
                block.content = CONTENTBOMB;
                block.bombTimer = new Timer({
                    goalSecs: 2,
                    goalFunc: () => {
                        this.gameState.level.cave.bomb(block);
                        this.soundManager.playSound(sounds.break);
                        this.soundManager.playSound(sounds.break);
                        this.soundManager.playSound(sounds.break);
                        this.soundManager.playSound(sounds.break);
                        this.checkCaveClear();
                    },
                });
                timerQueue.push(block.bombTimer);
                block.bombTimer.start();
                this.soundManager.playSound(sounds.bomb);
                this.gameState.holding == "bomb";
                return;
            }
            else if (this.gameState.holding instanceof Chisel) {
                const chisel = this.gameState.holding;
                if (block.hasGold) {
                    chisel.chiselTimer.goalFunc = () => {
                        this.gameState.gold += 1;
                        chisel.using = false;
                        this.soundManager.playSound(sounds.gold);
                        this.gameState.holding = null;
                        block.hasGold = false;
                        this.chiselActive = null;
                    };
                    this.chiselActive = {
                        gamePos: block.gamePos,
                        timer: chisel.chiselTimer,
                    };
                    timerQueue.push(chisel.chiselTimer);
                    chisel.chiselTimer.start();
                }
                return;
            }
            let enemyCount = 0;
            if (!block.broken &&
                (!block.hidden || this.gameState.hasItem("dark_crystal")) &&
                !block.marked) {
                let breakResult = this.gameState.level.cave.breakBlock(block);
                this.soundManager.playSound(sounds.break);
                enemyCount += breakResult.battle.enemyCount;
                this.gameState.gold += breakResult.gold;
                if (breakResult.gold > 0) {
                    this.soundManager.playSound(sounds.gold);
                }
                if (this.gameState.hasItem("drill") && block.threatLevel == 0) {
                    this.soundManager.playSound(sounds.drill);
                    this.gameState.level.cave.breakConnectedEmpty(block);
                }
            }
            else if (block.broken) {
                switch (block.content) {
                    case CONTENTDOOREXIT:
                        this.soundManager.playSound(sounds.door);
                        block.content = CONTENTDOOREXITOPEN;
                        break;
                    case CONTENTDOOREXITOPEN:
                        this.soundManager.playSound(sounds.steps);
                        return new NextLevel(block.gridPos);
                    case CONTENTDOORSHOP:
                        this.soundManager.playSound(sounds.door);
                        block.content = CONTENTDOORSHOPOPEN;
                        break;
                    case CONTENTDOORSHOPOPEN:
                        this.soundManager.playSound(sounds.steps);
                        return new ChangeScene("shop");
                    case CONTENTWATER:
                        this.gameState.gold += 1;
                        this.soundManager.playSound(sounds.gold);
                        this.gameState.gameTimer.addSecs(-10);
                        break;
                    case CONTENTEMPTY:
                        if (this.gameState.hasItem("detonator") &&
                            block.threatLevel > 0 &&
                            block.threatLevel == block.markerLevel) {
                            let breakResult = this.gameState.level.cave.breakSurrBlocks(block.gridPos);
                            this.soundManager.playSound(sounds.detonate);
                            if (this.gameState.hasItem("drill")) {
                                this.gameState.level.cave.breakConnectedEmpty(block);
                            }
                            enemyCount += breakResult.battle.enemyCount;
                            if (breakResult.gold > 0) {
                                this.soundManager.playSound(sounds.gold);
                            }
                            this.gameState.gold += breakResult.gold;
                        }
                        break;
                }
            }
            if (enemyCount > 0) {
                return new StartBattle(enemyCount);
            }
            else {
                this.checkCaveClear();
            }
        }
        else {
            if (!block.broken) {
                this.gameState.level.cave.markBlock(block);
                this.checkCaveClear();
            }
        }
    };
    handleHover = (cursorPos) => {
        this.gameState.level.cave.allBLocks.forEach((block) => {
            block.cursorHovering = false;
        });
        const block = this.getBlockFromGamePos(cursorPos);
        block.cursorHovering = true;
        if (this.gameState.holding == "bomb") {
            this.gameState.level.cave.setBombOverlay(block);
        }
        else {
            this.gameState.level.cave.setBombOverlay();
        }
        if (block.broken) {
            if (block.content == CONTENTWATER) {
                return new ChangeCursorState(CURSORGOLDWATER);
            }
            if (this.gameState.hasItem("detonator") &&
                block.threatLevel > 0 &&
                block.threatLevel == block.markerLevel) {
                return new ChangeCursorState(CURSORDETONATOR);
            }
        }
        if (block.broken &&
            [CONTENTDOOREXIT, CONTENTDOORSHOP].includes(block.content)) {
            return new ChangeCursorState(CURSORDEFAULT);
        }
        if (block.broken &&
            [CONTENTDOOREXITOPEN, CONTENTDOORSHOPOPEN].includes(block.content)) {
            return new ChangeCursorState(CURSORARROW);
        }
        return new ChangeCursorState(CURSORPICAXE);
    };
}
