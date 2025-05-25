import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderLength, borderThicness, gameManager } from "./game_manager.js"
import { renderNumbers } from "./game_renderer.js"
import { Timer } from "./timer.js"

const indexPosition = [
    {posX: 20 + 32, posY: 20 - 8},
    {posX: 20 + 64, posY: 20 - 12},
]

class Enemy{
    constructor({hp=3, name='worm', attackDelay=5000, damage=1, depth=0}){
        this.hp = hp
        this.name = name
        this.damage = damage
        this.attackDelay = attackDelay 
        this.attacking = false
        this.takingDamage = false
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
            (indexPosition[index].posX) * renderScale,
            (indexPosition[index].posY) * renderScale,
            64 * renderScale,
            64 * renderScale
        )
        for (let i = 0; i < this.hp;i++){
            ctx.drawImage(
                findSprite('icon_heart').img,
                (((borderLength - borderThicness - 64) - ((this.hp) * 4.5)) + (9 * i)) * renderScale,
                (borderThicness + 56) * renderScale,
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
        renderNumbers(this.attackTimer.miliseconds, 2, borderLength/2  + 10, borderThicness + 8, -1, 'centered', 'green')
    }

    die(){
        this.attackTimer.pause()
    }

    attack(){
        let damage = this.damage
        if (gameManager.player.totalReflection > 0){
            damage -= gameManager.player.totalReflection
            this.hp -= gameManager.player.totalReflection
        }
        damage -= gameManager.player.totalBlock
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

export class WormEnemy extends Enemy {
    constructor({depth=0}){
        super({
            depth: depth,
            name:'worm',
            hp: 3 + (Math.floor(depth/3)),
            attackDelay: 5000 - (Math.floor(depth/2)*50),
            damage: 1 + (Math.floor(depth/5)),
        })
    }
}

export class ScaleWormEnemy extends Enemy {
    constructor({depth=0}){
        super({
            depth: depth,
            name:'scale_worm',
            hp: 6 + (Math.floor(depth/2)),
            attackDelay: 8000 - (Math.floor(depth/2)*30),
            damage: 2 + (Math.floor(depth/3)),
        })
    }
}

export const EnemyFactory = {
    getWorm(depth){
        return new WormEnemy({depth: depth})
    },
    getScaleWorm(depth){
        return new ScaleWormEnemy({depth: depth})
    },
}