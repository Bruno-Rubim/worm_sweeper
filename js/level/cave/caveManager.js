import { ChangeCursorState, ChangeScene, NextLevel, StartBattle, } from "../../action.js";
import { CURSORARROW, CURSORDEFAULT, CURSORDETONATOR, CURSORGOLDWATER, CURSORPICAXE, } from "../../cursor.js";
import { CLICKLEFT } from "../../global.js";
import Position from "../../gameElements/position.js";
import sounds from "../../sounds/sounds.js";
import { sprites } from "../../sprites.js";
import Block, { blockSheetPos, CONTENTDOOREXIT, CONTENTDOOREXITOPEN, CONTENTDOORSHOP, CONTENTDOORSHOPOPEN, CONTENTEMPTY, CONTENTWATER, CONTENTWORM, } from "./block.js";
import SceneManager from "../sceneManager.js";
import { gameState } from "../../gameState.js";
import { canvasManager } from "../../canvasManager.js";
import { soundManager } from "../../sounds/soundManager.js";
import { utils } from "../../utils.js";
import { hasItem } from "../../playerInventory.js";
import { Timer } from "../../timer/timer.js";
import { musicTracks } from "../../sounds/music.js";
export default class CaveManager extends SceneManager {
    bomb = null;
    get cave() {
        return gameState.level.cave;
    }
    getBlockFromScrenPos(pos) {
        const blockPos = pos
            .subtract(this.pos)
            .divide(gameState.level.cave.levelScale * 16);
        return gameState.level.cave.blockMatrix[blockPos.x][blockPos.y];
    }
    checkCaveClear() {
        if (this.cave.blocksLeft == 0 &&
            this.cave.wormsLeft == 0 &&
            !this.cave.cleared) {
            this.cave.cleared = true;
            if (hasItem("health_insurance")) {
                gameState.health++;
                gameState.health = Math.min(gameState.maxHealth, gameState.health);
            }
            gameState.gold += 5;
            gameState.gameTimer.addSecs(60);
            if (hasItem("gold_bug")) {
                gameState.gold += 5;
            }
            soundManager.playSound(sounds.clear);
        }
    }
    get blocksCanPlaceWorm() {
        return this.cave.allBLocks.filter((block) => block.content == CONTENTEMPTY &&
            !block.starter &&
            this.getSurrBlocks(block.gridPos).every((b) => b.content == CONTENTEMPTY || b.content == CONTENTWORM));
    }
    get blocksCanPlaceStuff() {
        this.updateAllStats();
        return this.cave.allBLocks.filter((block) => block.threatLevel == 0 &&
            !block.starter &&
            block.content == CONTENTEMPTY &&
            this.getAdjcBlocks(block.gridPos).every((b) => b.content == CONTENTEMPTY));
    }
    placeGold() {
        for (let i = 0; i < gameState.level.cave.size; i++) {
            for (let j = 0; j < gameState.level.cave.size; j++) {
                const block = this.cave.blockMatrix[i][j];
                if (block.starter) {
                    continue;
                }
                const rngGold = Math.floor(Math.random() * gameState.level.cave.goldChance);
                if (rngGold >= 1) {
                    block.hasGold = true;
                }
            }
        }
    }
    getSurrBlocks(gridPos, extra = false) {
        let validPositions = [];
        if (gridPos.x > 0) {
            validPositions.push([gridPos.x - 1, gridPos.y]);
            if (gridPos.y > 0) {
                validPositions.push([gridPos.x - 1, gridPos.y - 1]);
            }
            if (gridPos.y < gameState.level.cave.size - 1) {
                validPositions.push([gridPos.x - 1, gridPos.y + 1]);
            }
        }
        if (gridPos.x < gameState.level.cave.size - 1) {
            validPositions.push([gridPos.x + 1, gridPos.y]);
            if (gridPos.y > 0) {
                validPositions.push([gridPos.x + 1, gridPos.y - 1]);
            }
            if (gridPos.y < gameState.level.cave.size - 1) {
                validPositions.push([gridPos.x + 1, gridPos.y + 1]);
            }
        }
        if (gridPos.y > 0) {
            validPositions.push([gridPos.x, gridPos.y - 1]);
        }
        if (gridPos.y < gameState.level.cave.size - 1) {
            validPositions.push([gridPos.x, gridPos.y + 1]);
        }
        if (extra) {
            if (gridPos.x > 1) {
                validPositions.push([gridPos.x - 2, gridPos.y]);
                console.log("middle left");
                if (gridPos.y > 0) {
                    validPositions.push([gridPos.x - 2, gridPos.y - 1]);
                    console.log("up");
                    if (gridPos.y > 1) {
                        validPositions.push([gridPos.x - 2, gridPos.y - 2]);
                        console.log("upper");
                    }
                }
                if (gridPos.y < gameState.level.cave.size - 1) {
                    validPositions.push([gridPos.x - 2, gridPos.y + 1]);
                    console.log("low");
                    if (gridPos.y < gameState.level.cave.size - 2) {
                        validPositions.push([gridPos.x - 2, gridPos.y + 2]);
                        console.log("lower");
                    }
                }
            }
            if (gridPos.x < gameState.level.cave.size - 2) {
                validPositions.push([gridPos.x + 2, gridPos.y]);
                console.log("middle right");
                if (gridPos.y > 0) {
                    validPositions.push([gridPos.x + 2, gridPos.y - 1]);
                    console.log("up");
                    if (gridPos.y > 1) {
                        validPositions.push([gridPos.x + 2, gridPos.y - 2]);
                        console.log("uper");
                    }
                }
                if (gridPos.y < gameState.level.cave.size - 1) {
                    validPositions.push([gridPos.x + 2, gridPos.y + 1]);
                    console.log("low");
                    if (gridPos.y < gameState.level.cave.size - 2) {
                        validPositions.push([gridPos.x + 2, gridPos.y + 2]);
                        console.log("lower");
                    }
                }
            }
            if (gridPos.y > 1) {
                validPositions.push([gridPos.x, gridPos.y - 2]);
                console.log("mittle top");
                if (gridPos.x > 1) {
                    validPositions.push([gridPos.x - 1, gridPos.y - 2]);
                    console.log("left");
                }
                if (gridPos.x < gameState.level.cave.size - 1) {
                    validPositions.push([gridPos.x + 1, gridPos.y - 2]);
                    console.log("right");
                }
            }
            if (gridPos.y < gameState.level.cave.size - 2) {
                validPositions.push([gridPos.x, gridPos.y + 2]);
                console.log("mittle bottom");
                if (gridPos.x > 1) {
                    validPositions.push([gridPos.x - 1, gridPos.y + 2]);
                    console.log("left");
                }
                if (gridPos.x < gameState.level.cave.size - 1) {
                    validPositions.push([gridPos.x + 1, gridPos.y + 2]);
                    console.log("right");
                }
            }
            console.log("---");
        }
        let surrBlocks = validPositions.map((p) => {
            const block = this.cave.blockMatrix[p[0]][p[1]];
            return block;
        });
        return surrBlocks;
    }
    getAdjcBlocks(gridPos) {
        let surrBlocks = [];
        if (gridPos.x != 0) {
            surrBlocks.push(this.cave.blockMatrix[gridPos.x - 1][gridPos.y]);
        }
        if (gridPos.y != 0) {
            surrBlocks.push(this.cave.blockMatrix[gridPos.x][gridPos.y - 1]);
        }
        if (gridPos.x != gameState.level.cave.size - 1) {
            surrBlocks.push(this.cave.blockMatrix[gridPos.x + 1][gridPos.y]);
        }
        if (gridPos.y != gameState.level.cave.size - 1) {
            surrBlocks.push(this.cave.blockMatrix[gridPos.x][gridPos.y + 1]);
        }
        return surrBlocks;
    }
    revealAdjc(gridPos) {
        this.getAdjcBlocks(gridPos).forEach((block) => {
            if (block == undefined) {
                return;
            }
            if (block.hidden) {
                block.hidden = false;
            }
        });
    }
    updateBlockStats(block) {
        let threatLevel = 0;
        let markerLevel = 0;
        this.getSurrBlocks(block.gridPos).forEach((b) => {
            if (b.content == CONTENTWORM) {
                threatLevel++;
            }
            if (b.marked) {
                markerLevel++;
            }
        });
        block.threatLevel = threatLevel;
        block.markerLevel = markerLevel;
    }
    clearExposedWorms() {
        this.cave.blockMatrix.forEach((line) => {
            line.forEach((block) => {
                if (block.content == CONTENTWORM && block.broken) {
                    block.content = CONTENTEMPTY;
                }
            });
        });
    }
    bombBlock(block) {
        if (!block.broken) {
            if (block.content == CONTENTWORM) {
                block.content = CONTENTEMPTY;
                if (block.marked) {
                    block.marked = false;
                }
                else {
                    this.cave.wormsLeft--;
                }
            }
            else {
                if (block.marked) {
                    block.marked = false;
                    this.cave.wormsLeft++;
                }
                this.cave.blocksLeft--;
            }
            block.broken = true;
        }
        this.getSurrBlocks(block.gridPos).forEach((b) => {
            if (b.content == CONTENTWORM) {
                b.content = CONTENTEMPTY;
                this.cave.wormsLeft--;
                this.cave.blocksLeft++;
            }
        });
        this.breakSurrBlocks(block.gridPos, true);
        this.updateAllStats();
    }
    updateAllStats() {
        this.cave.blockMatrix.forEach((line) => {
            line.forEach((block) => {
                this.updateBlockStats(block);
            });
        });
    }
    revealAllBlocks() {
        this.cave.blockMatrix.forEach((line) => {
            line.forEach((block) => {
                block.broken = true;
            });
        });
        this.updateAllStats();
    }
    countBrokenBlocks() {
        let counter = this.cave.size * this.cave.size;
        for (let i = 0; i < this.cave.size; i++) {
            for (let j = 0; j < this.cave.size; j++) {
                if (this.cave.blockMatrix[i][j].broken) {
                    counter--;
                }
            }
        }
        return counter;
    }
    breakBlock(block, quiet = false) {
        let result = { battle: new StartBattle(0), gold: 0 };
        block.broken = true;
        this.revealAdjc(block.gridPos);
        if (block.content != CONTENTWORM) {
            gameState.level.cave.blocksLeft--;
        }
        else {
            result.battle.enemyCount++;
        }
        if (block.hasGold) {
            result.gold++;
        }
        this.updateBlockStats(block);
        soundManager.playSound(sounds.break);
        return result;
    }
    breakConnectedEmpty(block) {
        let totalResult = {
            battle: new StartBattle(0),
            gold: 0,
        };
        if (block.threatLevel == 0 && !block.marked) {
            totalResult.gold += this.breakSurrBlocks(block.gridPos).gold;
        }
        this.getSurrBlocks(block.gridPos).forEach((b) => {
            if (b.threatLevel == 0 && !b.drilled) {
                b.drilled = true;
                totalResult.gold += this.breakConnectedEmpty(b).gold;
            }
        });
        return totalResult;
    }
    markBlock(block) {
        block.marked = !block.marked;
        this.getSurrBlocks(block.gridPos).forEach((b) => {
            this.updateBlockStats(b);
        });
        if (block.marked) {
            this.cave.wormsLeft--;
        }
        else {
            this.cave.wormsLeft++;
        }
    }
    breakSurrBlocks(pos, ignoreMarks = false, extraArea = false) {
        let totalResult = {
            battle: new StartBattle(0),
            gold: 0,
        };
        const surrBlocks = this.getSurrBlocks(pos, extraArea);
        surrBlocks.forEach((block) => {
            if (block.broken || (block.marked && !ignoreMarks)) {
                return;
            }
            let result = this.breakBlock(block);
            if (block.marked) {
                block.marked = false;
                this.cave.wormsLeft++;
            }
            totalResult.battle.enemyCount += result.battle.enemyCount;
            totalResult.gold += result.gold;
        });
        return totalResult;
    }
    placeExit() {
        if (this.blocksCanPlaceStuff.length == 0) {
            console.warn("drake...");
            return;
        }
        const r = utils.randomArrayId(this.blocksCanPlaceStuff);
        const block = this.blocksCanPlaceStuff[r];
        block.content = CONTENTDOOREXIT;
    }
    placeWorms() {
        if (this.blocksCanPlaceWorm.length < this.cave.wormQuantity) {
            window.alert("not enough worms");
        }
        let wormsPlaced = 0;
        for (let i = 0; wormsPlaced < this.cave.wormQuantity && i < 300; i++) {
            const r = utils.randomArrayId(this.blocksCanPlaceWorm);
            const block = this.blocksCanPlaceWorm[r];
            block.content = CONTENTWORM;
            wormsPlaced++;
        }
        this.updateAllStats();
    }
    placeShop() {
        if (this.blocksCanPlaceStuff.length == 0) {
            console.warn("no shop :c");
            return;
        }
        const r = utils.randomArrayId(this.blocksCanPlaceStuff);
        const block = this.blocksCanPlaceStuff[r];
        block.content = CONTENTDOORSHOP;
    }
    placeWater() {
        if (this.blocksCanPlaceStuff.length == 0) {
            return;
        }
        const r = utils.randomArrayId(this.blocksCanPlaceStuff);
        const block = this.blocksCanPlaceStuff[r];
        block.content = CONTENTWATER;
    }
    startCave(startPos) {
        if (gameState.bugCurse) {
            gameState.level.cave.wormQuantity = Math.ceil(gameState.level.cave.wormQuantity * 1.2);
            gameState.level.cave.wormsLeft = gameState.level.cave.wormQuantity;
            gameState.level.cave.goldChance += 0.3;
            gameState.level.cave.blocksLeft =
                gameState.level.cave.size * gameState.level.cave.size -
                    gameState.level.cave.wormsLeft;
        }
        const firstBlock = this.cave.blockMatrix[startPos.x][startPos.y];
        firstBlock.starter = true;
        this.breakBlock(firstBlock);
        this.getSurrBlocks(firstBlock.gridPos).forEach((block) => {
            block.starter = true;
        });
        this.placeGold();
        this.placeExit();
        if (gameState.level.cave.hasShop) {
            this.placeShop();
        }
        this.placeWorms();
        if (gameState.level.cave.hasWater) {
            this.placeWater();
        }
        this.breakSurrBlocks(firstBlock.gridPos);
        gameState.level.cave.started = true;
    }
    render = () => {
        const blockSize = 16 * gameState.level.cave.levelScale;
        for (let i = 0; i < gameState.level.cave.size; i++) {
            for (let j = 0; j < gameState.level.cave.size; j++) {
                const blockPos = new Position(i * blockSize, j * blockSize).add(this.pos);
                const block = this.cave.blockMatrix[i][j];
                if (!gameState.level.cave.started) {
                    canvasManager.renderSpriteFromSheet(sprites.block_sheet, blockPos, blockSize, blockSize, blockSheetPos.hidden, 16, 16);
                    continue;
                }
                canvasManager.renderSpriteFromSheet(sprites.block_sheet, blockPos, blockSize, blockSize, block.sheetBlockPos, 16, 16);
                if ((block.broken && block.content != CONTENTEMPTY) || block.marked) {
                    canvasManager.renderSpriteFromSheet(sprites.block_sheet, blockPos, blockSize, blockSize, block.sheetContentPos.add(0, 0), 16, 16);
                }
                if (gameState.level.cave.bellRang &&
                    [CONTENTDOOREXIT, CONTENTDOORSHOP].includes(block.content) &&
                    !block.broken) {
                    canvasManager.renderSpriteFromSheet(sprites.block_sheet, blockPos, blockSize, blockSize, blockSheetPos.bell, 16, 16);
                }
            }
        }
        if (this.bomb) {
            const block = this.getBlockFromScrenPos(this.bomb.screenPos);
            const blockPos = new Position(block.gridPos.x * blockSize, block.gridPos.y * blockSize).add(this.pos);
            let framePos = new Position();
            if (!this.bomb.hoverScreenPos) {
                framePos = new Position(Math.min(2, Math.floor(this.bomb.timer.percentage / ((1 / 3) * 100))) + 1, 0);
            }
            canvasManager.renderSpriteFromSheet(sprites.bomb_sheet, blockPos, blockSize, blockSize, framePos, 16, 16);
        }
    };
    handleClick = (cursorPos, button) => {
        const block = this.getBlockFromScrenPos(cursorPos);
        if (!this.cave.started) {
            this.startCave(block.gridPos);
            if (!gameState.started) {
                soundManager.playMusic(musicTracks.music);
                gameState.started = true;
                gameState.gameTimer.start();
            }
            return;
        }
        if (button == CLICKLEFT) {
            if (gameState.holding?.name == "bomb") {
                if (block.broken && block.content != CONTENTEMPTY) {
                    return;
                }
                this.bomb = {
                    screenPos: new Position(cursorPos),
                    timer: new Timer({
                        goalSecs: 1.9,
                        goalFunc: () => {
                            this.bombBlock(block);
                            this.checkCaveClear();
                            this.bomb = null;
                            soundManager.playSound(sounds.explosion);
                        },
                    }),
                    hoverScreenPos: null,
                };
                soundManager.playSound(sounds.bomb_fuse);
                gameState.holding = null;
                return;
            }
            let enemyCount = 0;
            if (!block.broken &&
                (!block.hidden || hasItem("dark_crystal")) &&
                !block.marked) {
                let breakResult = this.breakBlock(block);
                enemyCount += breakResult.battle.enemyCount;
                gameState.gold += breakResult.gold;
                if (breakResult.gold > 0) {
                    soundManager.playSound(sounds.gold);
                }
                if (hasItem("drill") && block.threatLevel == 0) {
                    soundManager.playSound(sounds.drill);
                    this.breakConnectedEmpty(block);
                }
            }
            else if (block.broken) {
                switch (block.content) {
                    case CONTENTDOOREXIT:
                        soundManager.playSound(sounds.door);
                        block.content = CONTENTDOOREXITOPEN;
                        break;
                    case CONTENTDOOREXITOPEN:
                        soundManager.playSound(sounds.steps);
                        return new NextLevel(block.gridPos);
                    case CONTENTDOORSHOP:
                        soundManager.playSound(sounds.door);
                        block.content = CONTENTDOORSHOPOPEN;
                        break;
                    case CONTENTDOORSHOPOPEN:
                        soundManager.playSound(sounds.steps);
                        return new ChangeScene("shop");
                    case CONTENTWATER:
                        gameState.gold += 5;
                        soundManager.playSound(sounds.gold);
                        gameState.gameTimer.addSecs(-10);
                        break;
                    case CONTENTEMPTY:
                        if (hasItem("detonator") &&
                            block.threatLevel > 0 &&
                            block.threatLevel == block.markerLevel) {
                            let breakResult = this.breakSurrBlocks(block.gridPos);
                            soundManager.playSound(sounds.detonate);
                            if (hasItem("drill")) {
                                this.breakConnectedEmpty(block);
                            }
                            enemyCount += breakResult.battle.enemyCount;
                            if (breakResult.gold > 0) {
                                soundManager.playSound(sounds.gold);
                            }
                            gameState.gold += breakResult.gold;
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
                this.markBlock(block);
                this.checkCaveClear();
            }
        }
    };
    handleHover = (cursorPos) => {
        this.cave.allBLocks.forEach((block) => {
            block.cursorHovering = false;
        });
        const block = this.getBlockFromScrenPos(cursorPos);
        block.cursorHovering = true;
        if (gameState.holding?.name == "bomb") {
            this.bomb = {
                hoverScreenPos: cursorPos,
                screenPos: new Position(cursorPos),
                timer: new Timer({}),
            };
        }
        if (block.broken) {
            if (block.content == CONTENTWATER) {
                return new ChangeCursorState(CURSORGOLDWATER);
            }
            if (hasItem("detonator") &&
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
    handleNotHover = () => {
        if (this.bomb?.hoverScreenPos) {
            this.bomb = null;
        }
    };
}
