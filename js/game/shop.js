import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { getNow } from "../time_manager.js";
import { borderLength, borderThicness, gameManager } from "./game_manager.js"
import { renderNumbers, renderShopDescription } from "./game_renderer.js";
import { Armor, bigSwordItem, chainmailArmorItem, Consumable, daggerItem, darkCrystalItem, detonatorItem, drillItem, healthPotionBigItem, healthPotionSmallItem, jadeShieldItem, Shield, silverBellItem, steelShieldItem, swiftVestItem, timePotionItem, Weapon } from "./item.js";

const shelfHeightTool = 24
const shelfHeightCons = shelfHeightTool + 18
const shelfHeightGear = shelfHeightTool + 32

const tool1Items = [detonatorItem, drillItem]
const tool2Items = [darkCrystalItem, silverBellItem]

const weaponItems = [bigSwordItem, daggerItem]
const shieldItems = [steelShieldItem, jadeShieldItem]
const armorItems = [chainmailArmorItem, swiftVestItem]
const consumableItems = [healthPotionBigItem, healthPotionSmallItem, timePotionItem]

const buyButton = {
    posX: 94,
    posY: 88,
    width: 28,
    height: 17,
    getSprite(cost, playerGold){
        if (playerGold >= cost){
            return findSprite('shop_buy_button').img
        }
        return findSprite('shop_buy_button_poor').img
    }
}

export class Shop {
    constructor({level=3, inventory=[]}){
        this.level = level
        this.tools = []
        this.gear = []
        this.selectedItem = null
        this.consumable = null
        this.generateItems(inventory)
    }
    renderBG(){
        ctx.drawImage(
            findSprite('shop_bg').img,
            borderThicness * renderScale,
            borderThicness * renderScale,
            (borderLength - (borderThicness * 2)) * renderScale,
            (borderLength - (borderThicness * 2)) * renderScale,
        )
    }
    renderTools(){
        this.tools.forEach((tool, index) => {
            ctx.drawImage(
                tool.sprite,
                (borderThicness + (16 * (index))) * renderScale,
                (borderThicness + shelfHeightTool - 16) * renderScale,
                16 * renderScale,
                16 * renderScale
            )
        })
    }
    renderGear(){
        this.gear.forEach((tool, index) => {
            ctx.drawImage(
                tool.sprite,
                (borderThicness + (16 * (index))) * renderScale,
                (borderThicness + shelfHeightGear - 16) * renderScale,
                16 * renderScale,
                16 * renderScale
            )
        })
    }
    renderConsumable(){
        if (this.consumable == null){
            return
        }
        ctx.drawImage(
            this.consumable.sprite,
            (borderLength - borderThicness - 28) * renderScale,
            (borderThicness + shelfHeightCons - 16) * renderScale,
            16 * renderScale,
            16 * renderScale
        )
        if (this.consumable == timePotionItem){
            ctx.drawImage(
                findSprite('potion_time_pointer_minute').img,
                16 * (Math.floor(getNow()/120)%12),
                0,
                16,
                16,
                (borderLength - borderThicness - 28) * renderScale,
                (borderThicness + shelfHeightCons - 16) * renderScale,
                16 * renderScale,
                16 * renderScale
            )
            ctx.drawImage(
                findSprite('potion_time_pointer_hour').img,
                16 * (Math.floor(getNow()/1440)%12),
                0,
                16,
                16,
                (borderLength - borderThicness - 28) * renderScale,
                (borderThicness + shelfHeightCons - 16) * renderScale,
                16 * renderScale,
                16 * renderScale
            )
        }
    }
    renderDescription(){
        if (!this.selectedItem){
            return
        }
        const item = this.selectedItem

        if (item.description){
            renderShopDescription(item)
        }
        ctx.drawImage(
            buyButton.getSprite(item.cost, gameManager.gold),
            (borderThicness + buyButton.posX) * renderScale,
            (borderThicness + buyButton.posY) * renderScale,
            buyButton.width * renderScale,
            buyButton.height * renderScale
        )
    }
    render(){
        this.renderBG()
        this.renderTools()
        this.renderGear()
        this.renderConsumable()
        this.renderDescription()
    }

    generateItems(inventory){
        let tool1Selected = false
        let tool1Options = [...tool1Items]
        while (!tool1Selected && tool1Options.length > 0){
            const r = Math.floor(Math.random()*tool1Options.length)
            const tool1 = tool1Options[r]
            if (!(inventory.includes(tool1))){
                this.tools.push(tool1)
                tool1Selected = true
            }
            tool1Options.splice(r, 1)
        }

        let tool2Selected = false
        let tool2Options = [...tool2Items]
        while (!tool2Selected && tool2Options.length > 0){
            const r = Math.floor(Math.random()*tool2Options.length)
            const tool2 = tool2Options[r]
            if (!(inventory.includes(tool2))){
                this.tools.push(tool2)
                tool2Selected = true
            }
            tool2Options.splice(r, 1)
        }

        let tool3Options = tool1Options.concat(tool2Options)
        if (tool3Options.length > 0){
            const r = Math.floor(Math.random()*tool3Options.length)
            const tool3 = tool3Options[r]
            if (!(inventory.includes(tool3))){
                this.tools.push(tool3)
            }
        }

        let weaponSelected = false
        let weaponOptions = [...weaponItems]
        while (!weaponSelected && weaponOptions.length > 0){
            const r = Math.floor(Math.random()*weaponOptions.length)
            const weapon = weaponOptions[r]
            if (!(inventory.includes(weapon))){
                this.gear.push(weapon)
                weaponSelected = true
            }
            weaponOptions.splice(r, 1)
        }
        
        let shieldSelected = false
        let shieldOptions = [...shieldItems]
        while (!shieldSelected && shieldOptions.length > 0){
            const r = Math.floor(Math.random()*shieldOptions.length)
            const shield = shieldOptions[r]
            if (!(inventory.includes(shield))){
                this.gear.push(shield)
                shieldSelected = true
            }
            shieldOptions.splice(r, 1)
        }

        let armorSelected = false
        let armorOptions = [...armorItems]
        while (!armorSelected && armorOptions.length > 0){
            const r = Math.floor(Math.random()*armorOptions.length)
            const armor = armorOptions[r]
            if (!(inventory.includes(armor))){
                this.gear.push(armor)
                armorSelected = true
            }
            armorOptions.splice(r, 1)
        }
        
        const i = Math.floor(Math.random()*consumableItems.length)
        this.consumable = consumableItems[i]
    }

    buyItem(){
        const selectedItem = this.selectedItem
        if (gameManager.gold >= selectedItem.cost){
            if (!(selectedItem instanceof Weapon) &&
                !(selectedItem instanceof Shield) &&
                !(selectedItem instanceof Armor)
                ){
                if (selectedItem instanceof Consumable){
                    this.consumable = null;
                    selectedItem.consume()
                } else {
                    this.tools.forEach((tool, index) => {
                        if (tool == selectedItem){
                            this.tools.splice(index, 1)
                        }
                    })
                }
            } else {
                this.gear.forEach((gear, index) => {
                    if (gear == selectedItem){
                        this.gear.splice(index, 1)
                    } else {
                    }
                })
                selectedItem.purchase()
            }
            gameManager.inventory.push(selectedItem)
            gameManager.gold -= selectedItem.cost
        }
    }

    click(posX, posY){
        if (this.selectedItem &&
            posX > buyButton.posX &&
            posX < buyButton.posX + buyButton.width &&
            posY > buyButton.posY &&
            posY < buyButton.posY + buyButton.height 
        ){
            this.buyItem()
        }

        if (this.selectedItem){
            this.selectedItem.selected = false
            this.selectedItem = null
        }
        if (posX > 111 &&
            posX < 128 &&
            posY > 0 &&
            posY < 16 ){

            gameManager.currentLevel.inShop = false
            gameManager.timer.continue()
            return
        }
        let item = null;
        if (posX < this.tools.length*16 && posY > shelfHeightTool - 16 && posY < shelfHeightTool){
            item = this.tools[Math.floor(posX/16)]
        }
        if (posX < this.gear.length*16 && posY > shelfHeightGear - 16 && posY < shelfHeightGear){
            item = this.gear[Math.floor(posX/16)]
        }
        if (posX > 98 && posY > shelfHeightCons - 16 && posY < shelfHeightCons){
            item = this.consumable
        }
        if (item){
            item.selected = true
            this.selectedItem = item
        }
    }
}