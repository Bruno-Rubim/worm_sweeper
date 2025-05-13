import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderLength, borderThicness, gameManager, loseGame } from "./game_manager.js"
import { renderNumbers } from "./game_renderer.js"
import { Shield, Weapon } from "./item.js"
import { Timer } from "./timer.js"

export class Enemy{
    constructor({hp=5, name='worm', attackDelay=5000, damage=1}){
        this.hp = hp
        this.name = name
        this.damage = damage
        this.attacking = false
        this.takingDamage = false

        this.attackTimer = new Timer({length: attackDelay, loop: true, 
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
            (borderThicness + 64) * renderScale,
            borderThicness * renderScale,
            64 * renderScale,
            64 * renderScale
        )
        const string = this.attackTimer.miliseconds.toString()
        const vector = [...string]
        vector.pop()
        vector.pop()
        renderNumbers(vector, borderLength - borderThicness - 16, borderThicness + 16, -1, 'normal', 'blue')
    }

    die(){
        this.attackTimer.stop()
    }

    attack(){
        gameManager.player.hp -= (this.damage - gameManager.player.armor)
        this.attacking = true
        setTimeout(()=>{this.attacking = false}, 200)
    }
    
    attacked(damage){
        this.hp -= damage
        this.takingDamage = true
        setTimeout(()=>{this.takingDamage = false}, 50)
    }
}

export class Battle {
    constructor({parentLevel=null}){
        this.parentLevel = parentLevel
        this.enemies = [new Enemy({})]
    }
    renderBg(){
        ctx.drawImage(
            findSprite('battle_bg').img,
            borderThicness * renderScale,
            borderThicness * renderScale,
            128 * renderScale,
            128 * renderScale
        )
    }

    renderEnemies(){
        this.enemies.forEach((enemy, index)=>{
            ctx.drawImage(
                findSprite('enemy_shadow').img,
                (borderThicness + 64) * renderScale,
                borderThicness * renderScale,
                64 * renderScale,
                64 * renderScale
            )
        })
        this.enemies.forEach((enemy, index)=>{
            enemy.render(index)
            for (let i = 0; i < enemy.hp;i++){
                ctx.drawImage(
                    findSprite('icon_heart').img,
                    (((borderLength - borderThicness - 32) - ((enemy.hp) * 4.5)) + (9 * i)) * renderScale,
                    (borderThicness + 64) * renderScale,
                    8 * renderScale,
                    8 * renderScale
                )
            }
        })
    }

    renderPlayer(){
        ctx.drawImage(
            findSprite('player_shadow').img,
            borderThicness * renderScale,
            (borderThicness + 38) * renderScale,
            64 * renderScale,
            64 * renderScale
        )
        if (gameManager.player.actionTimer){
            const ignore = gameManager.player.actionTimer.miliseconds
        }
    }
    renderPlayerButtons(){
        ctx.drawImage(
            gameManager.player.weapon.sprite,
            (borderThicness + 5) * renderScale,
            (borderLength - borderThicness - 21) * renderScale,
            16 * renderScale,
            16 * renderScale
        )
        ctx.drawImage(
            gameManager.player.shield.sprite,
            (borderThicness + 20 + 5) * renderScale,
            (borderLength - borderThicness - 21) * renderScale,
            16 * renderScale,
            16 * renderScale
        )        
        if (gameManager.player.tired){
            ctx.drawImage(
                findSprite('tired_overlay').img,
                borderThicness * renderScale,
                (borderLength - borderThicness - 26) * renderScale,
                128 * renderScale,
                26 * renderScale
            )
        }
    }
    renderPlayerStats(){
        const player = gameManager.player
        for (let i = 0; i < player.hp;i++){
            ctx.drawImage(
                findSprite('icon_heart').img,
                (borderThicness + 45 + (9 * i)) * renderScale,
                (borderLength - borderThicness - 5 - 8) * renderScale,
                8 * renderScale,
                8 * renderScale
            )
        }
        for (let i = 0; i < player.armor;i++){
            ctx.drawImage(
                findSprite('icon_shield').img,
                (borderThicness + 45 + (9 * (i + player.hp))) * renderScale,
                (borderLength - borderThicness - 5 - 8) * renderScale,
                8 * renderScale,
                8 * renderScale
            )
        }
        if (player.actionTimer){
            const string = player.actionTimer.miliseconds.toString()
            const vector = [...string]
            vector.pop()
            vector.pop()
            renderNumbers(vector, borderThicness + 45, borderLength - borderThicness - 6 - 16, -1, 'normal', 'blue')
        }
    }

    renderUI(){
        this.renderPlayerButtons()
        this.renderPlayerStats()
    }
    render(){
        this.renderBg()
        this.renderEnemies()
        this.renderPlayer()
        this.renderUI()
        this.stateCheck()
    }

    pause(){
        this.enemies.forEach(enemy => {
            enemy.attackTimer.stop()
        })
        if (gameManager.player.actionTimer){
            gameManager.player.actionTimer.stop()
        }
    }

    stateCheck(){
        if (this.enemies[0]?.hp <= 0){
            this.parentLevel.wormsLeft--
            this.enemies = []
            setTimeout(()=>{
                this.parentLevel.currentBattle = null
            }, 1000)
            return
        }
        if (gameManager.player.hp <= 0){
            this.pause()
            loseGame()
        }
    }

    hitEnemy(value){
        this.enemies[0].attacked(value)
        this.stateCheck()
    }

    click(posX, posY){
        if (gameManager.player.tired || this.enemies.length <= 0){
            return
        }
        if (posX > 5 && posX < 19 && posY > 106 && posY < 128 ){
            gameManager.player.act(Weapon)
            return
        }
        if (posX > 25 && posX < 39 && posY > 106 && posY < 128 ){
            gameManager.player.act(Shield)
            return
        }
    }
}