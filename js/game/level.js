import { ctx, renderScale } from "../canvas_handler.js";
import { findSprite } from "../sprites.js";
import { Battle } from "./battle.js";
import { Block } from "./blocks.js";
import { borderThicness, gameManager } from "./game_manager.js";
import { Shop } from "./shop.js";

//new Shop({inventory:[]})

export class Level{
    constructor({depth=0, size=6, difficulty=4, shop=null}){
        this.depth = depth;
        this.size = size;
        this.difficulty = difficulty;
        this.shop = shop;
        this.wormQuantity = Math.floor((difficulty * 0.033) * size * size)
        this.wormsLeft = this.wormQuantity
        this.levelScale = (128/(this.size*16))
        this.blocks = []
        this.started = false
        this.inShop = false
        this.currentBattle = null
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
                const rngGold = Math.floor(Math.random()*1.7)
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
        if (this.currentBattle){
            this.currentBattle.render()
            return
        }
        if(this.inShop){
            this.renderShop()
            return
        }
        this.renderBlocks()
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
    checkClear(){
        if (this.countBrokenBlocks() == this.wormQuantity){
            gameManager.timer.addSeconds(20)
        }
    }

    startBattle(){
        this.currentBattle = new Battle({parentLevel:this})
    }    

    nextLevel(startX, startY){
        gameManager.timer.addSeconds(60)
        const nextDepth = this.depth + 1
        let nextSize = Math.floor(nextDepth/3) + 6
        let nextDificulty = (nextDepth%3) + Math.floor(nextDepth/3) + 4
        let nextShop = null
        if (nextDepth%3 == 1){
            nextShop = new Shop({inventory: gameManager.inventory, level: nextDepth})
        }
        gameManager.currentLevel = new Level({
            difficulty: nextDificulty,
            size: nextSize,
            depth: nextDepth,
            shop: nextShop,
        })
        gameManager.currentLevel.start(startX, startY)
    }
}