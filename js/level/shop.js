import CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import { BORDERTHICKLEFT, BORDERTHICKRIGHT, BORDERTHICKTOP, GAMEWIDTH, } from "../global.js";
import { armorDic } from "../items/armor/armor.js";
import { consumableDic, } from "../items/consumable/consumable.js";
import { ShopItem } from "../items/shopItem.js";
import { ChangeScene } from "../action.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
import { utils } from "../utils.js";
import { itemDic } from "../items/passives/dict.js";
import { Weapon } from "../items/weapon/weapon.js";
import { Shield, shieldDic } from "../items/shield/shield.js";
import { weaponDic } from "../items/weapon/dict.js";
import TimeBlade from "../items/weapon/timeBlade.js";
const exitBtn = new GameObject({
    sprite: sprites.button_exit,
    pos: new Position(GAMEWIDTH - BORDERTHICKRIGHT - 32, BORDERTHICKTOP),
    width: 32,
    clickFunction: () => {
        return new ChangeScene("cave");
    },
});
exitBtn.render = (canvasManager) => {
    canvasManager.renderSpriteFromSheet(exitBtn.sprite, exitBtn.pos, 32, 16, new Position().add(exitBtn.mouseHovering ? 1 : 0, 0));
};
const shopItemList = Object.values(itemDic).filter((x) => x.cost > 0);
const shopArmorList = Object.values(armorDic).filter((x) => x.cost > 0);
const shopWeaponList = Object.values(weaponDic).filter((x) => x.cost > 0);
const shopShieldList = Object.values(shieldDic).filter((x) => x.cost > 0);
const shopConsList = Object.values(consumableDic).filter((x) => x.cost > 0);
const shelfItemDistance = 20;
const shelfStartDistance = 12;
export default class Shop {
    objects;
    items;
    armor;
    weapon;
    shield;
    consumable;
    gameState;
    constructor(gameState) {
        const inventoryItemNames = [
            gameState.inventory.weapon.name,
            gameState.inventory.shield.name,
            gameState.inventory.armor.name,
            gameState.inventory.passive_1?.name,
            gameState.inventory.passive_2?.name,
            gameState.inventory.passive_3?.name,
            gameState.inventory.passive_4?.name,
            gameState.inventory.passive_5?.name,
            gameState.inventory.passive_6?.name,
        ];
        this.gameState = gameState;
        this.items = utils
            .shuffleArray(shopItemList.filter((x) => !inventoryItemNames.includes(x.name)))
            .slice(0, 3)
            .map((x) => new ShopItem(x.name));
        this.items.forEach((item, i) => {
            item.pos.update(BORDERTHICKLEFT + shelfStartDistance + i * shelfItemDistance, 28);
        });
        const chosenarmor = utils.shuffleArray(shopArmorList.filter((x) => !inventoryItemNames.includes(x.name)))[0];
        this.armor = new ShopItem(chosenarmor.name);
        const chosenWeapon = utils.shuffleArray(shopWeaponList.filter((x) => !inventoryItemNames.includes(x.name)))[0];
        this.weapon = new ShopItem(chosenWeapon.name);
        if (this.weapon.item instanceof TimeBlade) {
            this.weapon.item.gameTimer = this.gameState.gameTimer;
        }
        const chosenShield = utils.shuffleArray(shopShieldList.filter((x) => !inventoryItemNames.includes(x.name)))[0];
        this.shield = new ShopItem(chosenShield.name);
        const chosenConsumable = utils.shuffleArray(shopConsList)[0];
        this.consumable = new ShopItem(chosenConsumable.name);
        this.consumable.pos.update(GAMEWIDTH - BORDERTHICKRIGHT - 28, 46);
        this.objects = [exitBtn, ...this.items, this.consumable];
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
