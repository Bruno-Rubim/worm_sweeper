import { ctx, renderScale } from "../canvas_handler.js"
import { findSprite } from "../sprites.js"
import { borderLength, borderThicness, gameManager } from "./game_manager.js"
import { renderNumbers } from "./game_renderer.js";

export const PICAXE = 'picaxe';
export const FLAG = 'flag';
export const CHECKER = 'checker';
export const CURSOR = 'default';

const shelfLenght = 96
const toolShelfHeight = 48
const gearShelfHeight = 80

export class Item {
    constructor({name=null, cost=30, parentShop = new Shop({}), parentList=[]}){
        this.name = name
        this.cost = cost
        this.selected = false
        this.parentShop = parentShop
        this.parentList = parentList
    }
    get sprite(){
        if (this.parentShop.selectedItem == this){
            return findSprite(this.name + '_selected').img
        }
        return findSprite(this.name).img
    }
    get descriptionSprite(){
        return findSprite('shop_description_' + this.name).img
    }
    getPurchased(){
        this.parentList.forEach((item, index) =>{
            if (item == this){
                this.parentList.splice(index, 1)
            }
        })
        console.log(this.parentList)
    }
}

const buyButton = {
    posX: 103,
    posY: 110,
    width: 21,
    height: 14,
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
    renderDescription(){
        if (!this.selectedItem){
            return
        }
        const item = this.selectedItem
        ctx.drawImage(
            item.descriptionSprite,
            (borderThicness + 4) * renderScale,
            borderThicness + 115 * renderScale,
            121 * renderScale,
            26 * renderScale
        )
        ctx.drawImage(
            buyButton.getSprite(item.cost, gameManager.gold),
            (borderThicness + buyButton.posX) * renderScale,
            (borderThicness + buyButton.posY) * renderScale,
            buyButton.width * renderScale,
            buyButton.height * renderScale
        )
        let string = item.cost.toString()
        let vector = [...string]
        renderNumbers(vector, borderThicness + 107, borderThicness + 99, -4, 'normal', 'shop_cost')
    }
    render(){
        this.renderBG()
        this.renderTools()
        this.renderGear()
        this.renderDescription()
    }

    generateItems(inventory){
        this.tools = []
        this.gear = []
        if (!inventory.includes(FLAG)){
            this.tools.push(new Item({name: FLAG, cost: 15, parentShop: this, parentList: this.tools}))
        } else if (!inventory.includes(CHECKER)){
            this.tools.push(new Item({name: CHECKER, cost: 40, parentShop: this, parentList: this.tools}))
        }
    }

    buyItem(){
        const item = this.selectedItem
        if (gameManager.gold >= item.cost){
            gameManager.inventory.push(item.name)
            item.getPurchased()
        }
        this.generateItems(gameManager.inventory)
    }

    click(posX, posY){
        if (posX > 111 &&
            posX < 128 &&
            posY > 0 &&
            posY < 16 
            ){
            gameManager.currentLevel.inShop = false
        }
        if (posX < this.tools.length*16 && posY > 32 && posY < 49){
            const item = this.tools[Math.floor(posX/16)]
            this.selectedItem = item
            return
        }
        if (posX < this.gear.length*16 && posY > 64 && posY < 81){
            const item = this.gear[Math.floor(posX/16)]
            this.selectedItem = item
            return
        }
        if (this.selectedItem &&
            posX > buyButton.posX &&
            posX < buyButton.posX + buyButton.width &&
            posY > buyButton.posY &&
            posY < buyButton.posY + buyButton.height 
        ){
            this.buyItem()
        }
        this.selectedItem = null
    }
}