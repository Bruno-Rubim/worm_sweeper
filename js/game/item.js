import { findSprite } from "../sprites.js"
import { gameManager } from "./game_manager.js"

export class Item {
    constructor({name=null, cost=30, type='', description=null}){
        this.name = name
        this.cost = cost
        this.selected = false
        this.type = type
        this.description = description
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
    constructor({name=null, cost=30, description=null}){
        super({name: name, cost: cost, description: description})
    }
}

export const cursorItem = new Tool({name: 'default'})
export const picaxeItem = new Tool({name: 'picaxe'})
export const flagItem = new Tool({name: 'flag'})

export const detonatorItem = new Tool({name: 'detonator', cost: 32, 
    description: 'DETONATOR%Break all#unmarked#surrounding tiles'
})
export const drillItem = new Tool({name: 'drill', cost: 36, 
    description: 'DRILL%Breaking a safe#tile clears all#surrounding tiles'
})
export const darkCrystalItem = new Tool({name: 'dark_crystal', cost: 25,
    description: 'DARK CRYSTAL%Allows you to#break any tile'
})
export const silverBellItem = new Tool({name: 'silver_bell', cost: 38, 
    description: 'SILVER BELL%Shows the#location of doors'
})

export class Weapon extends Item {
    constructor({name=null, cost=30, weight=1, damage=1, description=null}){
        super({name: name, cost: cost, description: description})
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
    purchase(){
        gameManager.player.weaponItem = this;
    }
}

//item for debugging
export const impossibleSwordItem = new Weapon({name: 'big_sword', cost: 50, weight: 0.1, damage: 5})

export const woodSwordItem = new Weapon({name: 'wooden_sword', cost: 0, description:'WOODEN SWORD', weight: 2, damage: 1})
export const daggerItem = new Weapon({name: 'dagger', cost: 37, description:'DAGGER', weight: 1.5, damage: 1})
export const bigSwordItem = new Weapon({name: 'big_sword', cost: 50, description:'BIG SWORD', weight: 3, damage: 3})

export class Shield extends Item {
    constructor({name=null, cost=30, description=null, weight=1, block=0, reflection=0, duration=1}){
        super({name: name, cost: cost, description: description})
        this.weight = weight
        this.block = block
        this.reflection = reflection
        this.duration = duration
    }
    get spriteBig(){
        return findSprite(`${this.name}_big`).img
    }
    action(){
        gameManager.player.block(this.block, this.reflection, this.duration)
    }
    purchase(){
        gameManager.player.shieldItem = this;
    }
}

export const woodShieldItem = new Shield({name: 'wooden_shield', description:'WOODEN SHIELD', cost: 0, weight: 2, block: 1})
export const steelShieldItem = new Shield({name: 'steel_shield', description:'STEEL SHIELD', cost: 35, weight: 2, block: 2})
export const lightShieldItem = new Shield({name: 'light_shield', description:'LIGHT SHIELD', cost: 30, weight: 1, block: 1})
export const jadeShieldItem = new Shield({name: 'jade_shield', description:'JADE SHIELD', cost: 41, weight: 2, reflection:1})

export class Armor extends Item {
    constructor({name=null, cost=30, description=null, block=1, reflection=0, speed=0}){
        super({name: name, cost: cost, description: description})
        this.block = block
        this.reflection = reflection
        this.speed = speed
    }
    purchase(){
        gameManager.player.armorItem = this;
    }
}

export const chainmailArmorItem = new Armor({name:'chainmail_armor', description:'CHAINMAIL ARMOR', cost: 50, block:2})
export const swiftVestItem = new Armor({name:'swift_vest', description:'SWIFT VEST', cost: 50, block:1, speed: 0.7})

export class Consumable extends Item {
    constructor({name=null, cost=30, description=null, healing=null, secondsAdd=null, consume=()=>{}}){
        super({name: name, cost: cost, description: description})
        this.healing = healing
        this.secondsAdd = secondsAdd
        this.consume = consume
    }
}

export const healthPotionBigItem = new Consumable({name:'potion_health', cost: 15, healing: 2,
    description: 'BIG HEALTH#POTION%Gives you:',
    consume: ()=>{
    gameManager.player.hp += this.healing
}})
export const healthPotionSmallItem = new Consumable({name:'potion_health_small', cost: 10, healing: 1,
    description: 'SMALL HEALTH#POTION%Gives you:',
    consume: ()=>{
    gameManager.player.hp += this.healing
}})
export const timePotionItem = new Consumable({name:'potion_time', cost: 10, secondsAdd: 60,
    description: 'TIME POTION%Gives you:',
    consume: ()=>{
    gameManager.timer.addSeconds(this.secondsAdd)
}})