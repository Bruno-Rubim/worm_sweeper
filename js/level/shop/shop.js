import { canvasManager } from "../../canvasManager.js";
import GameObject from "../../gameElements/gameObject.js";
import { BORDERTHICKLEFT, BORDERTHICKRIGHT, BORDERTHICKTOP, GAMEWIDTH, } from "../../global.js";
import { ChangeScene, ResetShop, ShopItemDescription } from "../../action.js";
import Position from "../../gameElements/position.js";
import { sprites } from "../../sprites.js";
import { ShopItem } from "./shopItem.js";
import { utils } from "../../utils.js";
import { armorDic } from "../../items/armor/armor.js";
import { weaponDic } from "../../items/weapon/dict.js";
import { Shield, shieldDic } from "../../items/shield/shield.js";
import consumableDict from "../../items/consumable/dict.js";
import playerInventory from "../../playerInventory.js";
import genericDict from "../../items/genericDict.js";
const exitBtn = new GameObject({
    sprite: sprites.button_exit,
    pos: new Position(GAMEWIDTH - BORDERTHICKRIGHT - 32, BORDERTHICKTOP),
    width: 32,
    clickFunction: () => {
        return new ChangeScene("cave");
    },
});
exitBtn.render = () => {
    canvasManager.renderSpriteFromSheet(exitBtn.sprite, exitBtn.pos, 32, 16, new Position().add(exitBtn.mouseHovering ? 1 : 0, 0));
};
const resetBtn = new GameObject({
    sprite: sprites.button_reset,
    pos: new Position(GAMEWIDTH - BORDERTHICKRIGHT - 34, BORDERTHICKTOP + 56),
    width: 32,
    clickFunction: () => {
        return new ResetShop();
    },
    hoverFunction: () => {
        return new ShopItemDescription("Reset items.\n\nItems will always be different than the previous set if possible.");
    },
});
resetBtn.render = () => {
    canvasManager.renderSpriteFromSheet(resetBtn.sprite, resetBtn.pos, 32, 16, new Position().add(resetBtn.mouseHovering ? 1 : 0, 0));
};
const shopItemList = Object.values(genericDict).filter((x) => x.cost > 0);
const shopArmorList = Object.values(armorDic).filter((x) => x.cost > 0);
const shopWeaponList = Object.values(weaponDic).filter((x) => x.cost > 0);
const shopShieldList = Object.values(shieldDic).filter((x) => x.cost > 0);
const shopConsList = Object.values(consumableDict).filter((x) => x.cost > 0);
const shelfItemDistance = 20;
const shelfStartDistance = 12;
export default class Shop {
    objects;
    generics;
    armor;
    weapon;
    shield;
    consumable;
    inventoryItemNames = [];
    previousSetItemNames = [];
    constructor() {
        this.setItems();
    }
    setItems() {
        this.inventoryItemNames = [
            playerInventory.weapon.name,
            playerInventory.shield.name,
            playerInventory.armor.name,
            playerInventory.passive_1.name,
            playerInventory.passive_2.name,
            playerInventory.passive_3.name,
            playerInventory.passive_4.name,
            playerInventory.passive_5.name,
            playerInventory.passive_6.name,
            playerInventory.passive_7.name,
            playerInventory.bag.name,
        ];
        let filterNames = [
            ...this.inventoryItemNames,
            ...this.previousSetItemNames,
        ];
        this.previousSetItemNames = [];
        this.generics = utils
            .shuffleArray(shopItemList.filter((x) => !filterNames.includes(x.name)))
            .slice(0, 3)
            .map((x) => new ShopItem(x.name));
        if (this.generics.length < 3) {
            this.generics = utils
                .shuffleArray(shopItemList.filter((x) => ![...this.inventoryItemNames].includes(x.name)))
                .slice(0, 3)
                .map((x) => new ShopItem(x.name));
            console.log(this.generics);
        }
        this.generics.forEach((shopItem, i) => {
            shopItem.pos.update(BORDERTHICKLEFT + shelfStartDistance + i * shelfItemDistance, 28);
            this.previousSetItemNames.push(shopItem.item.name);
        });
        const chosenarmor = utils.shuffleArray(shopArmorList.filter((x) => !filterNames.includes(x.name)))[0];
        this.armor = new ShopItem(chosenarmor.name);
        this.previousSetItemNames.push(this.armor.item.name);
        const chosenWeapon = utils.shuffleArray(shopWeaponList.filter((x) => !filterNames.includes(x.name)))[0];
        this.weapon = new ShopItem(chosenWeapon.name);
        this.previousSetItemNames.push(this.weapon.item.name);
        const chosenShield = utils.shuffleArray(shopShieldList.filter((x) => !filterNames.includes(x.name)))[0];
        this.shield = new ShopItem(chosenShield.name);
        this.previousSetItemNames.push(this.shield.item.name);
        const chosenConsumable = utils.shuffleArray(shopConsList.filter((x) => !filterNames.includes(x.name)))[0];
        this.consumable = new ShopItem(chosenConsumable.name);
        this.consumable.pos.update(GAMEWIDTH - BORDERTHICKRIGHT - 28, 40);
        this.previousSetItemNames.push(this.consumable.item.name);
        this.objects = [exitBtn, resetBtn, ...this.generics, this.consumable];
        let xShift = shelfStartDistance;
        if (this.armor) {
            this.armor.pos.update(BORDERTHICKLEFT + xShift, 60);
            this.objects.push(this.armor);
            xShift += shelfItemDistance;
        }
        if (this.shield) {
            this.shield.pos.update(BORDERTHICKLEFT + xShift, 60);
            this.objects.push(this.shield);
            xShift += shelfItemDistance;
        }
        if (this.weapon) {
            this.weapon.pos.update(BORDERTHICKLEFT + xShift, 60);
            this.objects.push(this.weapon);
        }
    }
}
