import { ctx, renderScale } from "../canvas_handler.js";
import { findSprite } from "../sprites.js";
import { Timer } from "../time_manager.js";
import { Block } from "./blocks.js";
import { borderThicness, gameManager } from "./game_manager.js";

export class Level{
    constructor({size=8, difficulty=5, timerMiliseconds=100000}){
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

        let wormsDelivered = 0
        while(wormsDelivered < this.wormQuantity){
            const randX = Math.floor(Math.random() * this.size)
            const randy = Math.floor(Math.random() * this.size)
            const block = this.blocks[randX][randy]
            if (!block.starter && !block.worm) {
                block.worm = true
                wormsDelivered++
            }
        }
        firstBlock.break()
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
                if (block.marker && !block.worm){
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
        console.log('contrags')
    }
}