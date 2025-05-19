import { findSprite } from "../sprites.js"
import { gameManager } from "./game_manager.js"

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
        return findSprite(this.name + '_shop_description').img
    }
}

export class Tool extends Item {
    constructor({name=null, cost=30, weight=1, damage=1}){
        super({name: name, cost: cost})
    }
}

export const cursorItem = new Tool({name: 'default'})
export const picaxeItem = new Tool({name: 'picaxe'})
export const flagItem = new Tool({name: 'flag'})
export const detonatorItem = new Tool({name: 'detonator', cost: 30})
export const drillItem = new Tool({name: 'drill', cost: 30})
export const darkCrystalItem = new Tool({name: 'dark_crystal', cost: 20})
export const silverBellItem = new Tool({name: 'silver_bell', cost: 30})

export class Weapon extends Item {
    constructor({name=null, cost=30, weight=1, damage=1}){
        super({name: name, cost: cost})
        this.weight = weight
        this.damage = damage
    }
    get spriteBig(){
        return findSprite(`${this.name}_big`).img
    }
    action(){
        gameManager.player.attack()
        gameManager.currentLevel.currentBattle.hitEnemy(this.damage)
    }
}

export const woodSwordItem = new Weapon({name: 'wooden_sword', cost: 0, weight: 2, damage: 1})
export const daggerItem = new Weapon({name: 'dagger', cost: 30, weight: 1.5, damage: 1})

export class Shield extends Item {
    constructor({name=null, cost=30, weight=1, block=1, duration=1}){
        super({name: name, cost: cost})
        this.weight = weight
        this.block = block
        this.duration = duration
    }
    get spriteBig(){
        return findSprite(`${this.name}_big`).img
    }
    action(){
        gameManager.player.block(this.block, this.duration)
    }
}

export const woodShieldItem = new Shield({name: 'wooden_shield', cost: 0, weight: 2, block: 1})
export const steelShieldItem = new Shield({name: 'steel_shield', cost: 35, weight: 2, block: 2})
export const lightShieldItem = new Shield({name: 'light_shield', cost: 30, weight: 1, block: 1})

export class Armor extends Item {
    constructor({name=null, cost=30, block=1, speed=0}){
        super({name: name, cost: cost})
        this.block = block
        this.speed = speed
    }
}

export const chainmailArmorItem = new Armor({name:'chainmail_armor', cost: 50, block:2})
export const swiftVestItem = new Armor({name:'swift_vest', cost: 50, block:1, speed: 0.7})

export class Consumable extends Item {
    constructor({name=null, cost=30, consume=()=>{}}){
        super({name: name, cost: cost})
        this.consume = consume
    }
}

export const healthPotionBigItem = new Consumable({name:'potion_health', cost: 15, consume: ()=>{
    gameManager.player.hp += 2
}})
export const healthPotionSmallItem = new Consumable({name:'potion_health_small', cost: 10, consume: ()=>{
    gameManager.player.hp++
}})
export const timePotionItem = new Consumable({name:'potion_time', cost: 10, consume: ()=>{
    gameManager.timer.addSeconds(20)
}})