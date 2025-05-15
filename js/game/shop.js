import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderLength, borderThicness, gameManager } from "./game_manager.js"
import { renderNumbers } from "./game_renderer.js";
import { Armor, chainmailArmorItem, Consumable, daggerItem, darkCrystalItem, detonatorItem, drillItem, flagItem, healthPotionItem, Shield, steelShieldItem, timePotionItem, Weapon } from "./item.js";

const toolShelfHeight = 24
const consShelfHeight = toolShelfHeight + 18
const gearShelfHeight = toolShelfHeight + 32

const consumables = [healthPotionItem, timePotionItem]
const CONSUMED = 'consumed'

const buyButton = {
    posX: 94,
    posY: 106,
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
                (borderThicness + toolShelfHeight - 16) * renderScale,
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
                (borderThicness + gearShelfHeight - 16) * renderScale,
                16 * renderScale,
                16 * renderScale
            )
        })
    }
    renderConsumable(){
        if (this.consumable == CONSUMED || this.consumable == null){
            return
        }
        if (this.consumable == timePotionItem){
            ctx.drawImage(
                this.consumable.sprite,
                16 * (Math.floor(gameManager.timer.miliseconds/180)%12),
                0,
                16,
                16,
                (borderLength - borderThicness - 28) * renderScale,
                (borderThicness + consShelfHeight - 16) * renderScale,
                16 * renderScale,
                16 * renderScale
            )
            return
        }
        ctx.drawImage(
            this.consumable.sprite,
            (borderLength - borderThicness - 28) * renderScale,
            (borderThicness + consShelfHeight - 16) * renderScale,
            16 * renderScale,
            16 * renderScale
        )
    }
    renderDescription(){
        if (!this.selectedItem){
            return
        }
        const item = this.selectedItem
        ctx.drawImage(
            item.descriptionSprite,
            (borderThicness + 4) * renderScale,
            (borderThicness + 75) * renderScale,
            98 * renderScale,
            50 * renderScale
        )
        ctx.drawImage(
            buyButton.getSprite(item.cost, gameManager.gold),
            (borderThicness + buyButton.posX) * renderScale,
            (borderThicness + buyButton.posY) * renderScale,
            buyButton.width * renderScale,
            buyButton.height * renderScale
        )
        if (item instanceof Weapon){
            renderNumbers(item.damage, 0, borderThicness + 55, borderThicness + 86, -1, 'normal', 'red')
        }
        if (item instanceof Shield || item instanceof Weapon){
            renderNumbers(item.weight, 0, borderThicness + 49, borderThicness + 96, -1, 'normal', 'gray')
        }
        if (item instanceof Shield || item instanceof Armor){
            renderNumbers(item.block, 0, borderThicness + 39, borderThicness + 86, -1, 'normal', 'blue')
        }
        ctx.drawImage(
            findSprite('icon_gold').img,
            (borderThicness + 114) * renderScale,
            (borderThicness + 96) * renderScale,
            8 * renderScale,
            8 * renderScale
        )
        renderNumbers(item.cost, 0, borderThicness + 16, borderThicness + 96, -1, 'reversed', 'gold')
    }
    render(){
        this.renderBG()
        this.renderTools()
        this.renderGear()
        this.renderConsumable()
        this.renderDescription()
    }

    generateItems(inventory){
        this.tools = []
        if (!inventory.includes(flagItem)){
            this.tools.push(flagItem)
        } else if (!inventory.includes(detonatorItem)){
            this.tools.push(detonatorItem)
        }
        if (!inventory.includes(drillItem)){
            this.tools.push(drillItem)
        }    
        if (!inventory.includes(darkCrystalItem)){
            this.tools.push(darkCrystalItem)
        }

        this.gear = []
        if (!inventory.includes(daggerItem)){
            this.gear.push(daggerItem)
        }    
        if (!inventory.includes(steelShieldItem)){
            this.gear.push(steelShieldItem)
        }    
        if (!inventory.includes(chainmailArmorItem)){
            this.gear.push(chainmailArmorItem)
        }

        if (this.consumable == null){
            const i = Math.floor(Math.random()*consumables.length)
            this.consumable = consumables[i]
        }
    }

    buyItem(){
        const selectedItem = this.selectedItem
        if (gameManager.gold >= selectedItem.cost){
            if(selectedItem instanceof Weapon){
                gameManager.player.weapon = selectedItem
            } else if (selectedItem instanceof Shield) {
                gameManager.player.shield = selectedItem
            } else if (selectedItem instanceof Armor){
                gameManager.player.armor = selectedItem
                gameManager.player.armorBlock = selectedItem.block
            } else if (selectedItem instanceof Consumable){
                this.consumable = CONSUMED;
                selectedItem.purchase()
            }
            gameManager.inventory.push(selectedItem)
            gameManager.gold -= selectedItem.cost
            this.generateItems(gameManager.inventory)
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
            return
        }
        let item = null;
        if (posX < this.tools.length*16 && posY > toolShelfHeight - 16 && posY < toolShelfHeight){
            item = this.tools[Math.floor(posX/16)]
        }
        if (posX < this.gear.length*16 && posY > gearShelfHeight - 16 && posY < gearShelfHeight){
            item = this.gear[Math.floor(posX/16)]
        }
        if (posX > 98 && posY > consShelfHeight - 16 && posY < consShelfHeight){
            item = this.consumable
        }
        if (item){
            item.selected = true
            this.selectedItem = item
        }
    }
}