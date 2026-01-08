import Block, { CONTENTBOMBOVERLAY, CONTENTDOOREXIT, CONTENTDOORSHOP, CONTENTEMPTY, CONTENTWATER, CONTENTWORM, } from "./block.js";
import Position from "../position.js";
import { StartBattle } from "../action.js";
import { utils } from "../utils.js";
export default class Cave {
    difficulty;
    size;
    hasShop;
    hasWater;
    goldChance = 1.7;
    wormQuantity;
    wormsLeft;
    blocksLeft;
    levelScale;
    blockMatrix = [];
    started = false;
    cleared = false;
    bellRang = false;
    constructor(depth) {
        this.difficulty = (depth % 3) + Math.floor(depth / 3) + 4;
        this.size = Math.floor(depth / 3) + 6;
        this.hasShop = depth > 0;
        this.hasWater = depth > 1 && utils.randomInt(3) == 0;
        this.wormQuantity = Math.floor(this.difficulty * 0.033 * this.size * this.size);
        this.wormsLeft = this.wormQuantity;
        this.blocksLeft = this.size * this.size - this.wormsLeft;
        this.levelScale = 128 / (this.size * 16);
        this.fillEmptyBlocks();
    }
    get blocksCanPlaceWorm() {
        return this.allBLocks.filter((block) => block.content == CONTENTEMPTY &&
            !block.starter &&
            this.getSurrBlocks(block.gridPos).every((b) => b.content == CONTENTEMPTY || b.content == CONTENTWORM));
    }
    get blocksCanPlaceStuff() {
        this.updateAllStats();
        return this.allBLocks.filter((block) => block.threatLevel == 0 &&
            !block.starter &&
            block.content == CONTENTEMPTY &&
            this.getAdjcBlocks(block.gridPos).every((b) => b.content == CONTENTEMPTY));
    }
    fillEmptyBlocks() {
        this.blockMatrix = Array.from({ length: this.size }, (_, i) => Array.from({ length: this.size }, (_, j) => new Block({
            gridPos: new Position(i, j),
            gamePos: new Position(i * 16 * this.levelScale, j * 16 * this.levelScale),
        })));
    }
    placeGold() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const block = this.blockMatrix[i][j];
                if (block.starter) {
                    continue;
                }
                const rngGold = Math.floor(Math.random() * this.goldChance);
                if (rngGold >= 1) {
                    block.hasGold = true;
                }
            }
        }
    }
    getSurrBlocks(gridPos) {
        let surrBlocks = [];
        if (gridPos.x != 0) {
            surrBlocks.push(this.blockMatrix[gridPos.x - 1][gridPos.y]);
            if (gridPos.y != 0) {
                surrBlocks.push(this.blockMatrix[gridPos.x - 1][gridPos.y - 1]);
            }
        }
        if (gridPos.y != 0) {
            surrBlocks.push(this.blockMatrix[gridPos.x][gridPos.y - 1]);
            if (gridPos.x != this.size - 1) {
                surrBlocks.push(this.blockMatrix[gridPos.x + 1][gridPos.y - 1]);
            }
        }
        if (gridPos.x != this.size - 1) {
            surrBlocks.push(this.blockMatrix[gridPos.x + 1][gridPos.y]);
            if (gridPos.y != this.size - 1) {
                surrBlocks.push(this.blockMatrix[gridPos.x + 1][gridPos.y + 1]);
            }
        }
        if (gridPos.y != this.size - 1) {
            surrBlocks.push(this.blockMatrix[gridPos.x][gridPos.y + 1]);
            if (gridPos.x != 0) {
                surrBlocks.push(this.blockMatrix[gridPos.x - 1][gridPos.y + 1]);
            }
        }
        return surrBlocks;
    }
    getAdjcBlocks(gridPos) {
        let surrBlocks = [];
        if (gridPos.x != 0) {
            surrBlocks.push(this.blockMatrix[gridPos.x - 1][gridPos.y]);
        }
        if (gridPos.y != 0) {
            surrBlocks.push(this.blockMatrix[gridPos.x][gridPos.y - 1]);
        }
        if (gridPos.x != this.size - 1) {
            surrBlocks.push(this.blockMatrix[gridPos.x + 1][gridPos.y]);
        }
        if (gridPos.y != this.size - 1) {
            surrBlocks.push(this.blockMatrix[gridPos.x][gridPos.y + 1]);
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
        this.blockMatrix.forEach((line) => {
            line.forEach((block) => {
                if (block.content == CONTENTWORM && block.broken) {
                    block.content = CONTENTEMPTY;
                }
            });
        });
    }
    setBombOverlay(block) {
        if (block?.broken && block.content == CONTENTEMPTY) {
            block.content = CONTENTBOMBOVERLAY;
        }
        this.blockMatrix.forEach((line) => {
            line.forEach((b) => {
                if (b.content == CONTENTBOMBOVERLAY && b != block) {
                    b.content = CONTENTEMPTY;
                }
            });
        });
    }
    bomb(block) {
        block.content = CONTENTEMPTY;
        this.getSurrBlocks(block.gridPos).forEach((b) => {
            if (b.content == CONTENTWORM) {
                b.content = CONTENTEMPTY;
                this.wormsLeft--;
                this.blocksLeft++;
            }
        });
        this.breakSurrBlocks(block.gridPos, true);
        this.updateAllStats();
    }
    updateAllStats() {
        this.blockMatrix.forEach((line) => {
            line.forEach((block) => {
                this.updateBlockStats(block);
            });
        });
    }
    get allBLocks() {
        let blockArr = [];
        this.blockMatrix.forEach((line) => {
            line.forEach((block) => {
                blockArr.push(block);
            });
        });
        return blockArr;
    }
    revealAllBlocks() {
        this.blockMatrix.forEach((line) => {
            line.forEach((block) => {
                block.broken = true;
            });
        });
        this.updateAllStats();
    }
    countBrokenBlocks() {
        let counter = this.size * this.size;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.blockMatrix[i][j].broken) {
                    counter--;
                }
            }
        }
        return counter;
    }
    checkClear() {
        if (this.blocksLeft == 0 && this.wormsLeft == 0 && !this.cleared) {
            this.cleared = true;
            return true;
        }
        return false;
    }
    breakBlock(block) {
        let result = { battle: new StartBattle(0), gold: 0 };
        block.broken = true;
        this.revealAdjc(block.gridPos);
        if (block.content != CONTENTWORM) {
            this.blocksLeft--;
        }
        else {
            result.battle.enemyCount++;
        }
        if (block.hasGold) {
            result.gold++;
        }
        this.updateBlockStats(block);
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
            this.wormsLeft--;
        }
        else {
            this.wormsLeft++;
        }
    }
    breakSurrBlocks(pos, ignoreMarks = false) {
        let totalResult = {
            battle: new StartBattle(0),
            gold: 0,
        };
        const surrBlocks = this.getSurrBlocks(pos);
        surrBlocks.forEach((block) => {
            if (block.broken || (block.marked && !ignoreMarks)) {
                return;
            }
            let result = this.breakBlock(block);
            if (block.marked) {
                block.marked = false;
                this.wormsLeft++;
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
        if (this.blocksCanPlaceWorm.length < this.wormQuantity) {
            window.alert("not enough worms");
        }
        let wormsPlaced = 0;
        if (this.wormQuantity > Math.floor((this.size * this.size) / 3)) {
            this.wormQuantity = Math.floor((this.size * this.size) / 3);
        }
        for (let i = 0; wormsPlaced < this.wormQuantity && i < 300; i++) {
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
            console.warn("there should be water here but there isn't");
            return;
        }
        const r = utils.randomArrayId(this.blocksCanPlaceStuff);
        const block = this.blocksCanPlaceStuff[r];
        block.content = CONTENTWATER;
    }
    start(startPos, passiveItemNames) {
        if (passiveItemNames.includes("gold_bug")) {
            this.wormQuantity = Math.ceil(this.wormQuantity * 1.3);
            this.wormsLeft = this.wormQuantity;
            this.goldChance += 0.3;
            this.blocksLeft = this.size * this.size - this.wormsLeft;
        }
        this.fillEmptyBlocks();
        const firstBlock = this.blockMatrix[startPos.x][startPos.y];
        firstBlock.starter = true;
        this.breakBlock(firstBlock);
        this.getSurrBlocks(firstBlock.gridPos).forEach((block) => {
            block.starter = true;
        });
        this.placeGold();
        this.placeExit();
        if (this.hasShop) {
            this.placeShop();
        }
        this.placeWorms();
        if (this.hasWater) {
            this.placeWater();
        }
        this.breakSurrBlocks(firstBlock.gridPos);
        this.started = true;
    }
}
