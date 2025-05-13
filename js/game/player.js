import { Weapon, woodShieldItem, woodSwordItem } from "./item.js"
import { Timer } from "./timer.js"

export class Player{
    constructor({inventory=[]}){
        this.hp = 5
        this.tired = false
        this.armor = 0
        this.weapon = woodSwordItem
        this.shield = woodShieldItem
        this.actionTimer = null
    }
    act(type){
        let equipment;
        if (type == Weapon){
            equipment = this.weapon
        } else {
            equipment = this.shield
        }
        equipment.action()
        this.tired = true
        this.actionTimer = new Timer({length: (equipment.weight * 1000), whenEnd: ()=>{
            this.tired = false
            this.actionTimer = null
        }})
        this.actionTimer.start()
    }
    block(ammount, seconds){
        this.armor += ammount;
        setTimeout(()=>{
            this.armor -= ammount;
        }, seconds * 1000)
    }
}