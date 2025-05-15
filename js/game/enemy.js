import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderLength, borderThicness, gameManager } from "./game_manager.js"
import { renderNumbers } from "./game_renderer.js"
import { Timer } from "./timer.js"

export class Enemy{
    constructor({hp=3, name='worm', attackDelay=5000, damage=1, depth=0}){
        this.hp = hp + (Math.floor(depth/3))
        this.name = name
        this.damage = damage + (Math.floor(depth/5))
        this.attacking = false
        this.takingDamage = false
        this.attackDelay = attackDelay - (Math.floor(depth/2)*500)

        this.attackTimer = new Timer({length: this.attackDelay, loop: true, 
            whenEnd:()=>{this.attack()}})
        this.attackTimer.start()
    }
    get sprite(){
        return findSprite(`${this.name}_enemy`).img
    }

    render(index){
        let spriteSheetShiftX = 0;
        let spriteSheetShiftY = 0;
        if (this.attacking){
            spriteSheetShiftX = 64
        }
        if (this.takingDamage) {
            spriteSheetShiftY = 64;
        }
        ctx.drawImage(
            this.sprite,
            spriteSheetShiftX,
            spriteSheetShiftY,
            64,
            64,
            (borderThicness + 32) * renderScale,
            borderThicness * renderScale,
            64 * renderScale,
            64 * renderScale
        )
        for (let i = 0; i < this.hp;i++){
            ctx.drawImage(
                findSprite('icon_heart').img,
                (((borderLength - borderThicness - 64) - ((this.hp) * 4.5)) + (9 * i)) * renderScale,
                (borderThicness + 64) * renderScale,
                8 * renderScale,
                8 * renderScale
            )
        }
        ctx.drawImage(
            findSprite('icon_sword').img,
            (borderThicness + 32) * renderScale,
            (borderThicness + 8) * renderScale,
            8 * renderScale,
            8 * renderScale
        )
        ctx.drawImage(
            findSprite(`numbers_red`).img,
            8 * this.damage,
            0,
            8,
            8,
            (borderThicness + 40) * renderScale,
            (borderThicness + 8) * renderScale,
            8 * renderScale,
            8 * renderScale
        )
        renderNumbers(this.attackTimer.miliseconds, 2, borderLength/2  + 10, borderThicness + 8, -1, 'centered', 'blue')
    }

    die(){
        this.attackTimer.pause()
    }

    attack(){
        let damage = this.damage - gameManager.player.totalBlock
        if (damage > 0){
            gameManager.player.hp -= damage
        }
        this.attacking = true
        setTimeout(()=>{this.attacking = false}, 200)
    }
    
    attacked(damage){
        this.hp -= damage
        this.takingDamage = true
        setTimeout(()=>{this.takingDamage = false}, 100)
    }
}