import { ChangeCursorState, ChangeScene, EnemyAtack } from "../../action.js";
import { canvasManager } from "../../canvasManager.js";
import { CURSORBATTLE } from "../../cursor.js";
import GameObject from "../../gameElements/gameObject.js";
import Position from "../../gameElements/position.js";
import { gameState } from "../../gameState.js";
import { BORDERTHICKBOTTOM, BORDERTHICKLEFT, BORDERTHICKRIGHT, BORDERTHICKTOP, CENTER, CLICKLEFT, CLICKRIGHT, GAMEHEIGHT, GAMEWIDTH, LEFT, } from "../../global.js";
import playerInventory, { hasItem } from "../../playerInventory.js";
import { soundManager } from "../../soundManager.js";
import sounds from "../../sounds.js";
import { sprites } from "../../sprites.js";
import timeTracker from "../../timer/timeTracker.js";
import { utils } from "../../utils.js";
import SceneManager from "../sceneManager.js";
const damageOverlay = new GameObject({
    sprite: sprites.damage_sheet,
    height: 128,
    width: 128,
    pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
});
damageOverlay.render = () => {
    if (damageOverlay.hidden) {
        return;
    }
    canvasManager.renderAnimationFrame(damageOverlay.sprite, damageOverlay.pos, damageOverlay.width, damageOverlay.height, 4, 1, damageOverlay.firstAnimationTic, timeTracker.currentGameTic, 1, new Position(), false);
};
damageOverlay.hidden;
export default class BattleManager extends SceneManager {
    render = () => {
        const battle = gameState.battle;
        if (!battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        canvasManager.renderSprite(sprites.bg_battle, new Position(BORDERTHICKLEFT, BORDERTHICKTOP), GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT, GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM);
        battle.enemies.forEach((enemy) => {
            canvasManager.renderSpriteFromSheet(enemy.spriteSheet, enemy.pos, 64, 64, new Position(enemy.attackAnimTimer.inMotion ? 1 : 0, enemy.damagedTimer.inMotion ? 1 : 0));
            if (enemy.health > 0) {
                const roundedHealth = Math.floor(enemy.health);
                canvasManager.renderText("icons", enemy.pos.add(33, 64), "$hrt".repeat(roundedHealth) +
                    (enemy.health > roundedHealth ? "$hhr" : ""), CENTER);
            }
            if (enemy.spikes > 0) {
                const roundedReflection = Math.floor(enemy.spikes);
                canvasManager.renderText("icons", enemy.pos.add(33, 73), "$spk".repeat(roundedReflection) +
                    (enemy.spikes > roundedReflection ? "$hsp" : ""), CENTER);
            }
            if (enemy.stunTicStart != null) {
                canvasManager.renderAnimationFrame(sprites.stun_sprite_sheet, enemy.pos.add(enemy.stunSpriteShift), 64, 64, 4, 1, enemy.stunTicStart, timeTracker.currentGameTic, 0.5);
            }
            canvasManager.renderText("numbers_gray", enemy.pos.add(34, 8), enemy.damage.toString() + "$dmg", LEFT);
            let counterFrame = Math.floor(Math.min(15, (enemy.cooldownTimer.percentage / 100) * 16));
            canvasManager.renderSpriteFromSheet(sprites.counter_sheet, enemy.pos.add(34, 8), 8, 8, new Position(counterFrame % 8, Math.floor(counterFrame / 8)));
        });
        const inventory = playerInventory;
        canvasManager.renderSprite(inventory.weapon.bigSprite, new Position(BORDERTHICKLEFT - (gameState.attackAnimationTimer.inMotion ? 0 : 24), BORDERTHICKTOP + (gameState.attackAnimationTimer.inMotion ? 26 : 45)), 128, 128);
        canvasManager.renderSprite(inventory.shield.bigSprite, new Position(BORDERTHICKLEFT + (gameState.defenseAnimationTimer.inMotion ? 0 : 24), BORDERTHICKTOP + (gameState.defenseAnimationTimer.inMotion ? 26 : 45)), 128, 128);
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
        damageOverlay.render();
    };
    checkBattleEnd() {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        gameState.battle.enemies.forEach((e, i) => {
            if (e.health <= 0) {
                e.die();
                gameState.battle.enemies.splice(i, 1);
                if (hasItem("carving_knife")) {
                    gameState.gold += 2;
                    soundManager.playSound(sounds.gold);
                }
            }
        });
        if (gameState.battle.enemies.length <= 0) {
            return new ChangeScene("cave");
        }
    }
    playDamageOverlay() {
        damageOverlay.hidden = false;
        damageOverlay.firstAnimationTic = timeTracker.currentGameTic;
    }
    playerAttack() {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const rId = utils.randomArrayId(gameState.battle.enemies);
        const enemy = gameState.battle.enemies[rId];
        const weapon = playerInventory.weapon;
        let damage = weapon.totalDamage;
        soundManager.playSound(weapon.sound);
        const playerReflection = gameState.battle.reflection;
        const playerDefense = gameState.battle.defense;
        const playerProtection = gameState.battle.protection;
        let enemySpikeDamage = enemy.spikes;
        let reflectDamage = Math.min(playerReflection, enemySpikeDamage);
        enemy.health -= reflectDamage;
        gameState.battle.reflection -= reflectDamage;
        enemySpikeDamage -= reflectDamage;
        gameState.battle.defense = Math.max(0, playerDefense - enemySpikeDamage);
        enemySpikeDamage = Math.max(0, enemySpikeDamage - playerDefense);
        const takenDamage = Math.max(0, enemySpikeDamage - playerProtection);
        if (takenDamage > 0) {
            gameState.health -= takenDamage;
            this.playDamageOverlay();
        }
        enemy.spikes = 0;
        enemy.health -= damage;
        enemy.damagedTimer.start();
        if (weapon.stunSecs > 0) {
            enemy.stun(weapon.stunSecs);
        }
        gameState.battle.spikes += weapon.spikes;
        gameState.attackAnimationTimer.goalSecs = weapon.cooldown / 3;
        gameState.attackAnimationTimer.start();
        const tiredTimer = gameState.tiredTimer;
        tiredTimer.goalSecs = weapon.cooldown * playerInventory.armor.speedMult;
        tiredTimer.start();
        return this.checkBattleEnd();
    }
    playerDefend() {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const shield = playerInventory.shield;
        gameState.battle.defense += shield.defense;
        gameState.battle.reflection += shield.reflection;
        gameState.battle.spikes += shield.spikes;
        gameState.battle.stun += shield.stun;
        gameState.defenseAnimationTimer.goalSecs = shield.cooldown / 3;
        gameState.defenseAnimationTimer.start();
        const tiredTimer = gameState.tiredTimer;
        tiredTimer.goalSecs = shield.cooldown * playerInventory.armor.speedMult;
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
        enemy.health -= 5;
        enemy.damagedTimer.start();
        tiredTimer.goalSecs = 2 - 2 * playerInventory.armor.speedMult;
        tiredTimer.goalSecs = 2 - playerInventory.armor.speedMult;
        tiredTimer.start();
        return this.checkBattleEnd();
    }
    stunEnemy(seconds) {
        if (!gameState.battle) {
            alert("not in battle");
            return;
        }
        gameState.battle.enemies.forEach((e) => {
            e.stun(seconds);
        });
    }
    enemyAtack(action) {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const battle = gameState.battle;
        soundManager.playSound(action.enemy.biteSound);
        action.enemy.attackAnimTimer.start();
        let damage = action.damage;
        if (damage > 0) {
            action.enemy.health -= battle.spikes;
            battle.spikes = 0;
        }
        if (damage > 0 && battle.stun > 0) {
            action.enemy.stun(battle.stun);
            battle.stun = 0;
        }
        const playerReflect = battle.reflection;
        const reflectDamage = Math.min(playerReflect, damage);
        action.enemy.health -= reflectDamage;
        damage -= reflectDamage;
        battle.reflection -= reflectDamage;
        const playerDefense = battle.defense;
        const leftoverDefense = Math.max(0, playerDefense - damage);
        battle.defense = leftoverDefense;
        const playerProtection = battle.protection;
        damage = Math.max(0, damage - playerDefense - playerProtection);
        if (damage > 0) {
            this.playDamageOverlay();
        }
        gameState.health -= Math.max(0, damage);
        return this.checkBattleEnd();
    }
    handleHeld = (cursorPos, button) => {
        if (!gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const tiredTimer = gameState.tiredTimer;
        if (tiredTimer.ended || !tiredTimer.started) {
            if (button == CLICKLEFT) {
                return this.playerAttack();
            }
            else {
                return this.playerDefend();
            }
        }
    };
    handleHover = () => {
        return new ChangeCursorState(CURSORBATTLE);
    };
}
