import Block, { CONTENTDOOREXIT, CONTENTDOORSHOP, CONTENTEMPTY, CONTENTWORM, } from "./block.js";
import Position from "../position.js";
export default class Cave {
    difficulty;
    size;
    hasShop;
    goldChance = 1.7;
    wormQuantity;
    wormsLeft;
    blocksLeft;
    levelScale;
    blockMatrix = [];
    freeTiles = [];
    started = false;
    cleared = false;
    constructor(depth) {
        this.difficulty = (depth % 3) + Math.floor(depth / 3) + 4;
        this.size = Math.floor(depth / 3) + 6;
        this.hasShop = depth > 0;
        this.wormQuantity = Math.floor(this.difficulty * 0.033 * this.size * this.size);
        this.wormsLeft = this.wormQuantity;
        this.blocksLeft = this.size * this.size - this.wormsLeft;
        this.levelScale = 128 / (this.size * 16);
        this.fillEmptyBlocks();
    }
    fillEmptyBlocks() {
        this.blockMatrix = Array.from({ length: this.size }, (_, i) => Array.from({ length: this.size }, (_, j) => new Block({
            gridPos: new Position(i, j),
            gamePos: new Position(i * 16 * this.levelScale, j * 16 * this.levelScale),
        })));
    }
    setFreeTiles() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const block = this.blockMatrix[i][j];
                if (!block.starter) {
                    this.freeTiles.push(block);
                }
            }
        }
    }
    placeGold() {
        let c = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const block = this.blockMatrix[i][j];
                if (block.starter) {
                    continue;
                }
                const rngGold = Math.floor(Math.random() * this.goldChance);
                block.hasGold = rngGold >= 1;
                if (rngGold >= 1) {
                    c++;
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
    updateAllStats() {
        this.blockMatrix.forEach((line) => {
            line.forEach((block) => {
                this.updateBlockStats(block);
            });
        });
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
        block.broken = true;
        this.revealAdjc(block.gridPos);
        if (block.content != CONTENTWORM) {
            this.blocksLeft--;
        }
        this.updateBlockStats(block);
    }
    breakConnectedEmpty(block) {
        if (block.threatLevel == 0 && !block.marked) {
            this.breakSurrBlocks(block.gridPos);
        }
        this.getSurrBlocks(block.gridPos).forEach((b) => {
            if (b.threatLevel == 0 && !b.drilled) {
                b.drilled = true;
                this.breakConnectedEmpty(b);
            }
        });
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
    breakSurrBlocks(pos) {
        const surrBlocks = this.getSurrBlocks(pos);
        surrBlocks.forEach((block) => {
            if (block.broken || block.marked) {
                return;
            }
            this.breakBlock(block);
        });
    }
    placeExit() {
        if (this.freeTiles.length == 0) {
            console.warn("drake...");
            return;
        }
        const r = Math.floor(Math.random() * this.freeTiles.length);
        const block = this.freeTiles[r];
        this.freeTiles.splice(r, 1);
        block.content = CONTENTDOOREXIT;
        this.getSurrBlocks(block.gridPos).forEach((b) => {
            for (let i = 0; i < this.freeTiles.length; i++) {
                if (this.freeTiles[i] == b) {
                    this.freeTiles.splice(i, 1);
                    i--;
                }
            }
        });
    }
    placeWorms() {
        if (this.freeTiles.length < this.wormQuantity) {
            window.alert("not enough worms");
        }
        let wormsPlaced = 0;
        if (this.wormQuantity > Math.floor((this.size * this.size) / 3)) {
            this.wormQuantity = Math.floor((this.size * this.size) / 3);
        }
        for (let i = 0; wormsPlaced < this.wormQuantity && i < 300; i++) {
            const r = Math.floor(Math.random() * this.freeTiles.length);
            const block = this.freeTiles[r];
            block.content = "worm";
            wormsPlaced++;
            this.freeTiles.splice(r, 1);
        }
    }
    emptySurrBlocks(pos) {
        this.getSurrBlocks(pos).forEach((block) => {
            for (let i = 0; i < this.freeTiles.length; i++) {
                if (this.freeTiles[i] == block) {
                    this.freeTiles.splice(i, 1);
                    i--;
                }
            }
        });
    }
    placeShop() {
        if (this.freeTiles.length == 0) {
            console.warn("drake...");
            return;
        }
        const r = Math.floor(Math.random() * this.freeTiles.length);
        const block = this.freeTiles[r];
        block.content = CONTENTDOORSHOP;
        this.freeTiles.splice(r, 1);
        this.emptySurrBlocks(block.gridPos);
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
        this.setFreeTiles();
        this.placeGold();
        this.placeExit();
        if (this.hasShop) {
            this.placeShop();
        }
        this.placeWorms();
        this.breakSurrBlocks(firstBlock.gridPos);
        this.started = true;
        if (passiveItemNames.includes("drill")) {
            this.breakConnectedEmpty(firstBlock);
        }
    }
}
