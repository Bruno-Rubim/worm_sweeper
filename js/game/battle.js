import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { Enemy } from "./enemy.js"
import { borderLength, borderThicness, gameCursor, gameManager, loseGame } from "./game_manager.js"
import { renderNumbers } from "./game_renderer.js"
import { Shield, Weapon } from "./item.js"

export class Battle {
    constructor({parentLevel=null}){
        this.parentLevel = parentLevel
        this.enemies = [new Enemy({depth:this.parentLevel.depth})]
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
                (borderThicness + 32) * renderScale,
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
                    (((borderLength - borderThicness - 64) - ((enemy.hp) * 4.5)) + (9 * i)) * renderScale,
                    (borderThicness + 64) * renderScale,
                    8 * renderScale,
                    8 * renderScale
                )
            }
        })
    }
    
    renderPlayer(){
        let swordShiftX = 0;
        let swordShiftY = 0;
        if (!gameManager.player.swingTimer){
            swordShiftX = -18;
            swordShiftY = 22;
        }
        ctx.drawImage(
            gameManager.player.weapon.spriteBig,
            (borderThicness + swordShiftX) * renderScale,
            (borderThicness + swordShiftY) * renderScale,
            128 * renderScale,
            128 * renderScale
        )
        let shieldShiftX = 0;
        let shieldShiftY = 0;
        if (!gameManager.player.shieldTimer){
            shieldShiftX = 18;
            shieldShiftY = 22;
        }
        ctx.drawImage(
            gameManager.player.shield.spriteBig,
            (borderThicness + shieldShiftX) * renderScale,
            (borderThicness + shieldShiftY) * renderScale,
            128 * renderScale,
            128 * renderScale
        )
    }
    renderPlayerButtons(){
        ctx.drawImage(
            findSprite('battle_bar').img,
            borderThicness * renderScale,
            (borderLength - borderThicness - 26) * renderScale,
            128 * renderScale,
            26 * renderScale
        )
        if (!gameManager.ended){
            if (gameCursor.posX < borderLength/2){
                gameManager.player.weapon.selected = true
                gameManager.player.shield.selected = false
            } else {
                gameManager.player.weapon.selected = false
                gameManager.player.shield.selected = true
            }
        }
        const shieldPosX = borderLength - borderThicness - 21
        const shieldPosY = borderLength - borderThicness - 21
        ctx.drawImage(
            gameManager.player.weapon.sprite,
            (borderThicness + 5) * renderScale,
            (borderLength - borderThicness - 21) * renderScale,
            16 * renderScale,
            16 * renderScale
        )
        ctx.drawImage(
            gameManager.player.shield.sprite,
            shieldPosX * renderScale,
            shieldPosY * renderScale,
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
        for (let i = 0; i < player.armor;i++){
            ctx.drawImage(
                findSprite('icon_shield').img,
                (((borderLength/2) - (player.armor * 4.5)) + (9 * i)) * renderScale,
                (borderLength - borderThicness - 22) * renderScale,
                8 * renderScale,
                8 * renderScale
            )
        }
        if (player.actionTimer){
            renderNumbers(player.actionTimer.miliseconds, 2, (borderLength/2), borderLength - borderThicness - 36, -1, 'centered', 'gray')
        }
        // if (player.shieldTimer){
        //     renderNumbers(player.shieldTimer.miliseconds, 2, borderThicness + 45, borderLength - borderThicness - 6 - 16, -1, 'centered', 'blue')
        // }
    }
    renderUI(){
        this.renderPlayerButtons()
        this.renderPlayerStats()
    }
    updateTimers(){
        let ignore
        if (gameManager.player.actionTimer){
            ignore = gameManager.player.actionTimer.miliseconds
        }
        if (gameManager.player.shieldTimer){
            ignore = gameManager.player.shieldTimer.miliseconds
        }
        if (gameManager.player.swingTimer){
            ignore = gameManager.player.swingTimer.miliseconds
        }
    }
    render(){
        this.updateTimers()
        this.renderBg()
        this.renderEnemies()
        this.renderPlayer()
        this.renderUI()
        this.stateCheck()
    }

    pause(){
        this.enemies.forEach(enemy => {
            enemy.attackTimer.pause()
        })
        if (gameManager.player.actionTimer){
            gameManager.player.actionTimer.pause()
        }
        if (gameManager.player.shieldTimer){
            gameManager.player.shieldTimer.pause()
        }
    }
    continue(){
        this.enemies.forEach(enemy => {
            enemy.attackTimer.continue()
        })
        if (gameManager.player.actionTimer){
            gameManager.player.actionTimer.continue()
        }
        if (gameManager.player.shieldTimer){
            gameManager.player.shieldTimer.continue()
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
        if (posX < 65){
            gameManager.player.act(Weapon)
            return
        }
        if (posX > 64){
            gameManager.player.act(Shield)
            return
        }
    }
}