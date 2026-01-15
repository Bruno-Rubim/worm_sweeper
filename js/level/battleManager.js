import { ChangeCursorState, ChangeScene } from "../action.js";
import { CURSORBATTLE } from "../cursor.js";
import GameObject from "../gameObject.js";
import { BORDERTHICKBOTTOM, BORDERTHICKLEFT, BORDERTHICKRIGHT, BORDERTHICKTOP, CENTER, CLICKLEFT, CLICKRIGHT, GAMEHEIGHT, GAMEWIDTH, LEFT, } from "../global.js";
import Bomb from "../items/consumable/bomb.js";
import Position from "../position.js";
import sounds from "../sounds.js";
import { sprites } from "../sprites.js";
import { Timer } from "../timer/timer.js";
import { timerQueue } from "../timer/timerQueue.js";
import timeTracker from "../timer/timeTracker.js";
import { checkPlayerDead } from "../updateGame.js";
import { utils } from "../utils.js";
import SceneManager from "./sceneManager.js";
const damageOverlay = new GameObject({
    sprite: sprites.damage_sheet,
    height: 128,
    width: 128,
    pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
});
damageOverlay.render = (canvasManager) => {
    if (damageOverlay.hidden) {
        return;
    }
    canvasManager.renderAnimationFrame(damageOverlay.sprite, damageOverlay.pos, damageOverlay.width, damageOverlay.height, 4, 1, damageOverlay.firstAnimationTic, timeTracker.currentGameTic, 1, new Position(), false);
};
damageOverlay.hidden;
export default class BattleManager extends SceneManager {
    stunTicStart = null;
    constructor(gameState, scenePos, soundManager) {
        super(gameState, scenePos, soundManager);
    }
    render = (canvasManager) => {
        const battle = this.gameState.battle;
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
            if (this.stunTicStart != null) {
                canvasManager.renderAnimationFrame(sprites.stun_sprite_sheet, enemy.pos.add(enemy.stunSpriteShift), 64, 64, 4, 1, this.stunTicStart, timeTracker.currentGameTic, 0.5);
            }
            canvasManager.renderText("numbers_gray", enemy.pos.add(34, 8), enemy.damage.toString() + "$dmg", LEFT);
            let counterFrame = Math.floor(Math.min(15, (enemy.cooldownTimer.percentage / 100) * 16));
            canvasManager.renderSpriteFromSheet(sprites.counter_sheet, enemy.pos.add(34, 8), 8, 8, new Position(counterFrame % 8, Math.floor(counterFrame / 8)));
        });
        const inventory = this.gameState.inventory;
        canvasManager.renderSprite(inventory.weapon.bigSprite, new Position(BORDERTHICKLEFT -
            (this.gameState.attackAnimationTimer.inMotion ? 0 : 24), BORDERTHICKTOP +
            (this.gameState.attackAnimationTimer.inMotion ? 26 : 45)), 128, 128);
        canvasManager.renderSprite(inventory.shield.bigSprite, new Position(BORDERTHICKLEFT +
            (this.gameState.defenseAnimationTimer.inMotion ? 0 : 24), BORDERTHICKTOP +
            (this.gameState.defenseAnimationTimer.inMotion ? 26 : 45)), 128, 128);
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
        if (battle.spikes) {
            const spikes = battle.spikes;
            const roundedSpikes = Math.floor(spikes);
            canvasManager.renderText("icons", new Position(GAMEWIDTH / 2, GAMEHEIGHT -
                BORDERTHICKBOTTOM -
                (battle.defense + battle.reflection + battle.protection > 0
                    ? 20
                    : 11)), "$spk".repeat(roundedSpikes) + (spikes > roundedSpikes ? "$hsp" : ""), CENTER);
        }
        if (!this.gameState.tiredTimer.ended && this.gameState.tiredTimer.started) {
            let counterFrame = Math.floor(Math.min(15, (this.gameState.tiredTimer.percentage / 100) * 16));
            canvasManager.renderSpriteFromSheet(sprites.counter_sheet, new Position(GAMEWIDTH / 2 - 4, GAMEHEIGHT - BORDERTHICKBOTTOM - (battle.spikes > 0 ? 31 : 22)), 8, 8, new Position(counterFrame % 8, Math.floor(counterFrame / 8)));
        }
        damageOverlay.render(canvasManager);
    };
    checkBattleEnd() {
        if (!this.gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        this.gameState.battle.enemies.forEach((e, i) => {
            if (e.health <= 0) {
                timerQueue.splice(timerQueue.indexOf(e.cooldownTimer), 1);
                this.gameState.battle.enemies.splice(i, 1);
                if (this.gameState.hasItem("carving_knife")) {
                    this.gameState.gold += 2;
                    this.soundManager.playSound(sounds.gold);
                }
            }
        });
        checkPlayerDead(this.gameState);
        if (this.gameState.battle.enemies.length <= 0) {
            return new ChangeScene("cave");
        }
    }
    playDamageOverlay() {
        damageOverlay.hidden = false;
        damageOverlay.firstAnimationTic = timeTracker.currentGameTic;
    }
    playerAttack() {
        if (!this.gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const rId = utils.randomArrayId(this.gameState.battle.enemies);
        const enemy = this.gameState.battle.enemies[rId];
        const weapon = this.gameState.inventory.weapon;
        let damage = weapon.totalDamage;
        this.soundManager.playSound(weapon.sound);
        const playerReflection = this.gameState.battle.reflection;
        const playerDefense = this.gameState.battle.defense;
        const playerProtection = this.gameState.battle.protection;
        let enemySpikeDamage = enemy.spikes;
        let reflectDamage = Math.min(playerReflection, enemySpikeDamage);
        enemy.health -= reflectDamage;
        this.gameState.battle.reflection -= reflectDamage;
        enemySpikeDamage -= reflectDamage;
        this.gameState.battle.defense = Math.max(0, playerDefense - enemySpikeDamage);
        enemySpikeDamage = Math.max(0, enemySpikeDamage - playerDefense);
        const takenDamage = Math.max(0, enemySpikeDamage - playerProtection);
        if (takenDamage > 0) {
            this.gameState.health -= takenDamage;
            this.playDamageOverlay();
        }
        enemy.spikes = 0;
        enemy.health -= damage;
        enemy.damagedTimer.start();
        timerQueue.push(enemy.damagedTimer);
        this.gameState.battle.spikes += weapon.spikes;
        this.gameState.attackAnimationTimer.goalSecs = weapon.cooldown / 3;
        this.gameState.attackAnimationTimer.start();
        const tiredTimer = this.gameState.tiredTimer;
        tiredTimer.goalSecs =
            weapon.cooldown * this.gameState.inventory.armor.speedMult;
        tiredTimer.start();
        return this.checkBattleEnd();
    }
    playerDefend() {
        if (!this.gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const shield = this.gameState.inventory.shield;
        this.gameState.battle.defense += shield.defense;
        this.gameState.battle.reflection += shield.reflection;
        this.gameState.battle.spikes += shield.spikes;
        this.gameState.defenseAnimationTimer.goalSecs = shield.cooldown / 3;
        this.gameState.defenseAnimationTimer.start();
        const tiredTimer = this.gameState.tiredTimer;
        tiredTimer.goalSecs =
            shield.cooldown * this.gameState.inventory.armor.speedMult;
        tiredTimer.start();
    }
    bomb() {
        if (!this.gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const tiredTimer = this.gameState.tiredTimer;
        const rId = utils.randomArrayId(this.gameState.battle.enemies);
        const enemy = this.gameState.battle.enemies[rId];
        this.soundManager.playSound(sounds.explosion);
        enemy.health -= 5;
        enemy.damagedTimer.start();
        timerQueue.push(enemy.damagedTimer);
        tiredTimer.goalSecs = 2 - 2 * this.gameState.inventory.armor.speedMult;
        tiredTimer.goalSecs = 2 - this.gameState.inventory.armor.speedMult;
        tiredTimer.start();
        return this.checkBattleEnd();
    }
    stunEnemy(seconds) {
        if (!this.gameState.battle) {
            alert("not in battle");
            return;
        }
        this.gameState.battle.enemies.forEach((e) => {
            e.cooldownTimer.pause();
        });
        const stunTimer = new Timer({
            goalSecs: seconds,
            goalFunc: () => {
                this.gameState.battle.enemies.forEach((e) => {
                    e.cooldownTimer.unpause();
                });
                this.stunTicStart = null;
            },
        });
        timerQueue.push(stunTimer);
        stunTimer.start();
        this.stunTicStart = timeTracker.currentGameTic;
    }
    handleHeld = (cursorPos, button) => {
        if (!this.gameState.battle) {
            alert("this shouldn't happen outside of battle");
            return;
        }
        const tiredTimer = this.gameState.tiredTimer;
        if (tiredTimer.ended || !tiredTimer.started) {
            if (button == CLICKLEFT) {
                if (this.gameState.holding instanceof Bomb) {
                    this.gameState.holding = null;
                    return this.bomb();
                }
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
