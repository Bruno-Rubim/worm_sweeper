import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderThicness } from "./game_manager.js"
import { Level } from "./level_class.js"

const THREAT = 'threat'
const UNSURE = 'unsure'

export class Block{
    constructor({posX=0, posY=0, content=null, gold=true, parentLevel=new Level({})}){
        this.posX = posX
        this.posY = posY
        this.hidden = true
        this.broken = false
        this.worm = false
        this.gold = gold
        this.content = content
        this.parentLevel = parentLevel
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
            if (block.worm){
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
    get sprite(){
        if (this.broken){
            if (this.worm){
                return findSprite('worm').img
            }
            return findSprite('ground_numbers').img
        }
        if (this.hidden){
            return findSprite(`dirt_block_hidden`).img
        }
        if (this.gold){
            return findSprite(`dirt_block_gold`).img
        }
        return findSprite(`dirt_block_unknown`).img
    }

    render(levelScale){
        if (this.broken && !this.worm){
            ctx.drawImage(
                this.sprite,
                this.wormLevel*16,
                0,
                16,
                16,
                ((this.posX * 16) * levelScale + borderThicness) * renderScale,
                ((this.posY * 16) * levelScale + borderThicness) * renderScale,
                (16 * levelScale) * renderScale,
                (16 * levelScale) * renderScale,
            )
        } else {
            ctx.drawImage(
                this.sprite,
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
    breakSurr(){
        this.surrBlocks.forEach(block => {
            if (block.broken){
                return
            }
            block.break()
            if (block.wormLevel == 0){
                block.breakSurr()
            }
        });
    }   
    break(){
        if (this.marker != null){
            return
        }
        if (this.broken){
            this.check()
            return
        }
        if (this.parentLevel.ended && this.wormLevel == 0 && !this.worm){
            return
        }
        this.broken = true
        this.revealAdjc()
        if (this.wormLevel == 0 && !this.worm){
            this.breakSurr()
        }
        if (this.worm && !this.parentLevel.ended){
            this.parentLevel.lose()
            this.parentLevel.timer.stop()
        }
    }

    mark(){
        if(this.broken || this.parentLevel.ended){
            return
        }
        if (this.marker == null){
            this.marker = THREAT
            this.parentLevel.flagsLeft --
            return
        }
        if (this.marker == THREAT){
            this.marker = UNSURE
            return
        }
        if (this.marker == UNSURE){
            this.marker = null
            this.parentLevel.flagsLeft ++
            return
        }
    }

    check(){
        if (this.surrMarkerCount == this.wormLevel){
            this.breakSurr()
        }
    }
}