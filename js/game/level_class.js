import { ctx, renderScale } from "../canvas_handler.js";
import { findSprite } from "../sprites.js";
import { Block } from "./blocks.js";
import { borderLength, borderThicness, gameManager } from "./game_manager.js";
import { Shop } from "./shop.js";
import { Timer } from "./timer.js";

export class Level{
    constructor({ id=0, size=6, difficulty=4, timerMiliseconds=60000, shop=null}){
        this.id = id;
        this.size = size;
        this.difficulty = difficulty;
        this.shop = shop;
        this.wormQuantity = Math.floor((difficulty * 0.033) * size * size)
        this.flagsLeft = this.wormQuantity
        this.levelScale = (128/(this.size*16))
        this.blocks = []
        this.started = false
        this.ended = false
        this.timer = new Timer({length: timerMiliseconds, whenEnd: this.lose})
        this.inShop = false
    }
    fillEmptyBlocks(){
        for (let i = 0; i < this.size; i++){
            for (let j = 0; j < this.size; j++){
                const block = new Block({posX:i, posY:j, parentLevel:this})
                this.blocks[i].push(block)
            }
        }
    }
    placeWorms(){
        let wormsPlaced = 0
        if (this.wormQuantity > Math.floor((this.size*this.size)/3)){
            this.wormQuantity = Math.floor((this.size*this.size)/3)
        }
        while(wormsPlaced < this.wormQuantity){
            const randX = Math.floor(Math.random() * this.size)
            const randy = Math.floor(Math.random() * this.size)
            const block = this.blocks[randX][randy]
            if (!block.starter && !block.content) {
                block.content = 'worm'
                wormsPlaced++
            }
        }
    }
    placeGold(){
        for (let i = 0; i < this.size; i++){
            for (let j = 0; j < this.size; j++){
                const block = this.blocks[i][j]
                if (block.starter) {
                    continue
                }
                const rngGold = Math.floor(Math.random()*1.5)
                block.gold = rngGold
            }
        }
    }
    placeExit(){
        let exitPlaced = false
        while(!exitPlaced){
            const randX = Math.floor(Math.random() * this.size)
            const randy = Math.floor(Math.random() * this.size)
            const block = this.blocks[randX][randy]
            if (!block.starter && !block.content && block.wormLevel == 0) {
                block.content = 'exit_door'
                exitPlaced = true
            }
        }
    }
    placeShop(){
        let shopPlaced = false
        while(!shopPlaced){
            const randX = Math.floor(Math.random() * this.size)
            const randy = Math.floor(Math.random() * this.size)
            const block = this.blocks[randX][randy]
            if (!block.starter && !block.content && block.wormLevel == 0) {
                block.content = 'shop_door'
                shopPlaced = true
            }
        }
    }
    start(startX, startY){
        for (let i = 0; i < this.size; i++){
            this.blocks.push([])
        }
        this.fillEmptyBlocks()
        const firstBlock = this.blocks[startX][startY]
        firstBlock.surrBlocks.forEach(block =>{
            block.starter = true
        })
        firstBlock.starter = true
        this.placeWorms()
        this.placeExit()
        this.placeGold()
        if (this.shop){
            this.placeShop()
        }
        firstBlock.break()
        firstBlock.breakSurr()
        this.started = true
        this.timer.start()
    }
    renderBlocks(){
        if (this.blocks.length == 0){
            for (let i = 0; i < this.size; i++){
                for (let j = 0; j < this.size; j++){
                    ctx.drawImage(
                        findSprite('dirt_block_hidden').img,
                        ((i * 16) * this.levelScale + borderThicness) * renderScale,
                    ((j * 16) * this.levelScale + borderThicness) * renderScale,
                    (16 * this.levelScale) * renderScale,
                    (16 * this.levelScale) * renderScale,
                )
            }
        }
    } else {
            this.blocks.forEach(row =>
                row.forEach(block =>{
                    block.render(this.levelScale)
                })
            )
        }
    }
    renderShop(){
        this.shop.render()
    }
    render(){
        if(this.inShop){
            this.renderShop()
        } else {
            this.renderBlocks()
        }
    }
    lose(){
        gameManager.currentLevel.ended = true
        gameManager.currentLevel.blocks.forEach(column => {
            column.forEach(block =>{
                if (block.marker && block.content != 'worm'){
                    block.marker = 'wrong'
                } else {
                    block.break()
                }
            })
        })
    }
    countBrokenBlocks(){
        let counter = this.size*this.size
        for (let i = 0; i < this.size; i++){
            for (let j = 0; j < this.size; j++){
                if (this.blocks[i][j].broken){
                    counter--
                }
            }
        }
        return counter
    }
    checkWin(){
        if (this.countBrokenBlocks() == this.wormQuantity){
            this.win()
        }
    }
    win(){
        this.ended = true;
        this.timer.stop()
    }

    nextLevel(startX, startY){
        const nextId = this.id + 1
        let nextSize = Math.floor(nextId/3) + 6
        let nextDificulty = (nextId%3) + Math.floor(nextId/3) + 3
        let nextShop = null
        if (nextId%3 == 1){
            nextShop = new Shop({inventory: gameManager.inventory, level: nextId})
        }
        gameManager.currentLevel = new Level({
            difficulty: nextDificulty,
            size: nextSize,
            timerMiliseconds: this.timer.miliseconds,
            id: nextId,
            shop: nextShop,
        })
        gameManager.currentLevel.start(startX, startY)
    }
}