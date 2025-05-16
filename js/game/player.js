import { daggerItem, steelShieldItem, Weapon, woodShieldItem, woodSwordItem } from "./item.js"
import { Timer } from "./timer.js"

export class Player{
    constructor({}){
        this.hp = 5
        this.tired = false
        this.weapon = woodSwordItem
        this.shield = woodShieldItem
        this.armor = null
        this.shieldBlock = 0
        this.armorBlock = 0
        this.swingTimer = null
        this.shieldTimer = null
        this.actionTimer = null
    }
    get totalBlock(){
        return this.armorBlock + this.shieldBlock
    }
    act(type){
        let equipment;
        if (type == Weapon){
            equipment = this.weapon
        } else {
            equipment = this.shield
        }

        let armorSpeed = 0
        if (this.armor){
            armorSpeed = this.armor.speed
        }
        equipment.action()
        this.tired = true
        this.actionTimer = new Timer({length: ((equipment.weight - armorSpeed) * 1000), whenEnd: ()=>{
            this.tired = false
            this.actionTimer = null
        }})
        this.actionTimer.start()
    }
    attack(){
        this.swingTimer = new Timer({length: 500, whenEnd:()=>{
            this.swingTimer = null
        }})
        this.swingTimer.start()
    }
    block(ammount, seconds){
        this.shieldBlock += ammount;
        this.shieldTimer = new Timer({length: seconds * 1000, whenEnd:()=>{
            this.shieldBlock = 0
            this.shieldTimer = null
        }})
        this.shieldTimer.start()
    }
}