import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderThicness, gameManager } from "./game_manager.js"
import { Level } from "./level.js"
import { detonatorItem, flagItem, cursorItem, drillItem, darkCrystalItem } from "./item.js"
import { Battle } from "./battle.js"

const THREAT = 'threat'
const UNSURE = 'unsure'

const secondsGained = 3

export class Block{
    constructor({posX=0, posY=0, gold=false, parentLevel=new Level({})}){
        this.posX = posX
        this.posY = posY
        this.gold = gold
        this.parentLevel = parentLevel
        this.hidden = true
        this.broken = false
        this.content = null
        this.starter = false
        this.marker = null
    }
    get adjcBlocks(){
        let surrBlocks = []
        if (this.posX != 0){
            surrBlocks.push(this.parentLevel.blocks[this.posX-1][this.posY])
        }
        if (this.posY != 0){
            surrBlocks.push(this.parentLevel.blocks[this.posX][this.posY-1])
        }
        if (this.posX != this.parentLevel.size-1){
            surrBlocks.push(this.parentLevel.blocks[this.posX+1][this.posY])
        }
        if (this.posY != this.parentLevel.size-1){
            surrBlocks.push(this.parentLevel.blocks[this.posX][this.posY+1])
        }
        return surrBlocks
    }
    get surrBlocks(){
        let surrBlocks = []
        if (this.posX != 0){
            surrBlocks.push(this.parentLevel.blocks[this.posX-1][this.posY])
            if (this.posY != 0){
                surrBlocks.push(this.parentLevel.blocks[this.posX-1][this.posY-1])
            }
        }
        if (this.posY != 0){
            surrBlocks.push(this.parentLevel.blocks[this.posX][this.posY-1])
            if (this.posX != this.parentLevel.size-1){
                surrBlocks.push(this.parentLevel.blocks[this.posX+1][this.posY-1])
            }
        }
        if (this.posX != this.parentLevel.size-1){
            surrBlocks.push(this.parentLevel.blocks[this.posX+1][this.posY])
            if (this.posY != this.parentLevel.size-1){
                surrBlocks.push(this.parentLevel.blocks[this.posX+1][this.posY+1])
            }
        }
        if (this.posY != this.parentLevel.size-1){
            surrBlocks.push(this.parentLevel.blocks[this.posX][this.posY+1])
            if (this.posX != 0){
                surrBlocks.push(this.parentLevel.blocks[this.posX-1][this.posY+1])
            }
        }
        return surrBlocks
    }
    get wormLevel(){
        let wormLevel = 0
        this.surrBlocks.forEach(block => {
            if (block.content == 'worm'){
                wormLevel++
            }
        });
        return wormLevel
    }
    get surrMarkerCount(){
        let count = 0
        this.surrBlocks.forEach(block => {
            if (block.marker){
                count++
            }
        });
        return count
    }

    get blockSprite(){
        if (this.broken){
            return findSprite('empty').img
        }
        if (this.hidden){
            return findSprite(`dirt_block_hidden`).img
        }
        return findSprite(`dirt_block_unknown`).img
    }

    get contentSprite(){
        if (this.broken){
            if (this.content){
                return findSprite(this.content).img
            }
            return findSprite('ground_numbers').img
        }
        if (this.gold && !this.hidden){
            return findSprite('gold_ore').img
        }
        return false
    }

    render(levelScale){
        ctx.drawImage(
            this.blockSprite,
            ((this.posX * 16) * levelScale + borderThicness) * renderScale,
            ((this.posY * 16) * levelScale + borderThicness) * renderScale,
            (16 * levelScale) * renderScale,
            (16 * levelScale) * renderScale,
        )
        if (this.broken){
                if (!this.content){
                ctx.drawImage(
                    this.contentSprite,
                    this.wormLevel*16,
                    0,
                    16,
                    16,
                    ((this.posX * 16) * levelScale + borderThicness) * renderScale,
                    ((this.posY * 16) * levelScale + borderThicness) * renderScale,
                    (16 * levelScale) * renderScale,
                    (16 * levelScale) * renderScale,
                )
                return
            }
        }
        if (this.contentSprite){
            ctx.drawImage(
                this.contentSprite,
                ((this.posX * 16) * levelScale + borderThicness) * renderScale,
                ((this.posY * 16) * levelScale + borderThicness) * renderScale,
                (16 * levelScale) * renderScale,
                (16 * levelScale) * renderScale,
            )
        }
        if (this.marker){
            ctx.drawImage(
                findSprite(`marker_${this.marker}`).img,
                ((this.posX * 16) * levelScale + borderThicness) * renderScale,
                ((this.posY * 16) * levelScale + borderThicness) * renderScale,
                (16 * levelScale) * renderScale,
                (16 * levelScale) * renderScale,
            )
            return
        }
    }

    reveal(){
        if (this.hidden){
            this.hidden = false
        }
    }
    revealAdjc(){
        this.adjcBlocks.forEach(block => {
            if (block == undefined){
                return
            }
            block.reveal()
        });
    }
    breakAdjc(){
        this.adjcBlocks.forEach(block => {
            if (block.broken){
                return
            }
            block.break()
        });
    }
    breakSurr(){
        this.surrBlocks.forEach(block => {
            if (block.broken){
                return
            }
            block.break()
        });
    }
    break(){
        if (this.marker != null){
            return
        }
        if (gameManager.ended && this.wormLevel == 0 && this.content != 'worm'){
            return
        } else {
            // gameManager.timer.addSeconds(secondsGained)
        }
        if (this.broken){
            this.check()
            return
        }
        this.broken = true
        if (this.gold){
            gameManager.gold++
        }
        this.parentLevel.checkClear()
        this.revealAdjc()
        if (this.wormLevel == 0 && this.content != 'worm'){
            if (gameManager.inventory.includes(drillItem)){
                this.breakAdjc()
            }
        }
        if (this.content == 'worm' && !gameManager.ended){
            setTimeout(()=>{
                this.content = null
                this.parentLevel.startBattle()
            }, 500)
        } else {
            this.parentLevel.blockCount--
        }
    }

    mark(){
        if (!this.parentLevel.started){
            return
        }
        if(this.broken || gameManager.ended){
            return
        }
        if (this.marker == null){
            this.marker = THREAT
            return
        }
        if (this.marker == THREAT){
            this.marker = null
            return
        }
    }
    check(){
        if (this.surrMarkerCount == this.wormLevel){
            this.breakSurr()
        }
    }

    click(tool){
        if (tool == flagItem){
            this.mark()
            return
        }
        if (this.hidden && !(gameManager.inventory.includes(darkCrystalItem))){
            return
        }
        if (!this.broken && tool != cursorItem){
            this.break()
            return
        }
        if (this.content == 'exit_door') {
            this.content = 'exit_door_open'
            return
        }
        if (this.content == 'exit_door_open') {
            this.parentLevel.nextLevel(this.posX, this.posY)
            return
        }
        if (this.content == 'shop_door') {
            this.content = 'shop_door_open'
            return
        }
        if (this.content == 'shop_door_open') {
            this.parentLevel.inShop = true
            return
        }
        if (gameManager.inventory.includes(detonatorItem)){
            this.check()
        }
    }
}