import { chainmailArmorItem, daggerItem, jadeShieldItem, steelShieldItem, Weapon, woodShieldItem, woodSwordItem } from "./item.js"
import { Timer } from "./timer.js"

export class Player{
    constructor({}){
        this.hp = 5
        this.tired = false
        this.weaponItem = woodSwordItem
        this.shieldItem = woodShieldItem
        this.armorItem = null
        this.shieldBlock = 0
        this.shieldDmgReflection = 0
        this.swingTimer = null
        this.shieldTimer = null
        this.actionTimer = null
    }
    get totalBlock(){
        if (this.armorItem){
            return this.armorItem.block + this.shieldBlock
        }
        return this.shieldBlock
    }
    get totalReflection(){
        if (this.armorItem){
            return this.armorItem.reflection + this.shieldDmgReflection
        }
        return this.shieldDmgReflection
    }
    act(type){
        let equipment;
        if (type == Weapon){
            equipment = this.weaponItem
        } else {
            equipment = this.shieldItem
        }

        let armorSpeed = 0
        if (this.armorItem){
            armorSpeed = this.armorItem.speed
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
    block(blocking, reflecting, seconds){
        this.shieldBlock += blocking;
        this.shieldDmgReflection += reflecting;
        this.shieldTimer = new Timer({length: seconds * 1000, whenEnd:()=>{
            this.shieldBlock = 0
            this.shieldDmgReflection = 0
            this.shieldTimer = null
        }})
        this.shieldTimer.start()
    }
}