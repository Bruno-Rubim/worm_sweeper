import { ChangeCursorState, ChangeScene, EnemyAttack, LoseGame, } from "../../action.js";
import { canvasManager } from "../../canvasManager.js";
import { CURSORBATTLE } from "../../cursor.js";
import GameObject from "../../gameElements/gameObject.js";
import Position from "../../gameElements/position.js";
import { gameState } from "../../gameState.js";
import { BORDERTHICKBOTTOM, BORDERTHICKLEFT, BORDERTHICKRIGHT, BORDERTHICKTOP, CENTER, CLICKLEFT, CLICKRIGHT, GAMEHEIGHT, GAMEWIDTH, LEFT, } from "../../global.js";
import { handleMouseClick, handleMouseHover, handleMouseNotHover, } from "../../input/handleInput.js";
import playerInventory from "../../inventory/playerInventory.js";
import activeDict from "../../items/active/dict.js";
import { armorDict } from "../../items/armor/armor.js";
import passivesDict from "../../items/passiveDict.js";
import { shieldDict } from "../../items/shield/dict.js";
import { weaponDict } from "../../items/weapon/dict.js";
import { soundManager } from "../../sounds/soundManager.js";
import sounds from "../../sounds/sounds.js";
import { sprites } from "../../sprites.js";
import timeTracker from "../../timer/timeTracker.js";
import { utils } from "../../utils.js";
import { damageOverlay, stunnedOverlay } from "../overlays.js";
import SceneManager from "../sceneManager.js";
import { ScaleWorm } from "./enemy.js";
import LootSlot from "./lootSlot.js";
const ExitArrow = new GameObject({
    sprite: sprites.exit_arrow,
    height: 16,
    width: 32,
    pos: new Position(GAMEWIDTH / 2 - 16, 128),
    clickFunction: (cursorPos, button) => {
        if (button == LEFT) {
            ExitArrow.mouseHovering = false;
            soundManager.playSound(sounds.steps);
            return new ChangeScene("cave");
        }
    },
});
ExitArrow.render = () => {
    canvasManager.renderSpriteFromSheet(ExitArrow.sprite, ExitArrow.pos, ExitArrow.width, ExitArrow.height, new Position(ExitArrow.mouseHovering ? 1 : 0, 0));
};
ExitArrow.hidden;
export default class BattleManager extends SceneManager {
    lootSlot = new LootSlot();
    render = () => {
        const battle = gameState.battle;
        if (!battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        canvasManager.renderSprite(sprites.bg_battle, new Position(BORDERTHICKLEFT, BORDERTHICKTOP), GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT, GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM);
        if (battle.chest) {
            canvasManager.renderSpriteFromSheet(sprites.chest, new Position(GAMEWIDTH / 2 - 16, 40), 32, 32, new Position(battle.won ? 1 : 0, 0));
            if (battle.won && battle.chest) {
                this.lootSlot.render();
            }
            if (battle.won) {
                ExitArrow.render();
            }
        }
        battle.enemies.forEach((enemy) => {
            canvasManager.renderSpriteFromSheet(enemy.spriteSheet, enemy.pos, 64, 64, new Position(enemy.attackAnimTimer.inMotion ? 1 : 0, enemy.damagedTimer.inMotion ? 1 : 0));
            if (enemy.health > 0) {
                const roundedHealth = Math.floor(enemy.health);
                canvasManager.renderText("icons", enemy.pos.add(33, 64), "$hrt".repeat(roundedHealth) +
                    (enemy.health > roundedHealth ? "$hhr" : ""), CENTER);
            }
            if (enemy.defense > 0) {
                const roundedDefense = Math.floor(enemy.defense);
                canvasManager.renderText("icons", enemy.pos.add(33, 73), "$dfs".repeat(roundedDefense) +
                    (enemy.defense > roundedDefense ? "$hdf" : ""), CENTER);
            }
            if (enemy.spikes > 0) {
                const roundedReflection = Math.floor(enemy.spikes);
                canvasManager.renderText("icons", enemy.pos.add(33, 73), "$spk".repeat(roundedReflection) +
                    (enemy.spikes > roundedReflection ? "$hsp" : ""), CENTER);
            }
            if (enemy.stunTicStart != null) {
                canvasManager.renderAnimationFrame(sprites.stun_sprite_sheet, enemy.pos.add(enemy.stunSpriteShift), 64, 64, 4, 1, enemy.stunTicStart, 0.5);
            }
            canvasManager.renderText("numbers_gray", enemy.pos.add(34, 8), enemy.damage.toString() + "$dmg", LEFT);
            let counterFrame = Math.floor(Math.min(15, (enemy.cooldownTimer.percentage / 100) * 16));
            canvasManager.renderSpriteFromSheet(sprites.counter_sheet, enemy.pos.add(34, 8), 8, 8, new Position(counterFrame % 8, Math.floor(counterFrame / 8)));
        });
        canvasManager.renderSprite(playerInventory.weapon.item.bigSprite, new Position(BORDERTHICKLEFT - (gameState.attackAnimationTimer.inMotion ? 0 : 24), BORDERTHICKTOP + (gameState.attackAnimationTimer.inMotion ? 26 : 45)), 128, 128);
        canvasManager.renderSprite(playerInventory.shield.item.bigSprite, new Position(BORDERTHICKLEFT + (gameState.shieldUpTimer.inMotion ? 0 : 24), BORDERTHICKTOP + (gameState.shieldUpTimer.inMotion ? 26 : 45)), 128, 128);
        if (battle.won) {
            return;
        }
        if (battle.protection + battle.defense + battle.reflection > 0) {
            const reflect = battle.reflection;
            const defense = battle.defense;
            const protection = battle.protection;
            const roundedReflect = Math.floor(reflect);
            const roundedDefense = Math.floor(defense);
            const roundedProtection = Math.floor(protection);
            canvasManager.renderText("icons", new Position(GAMEWIDTH / 2, GAMEHEIGHT - BORDERTHICKBOTTOM - 11), "$ref".repeat(roundedReflect) +
                (reflect > roundedReflect ? "$hrf" : "") +
                "$dfs".repeat(roundedDefense) +
                (defense > roundedDefense ? "$hdf" : "") +
                "$pro".repeat(roundedProtection) +
                (protection > roundedProtection ? "$hpr" : ""), CENTER);
        }
        if (battle.spikes || battle.stun) {
            const spikes = battle.spikes;
            const roundedSpikes = Math.floor(spikes);
            const stun = battle.stun;
            const roundedStun = Math.floor(stun);
            canvasManager.renderText("icons", new Position(GAMEWIDTH / 2, GAMEHEIGHT -
                BORDERTHICKBOTTOM -
                (battle.defense + battle.reflection + battle.protection > 0
                    ? 20
                    : 11)), "$spk".repeat(roundedSpikes) +
                (spikes > roundedSpikes ? "$hsp" : "") +
                "$stn".repeat(roundedStun) +
                (stun > roundedStun ? "$hst" : ""), CENTER);
        }
        if (!gameState.tiredTimer.ended && gameState.tiredTimer.started) {
            let counterFrame = Math.floor(Math.min(15, (gameState.tiredTimer.percentage / 100) * 16));
            canvasManager.renderSpriteFromSheet(sprites.counter_sheet, new Position(GAMEWIDTH / 2 - 4, GAMEHEIGHT -
                BORDERTHICKBOTTOM -
                (battle.spikes + battle.stun > 0 ? 31 : 22)), 8, 8, new Position(counterFrame % 8, Math.floor(counterFrame / 8)));
        }
    };
    selectLootItem() {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const bannedNames = [
            ...playerInventory.itemNames,
            ...gameState.level.shop.itemNames,
            "gold_bug",
            "locked",
            "empty",
        ];
        const itemPool = [
            ...Object.values(weaponDict),
            ...Object.values(shieldDict),
            ...Object.values(armorDict),
            ...Object.values(activeDict),
            ...Object.values(passivesDict),
        ].filter((x) => !bannedNames.includes(x.name));
        const r = utils.randomArrayId(itemPool);
        this.lootSlot.item = itemPool[r];
    }
    checkBattleEnd() {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        if (gameState.health <= 0) {
            return new LoseGame();
        }
        gameState.battle.enemies.forEach((e, i) => {
            if (e.health <= 0) {
                e.die();
                gameState.battle.enemies.splice(i, 1);
                if (playerInventory.hasItem("carving_knife")) {
                    gameState.gold += 2;
                    soundManager.playSound(sounds.gold);
                }
                if (playerInventory.hasItem("scale_shield") && e instanceof ScaleWorm) {
                    gameState.scalesCollected = Math.min(10, gameState.scalesCollected + 1);
                }
            }
        });
        if (gameState.battle.enemies.length <= 0) {
            gameState.battle.won = true;
            ExitArrow.hidden = false;
            if (gameState.battle.chest) {
                this.selectLootItem();
                return;
            }
            return new ChangeScene("cave");
        }
    }
    playDamageOverlay() {
        damageOverlay.hidden = false;
        damageOverlay.animationTicStart = timeTracker.currentGameTic;
    }
    damagePlayer(damage) {
        if (!gameState.battle) {
            alert("not in battle");
            return 0;
        }
        if (damage <= 0) {
            return 0;
        }
        let returnDamage = gameState.battle.spikes;
        gameState.battle.spikes = 0;
        const reflection = gameState.battle.reflection;
        returnDamage += Math.min(reflection, damage);
        gameState.battle.reflection = Math.max(0, reflection - damage);
        damage = Math.max(0, damage - reflection);
        const defense = gameState.battle.defense;
        gameState.battle.defense = Math.max(0, defense - damage);
        damage = Math.max(0, damage - defense);
        if (damage > 0) {
            gameState.health -= damage;
            this.playDamageOverlay();
        }
        return returnDamage;
    }
    playerAttack() {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const rId = utils.randomArrayId(gameState.battle.enemies);
        const enemy = gameState.battle.enemies[rId];
        const weapon = playerInventory.weapon.item;
        let weaponDmg = weapon.totalDamage;
        soundManager.playSound(weapon.sound);
        if (playerInventory.hasItem("spike_polisher")) {
            gameState.battle.reflection += weapon.spikes;
        }
        else {
            gameState.battle.spikes += weapon.spikes;
        }
        let enemyReturnDmg = enemy.takeDamage(weaponDmg);
        let playerReturnDmg = this.damagePlayer(enemyReturnDmg);
        let overflow = 0;
        while (enemyReturnDmg > 0 && playerReturnDmg > 0 && overflow < 100) {
            enemyReturnDmg = enemy.takeDamage(playerReturnDmg);
            playerReturnDmg = this.damagePlayer(enemyReturnDmg);
        }
        if (overflow >= 100) {
            alert("fuck");
        }
        if (weapon.stunSecs > 0) {
            enemy.stunned(weapon.stunSecs);
        }
        gameState.attackAnimationTimer.goalSecs = weapon.cooldown / 3;
        gameState.attackAnimationTimer.start();
        const tiredTimer = gameState.tiredTimer;
        tiredTimer.goalSecs =
            (weapon.cooldown - (playerInventory.hasItem("feather") ? 0.3 : 0)) *
                playerInventory.armor.item.speedMult;
        tiredTimer.start();
        if (playerInventory.hasItem("whetstone")) {
            tiredTimer.reduceSecs(gameState.tiredTimer.goalSecs * weaponDmg * 0.05);
            console.log(weaponDmg * 0.05);
        }
        return this.checkBattleEnd();
    }
    playerDefend() {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const shield = playerInventory.shield.item;
        if (playerInventory.hasItem("glass_armor")) {
            gameState.battle.defense += Math.ceil(shield.totalDefense) / 2;
            gameState.battle.reflection += Math.floor(shield.totalDefense) / 2;
        }
        else {
            gameState.battle.defense += shield.totalDefense;
        }
        gameState.battle.reflection += shield.reflection;
        if (playerInventory.hasItem("spike_polisher")) {
            gameState.battle.reflection += shield.spikes;
        }
        else {
            gameState.battle.spikes += shield.spikes;
        }
        gameState.battle.stun += shield.stun;
        gameState.shieldUpTimer.goalSecs = shield.cooldown / 3;
        gameState.shieldUpTimer.start();
        const tiredTimer = gameState.tiredTimer;
        tiredTimer.goalSecs =
            shield.cooldown * playerInventory.armor.item.speedMult;
        tiredTimer.start();
    }
    bomb() {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const tiredTimer = gameState.tiredTimer;
        const rId = utils.randomArrayId(gameState.battle.enemies);
        const enemy = gameState.battle.enemies[rId];
        soundManager.playSound(sounds.explosion);
        enemy.takeDamage(playerInventory.hasItem("gunpowder") ? 8 : 5);
        tiredTimer.goalSecs = 2 - 2 * playerInventory.armor.item.speedMult;
        tiredTimer.goalSecs = 2 - playerInventory.armor.item.speedMult;
        tiredTimer.start();
        return this.checkBattleEnd();
    }
    stunPlayer(seconds) {
        gameState.stunnedTimer.goalSecs = seconds;
        gameState.stunnedTimer.start();
        if (gameState.tiredTimer.inMotion) {
            gameState.tiredTimer.pause();
        }
    }
    enemyAttack(action) {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const battle = gameState.battle;
        soundManager.playSound(action.enemy.biteSound);
        action.enemy.attackAnimTimer.start();
        let enemyDamage = action.enemy.damage;
        if (enemyDamage > 0 && battle.stun > 0) {
            action.enemy.stunned(battle.stun);
            battle.stun = 0;
        }
        if (action.enemy.stun > 0) {
            this.stunPlayer(action.enemy.stun);
        }
        if (gameState.shieldUpTimer.inMotion && gameState.tiredTimer.inMotion) {
            if (playerInventory.hasItem("charged_ambar")) {
                action.enemy.stunned(2);
            }
            else {
                gameState.tiredTimer.reduceSecs(gameState.tiredTimer.goalSecs *
                    (playerInventory.hasItem("led_boots") ? 0.5 : 0.3));
            }
            soundManager.playSound(sounds.parry);
        }
        let playerReturnDmg = this.damagePlayer(enemyDamage);
        let enemyReturnDmg = action.enemy.takeDamage(playerReturnDmg);
        let overflow = 0;
        while (enemyReturnDmg > 0 && playerReturnDmg > 0 && overflow < 100) {
            enemyReturnDmg = action.enemy.takeDamage(playerReturnDmg);
            playerReturnDmg = this.damagePlayer(enemyReturnDmg);
        }
        if (overflow >= 100) {
            alert("fuck");
        }
        return this.checkBattleEnd();
    }
    handleClick = () => {
        if (gameState.battle?.won && gameState.battle.chest) {
            const action = handleMouseClick([this.lootSlot, ExitArrow]);
            return action;
        }
        return;
    };
    handleHeld = (cursorPos, button) => {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        if (gameState.battle.won || gameState.stunnedTimer.inMotion) {
            return;
        }
        const tiredTimer = gameState.tiredTimer;
        if (tiredTimer.ended || !tiredTimer.started) {
            if (button == CLICKLEFT) {
                if (gameState.holding?.name == "bomb") {
                    gameState.holding = null;
                    return this.bomb();
                }
                return this.playerAttack();
            }
            else {
                if (playerInventory.hasItem("bracer")) {
                    gameState.battle.defense += 0.5;
                }
                return this.playerDefend();
            }
        }
    };
    handleHover = () => {
        if (!gameState.battle?.won) {
            return new ChangeCursorState(CURSORBATTLE);
        }
        if (gameState.battle?.won && gameState.battle.chest) {
            return handleMouseHover([this.lootSlot, ExitArrow]);
        }
    };
    handleNotHover = () => {
        if (gameState.battle?.won && gameState.battle.chest) {
            return handleMouseNotHover([this.lootSlot, ExitArrow]);
        }
    };
}
