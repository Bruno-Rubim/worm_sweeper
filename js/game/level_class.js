import { ctx, renderScale } from "..canvas_handler.js";
import { findSprite } from "..sprites.js";
import { Block } from "./blocks.js";
import { borderThicness, gameManager } from "./game_manager.js";
import { Timer } from "./timer.js";

export class Level{
    constructor({ id=0, size=6, difficulty=4, timerMiliseconds=60000}){
        this.id = id;
        this.size = size;
        this.difficulty = difficulty;
        this.wormQuantity = Math.floor((difficulty * 0.033) * size * size)
        this.flagsLeft = this.wormQuantity
        this.levelScale = (128/(this.size*16))
        this.blocks = []
        this.started = false
        this.ended = false
        this.timer = new Timer({length: timerMiliseconds, whenEnd: this.lose})
    }
    fillEmptyBlocks(){
        for (let i = 0; i < this.size; i++){
            for (let j = 0; j < this.size; j++){
                const rngGold = Math.floor(Math.random()*1.5)
                const block = new Block({posX:i, posY:j, parentLevel:this, gold:rngGold})
                this.blocks[i].push(block)
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

        let wormsPlaced = 0
        if (this.wormQuantity > Math.floor((this.size*this.size)/3)){
            this.wormQuantity = Math.floor((this.size*this.size)/3)
        }
        while(wormsPlaced < this.wormQuantity){
            const randX = Math.floor(Math.random() * this.size)
            const randy = Math.floor(Math.random() * this.size)
            const block = this.blocks[randX][randy]
            if (!block.starter && block.content != 'worm') {
                block.content = 'worm'
                wormsPlaced++
            }
        }
        let exitPlaced = false
        while(!exitPlaced){
            const randX = Math.floor(Math.random() * this.size)
            const randy = Math.floor(Math.random() * this.size)
            const block = this.blocks[randX][randy]
            if (!block.starter && block.content != 'worm' && block.wormLevel == 0) {
                block.content = 'exit_door'
                exitPlaced = true
            }
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
        gameManager.currentLevel = new Level({
            difficulty: nextDificulty,
            size: nextSize,
            timerMiliseconds: this.timer.miliseconds,
            id: nextId
        })
        gameManager.currentLevel.start(startX, startY)
    }
}