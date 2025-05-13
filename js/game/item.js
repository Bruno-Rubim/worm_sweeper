import { findSprite } from "../sprites.js"
import { gameCursor, gameManager } from "./game_manager.js"

export class Item {
    constructor({name=null, cost=30, type=''}){
        this.name = name
        this.cost = cost
        this.selected = false
        this.type = type
    }
    get sprite(){
        if (this.selected){
            return findSprite(this.name + '_selected').img
        }
        return findSprite(this.name).img
    }
    get descriptionSprite(){
        return findSprite('shop_description_' + this.name).img
    }
}

export class Tool extends Item {
    constructor({name=null, cost=30, weight=1, damage=1}){
        super({name: name, cost: cost})
    }
}

export const cursorItem = new Tool({name: 'default'})
export const picaxeItem = new Tool({name: 'picaxe'})
export const flagItem = new Tool({name: 'flag', cost: 15})
export const detonatorItem = new Tool({name: 'detonator', cost: 40})
export const drillItem = new Tool({name: 'drill', cost: 50})

export class Weapon extends Item {
    constructor({name=null, cost=30, weight=1, damage=1}){
        super({name: name, cost: cost})
        this.weight = weight
        this.damage = damage
    }
    action(){
        const battle = gameManager.currentLevel.currentBattle
        battle.hitEnemy(this.damage)
    }
}

export const woodSwordItem = new Weapon({name: 'wooden_sword', cost: 0, weight: 2})

export const daggerItem = new Weapon({name: 'dagger', cost: 20, weight: 1})

export class Shield extends Item {
    constructor({name=null, cost=30, weight=1, armor=1, duration=1}){
        super({name: name, cost: cost})
        this.weight = weight
        this.armor = armor
        this.duration = duration
    }
    action(){
        gameManager.player.block(this.armor, this.duration)
    }
}

export const woodShieldItem = new Shield({name: 'wooden_shield', cost: 0, weight: 2})