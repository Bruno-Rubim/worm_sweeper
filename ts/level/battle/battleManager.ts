import {
  ChangeCursorState,
  ChangeScene,
  EnemyAttack,
  LoseGame,
} from "../../action.js";
import { canvasManager } from "../../canvasManager.js";
import { CURSORBATTLE } from "../../cursor.js";
import GameObject from "../../gameElements/gameObject.js";
import Position from "../../gameElements/position.js";
import { gameState } from "../../gameState.js";
import {
  BORDERTHICKBOTTOM,
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  CENTER,
  CLICKLEFT,
  CLICKRIGHT,
  GAMEHEIGHT,
  GAMEWIDTH,
  LEFT,
  type cursorClick,
} from "../../global.js";
import {
  handleMouseClick,
  handleMouseHover,
  handleMouseNotHover,
} from "../../input/handleInput.js";
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
import damageOverlay from "../damageOverlay.js";
import SceneManager from "../sceneManager.js";
import { ScaleWorm } from "./enemy.js";
import LootSlot from "./lootSlot.js";

const ExitArrow = new GameObject({
  sprite: sprites.exit_arrow,
  height: 16,
  width: 32,
  pos: new Position(GAMEWIDTH / 2 - 16, 128),
  clickFunction: (cursorPos: Position, button: cursorClick) => {
    if (button == LEFT) {
      ExitArrow.mouseHovering = false;
      soundManager.playSound(sounds.steps);
      return new ChangeScene("cave");
    }
  },
});

ExitArrow.render = () => {
  canvasManager.renderSpriteFromSheet(
    ExitArrow.sprite,
    ExitArrow.pos,
    ExitArrow.width,
    ExitArrow.height,
    new Position(ExitArrow.mouseHovering ? 1 : 0, 0),
  );
};

ExitArrow.hidden;

// Manages rendering and interactions with the currentBattle scene of the gameState
export default class BattleManager extends SceneManager {
  lootSlot = new LootSlot();

  /**
   * Renders enemies and player weapons
   * @param canvasManager
   */
  render = () => {
    const battle = gameState.battle;
    if (!battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    // Background
    canvasManager.renderSprite(
      sprites.bg_battle,
      new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT,
      GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM,
    );

    // Renders chest
    if (battle.chest) {
      canvasManager.renderSpriteFromSheet(
        sprites.chest,
        new Position(GAMEWIDTH / 2 - 16, 40),
        32,
        32,
        new Position(battle.won ? 1 : 0, 0),
      );
      if (battle.won && battle.chest) {
        this.lootSlot.render();
      }
      // Arrow
      if (battle.won) {
        ExitArrow.render();
      }
    }

    // Renders enemies
    battle.enemies.forEach((enemy) => {
      canvasManager.renderSpriteFromSheet(
        enemy.spriteSheet,
        enemy.pos,
        64,
        64,
        new Position(
          enemy.attackAnimTimer.inMotion ? 1 : 0,
          enemy.damagedTimer.inMotion ? 1 : 0,
        ),
      );
      if (enemy.health > 0) {
        // Renders enemy health
        const roundedHealth = Math.floor(enemy.health);
        canvasManager.renderText(
          "icons",
          enemy.pos.add(33, 64),
          "$hrt".repeat(roundedHealth) +
            (enemy.health > roundedHealth ? "$hhr" : ""),
          CENTER,
        );
      }
      if (enemy.defense > 0) {
        // Renders enemy health
        const roundedDefense = Math.floor(enemy.defense);
        canvasManager.renderText(
          "icons",
          enemy.pos.add(33, 73),
          "$dfs".repeat(roundedDefense) +
            (enemy.defense > roundedDefense ? "$hdf" : ""),
          CENTER,
        );
      }
      if (enemy.spikes > 0) {
        // Renders enemy spikes
        const roundedReflection = Math.floor(enemy.spikes);
        canvasManager.renderText(
          "icons",
          enemy.pos.add(33, 73),
          "$spk".repeat(roundedReflection) +
            (enemy.spikes > roundedReflection ? "$hsp" : ""),
          CENTER,
        );
      }
      if (enemy.stunTicStart != null) {
        // Render stun animation
        canvasManager.renderAnimationFrame(
          sprites.stun_sprite_sheet,
          enemy.pos.add(enemy.stunSpriteShift),
          64,
          64,
          4,
          1,
          enemy.stunTicStart,
          0.5,
        );
      }

      canvasManager.renderText(
        "numbers_gray",
        enemy.pos.add(34, 8),
        enemy.damage.toString() + "$dmg",
        LEFT,
      );
      let counterFrame = Math.floor(
        Math.min(15, (enemy.cooldownTimer.percentage / 100) * 16),
      );
      canvasManager.renderSpriteFromSheet(
        sprites.counter_sheet,
        enemy.pos.add(34, 8),
        8,
        8,
        new Position(counterFrame % 8, Math.floor(counterFrame / 8)),
      );
    });

    // Renders weapon
    canvasManager.renderSprite(
      playerInventory.weapon.item.bigSprite,
      new Position(
        BORDERTHICKLEFT - (gameState.attackAnimationTimer.inMotion ? 0 : 24),
        BORDERTHICKTOP + (gameState.attackAnimationTimer.inMotion ? 26 : 45),
      ),
      128,
      128,
    );

    // Renders shield
    canvasManager.renderSprite(
      playerInventory.shield.item.bigSprite,
      new Position(
        BORDERTHICKLEFT + (gameState.shieldUpTimer.inMotion ? 0 : 24),
        BORDERTHICKTOP + (gameState.shieldUpTimer.inMotion ? 26 : 45),
      ),
      128,
      128,
    );

    if (battle.won) {
      return;
    }
    //Renders stats

    // Renders defense stats
    if (battle.protection + battle.defense + battle.reflection > 0) {
      const reflect = battle.reflection;
      const defense = battle.defense;
      const protection = battle.protection;
      const roundedReflect = Math.floor(reflect);
      const roundedDefense = Math.floor(defense);
      const roundedProtection = Math.floor(protection);
      canvasManager.renderText(
        "icons",
        new Position(GAMEWIDTH / 2, GAMEHEIGHT - BORDERTHICKBOTTOM - 11),
        "$ref".repeat(roundedReflect) +
          (reflect > roundedReflect ? "$hrf" : "") +
          "$dfs".repeat(roundedDefense) +
          (defense > roundedDefense ? "$hdf" : "") +
          "$pro".repeat(roundedProtection) +
          (protection > roundedProtection ? "$hpr" : ""),
        CENTER,
      );
    }

    // Rendering other stats
    if (battle.spikes || battle.stun) {
      const spikes = battle.spikes;
      const roundedSpikes = Math.floor(spikes);
      const stun = battle.stun;
      const roundedStun = Math.floor(stun);
      canvasManager.renderText(
        "icons",
        new Position(
          GAMEWIDTH / 2,
          GAMEHEIGHT -
            BORDERTHICKBOTTOM -
            (battle.defense + battle.reflection + battle.protection > 0
              ? 20
              : 11),
        ),
        "$spk".repeat(roundedSpikes) +
          (spikes > roundedSpikes ? "$hsp" : "") +
          "$stn".repeat(roundedStun) +
          (stun > roundedStun ? "$hst" : ""),
        CENTER,
      );
    }

    // Renders cooldown counter
    if (!gameState.tiredTimer.ended && gameState.tiredTimer.started) {
      let counterFrame = Math.floor(
        Math.min(15, (gameState.tiredTimer.percentage / 100) * 16),
      );
      canvasManager.renderSpriteFromSheet(
        sprites.counter_sheet,
        new Position(
          GAMEWIDTH / 2 - 4,
          GAMEHEIGHT -
            BORDERTHICKBOTTOM -
            (battle.spikes + battle.stun > 0 ? 31 : 22),
        ),
        8,
        8,
        new Position(counterFrame % 8, Math.floor(counterFrame / 8)),
      );
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
    this.lootSlot.item = itemPool[r]!;
  }

  /**
   * Checks if enemies or player are dead, changing to cave scene if so
   * @returns
   */
  checkBattleEnd() {
    if (!gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }

    // Player dead
    if (gameState.health <= 0) {
      return new LoseGame();
    }
    gameState.battle.enemies.forEach((e, i) => {
      // Enemie dead
      if (e.health <= 0) {
        e.die();
        gameState.battle!.enemies.splice(i, 1);
        if (playerInventory.hasItem("carving_knife")) {
          gameState.gold += 2;
          soundManager.playSound(sounds.gold);
        }
        if (playerInventory.hasItem("scale_shield") && e instanceof ScaleWorm) {
          gameState.scalesCollected = Math.min(
            10,
            gameState.scalesCollected + 1,
          );
        }
      }
    });

    // Battle won
    if (gameState.battle.enemies.length <= 0) {
      gameState.battle.won = true;
      ExitArrow.hidden = false;
      if (gameState.battle.chest) {
        // Open chest
        this.selectLootItem();
        return;
      }
      return new ChangeScene("cave");
    }
  }

  /**
   * Sets the animation start of damage overlay to current tic and makes sure it's not hidden
   */
  playDamageOverlay() {
    damageOverlay.hidden = false;
    damageOverlay.animationTicStart = timeTracker.currentGameTic;
  }

  damagePlayer(damage: number) {
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

  /**
   * Deals damage to a random enemy and starts the tired timer according to current weapon stats
   * @returns
   */
  playerAttack() {
    if (!gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }

    const rId = utils.randomArrayId(gameState.battle.enemies);
    const enemy = gameState.battle.enemies[rId]!;
    const weapon = playerInventory.weapon.item;
    let weaponDmg = weapon.totalDamage;

    soundManager.playSound(weapon.sound);

    // Set Spikes
    if (playerInventory.hasItem("spike_polisher")) {
      gameState.battle.reflection += weapon.spikes;
    } else {
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
      enemy.stun(weapon.stunSecs);
    }

    // Weapon animation
    gameState.attackAnimationTimer.goalSecs = weapon.cooldown / 3;
    gameState.attackAnimationTimer.start();

    // Cooldown
    const tiredTimer = gameState.tiredTimer;
    tiredTimer.goalSecs =
      (weapon.cooldown - (playerInventory.hasItem("feather") ? 0.3 : 0)) *
      (playerInventory.armor.item.speedMult -
        (playerInventory.hasItem("whetstone") ? weaponDmg * 0.05 : 0));
    tiredTimer.start();
    return this.checkBattleEnd();
  }

  /**
   * Adds defense to player and starts the tired timer according to current shield stats
   * @returns
   */
  playerDefend() {
    if (!gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    const shield = playerInventory.shield.item;

    // Setting defense stats
    if (playerInventory.hasItem("glass_armor")) {
      gameState.battle.defense += Math.ceil(shield.totalDefense) / 2;
      gameState.battle.reflection += Math.floor(shield.totalDefense) / 2;
    } else {
      gameState.battle.defense += shield.totalDefense;
    }
    gameState.battle.reflection += shield.reflection;
    if (playerInventory.hasItem("spike_polisher")) {
      gameState.battle.reflection += shield.spikes;
    } else {
      gameState.battle.spikes += shield.spikes;
    }
    gameState.battle.stun += shield.stun;

    // Shield Up
    gameState.shieldUpTimer.goalSecs = shield.cooldown / 3;
    gameState.shieldUpTimer.start();

    // Cooldown
    const tiredTimer = gameState.tiredTimer;
    tiredTimer.goalSecs =
      shield.cooldown * playerInventory.armor.item.speedMult;
    tiredTimer.start();
  }

  /**
   * Does 5 damage to a random enemy, triggers the enemies damage animation timer and the player's tired timer
   * @returns
   */
  bomb() {
    if (!gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    const tiredTimer = gameState.tiredTimer;
    const rId = utils.randomArrayId(gameState.battle.enemies);
    const enemy = gameState.battle.enemies[rId]!;
    soundManager.playSound(sounds.explosion);
    enemy.takeDamage(playerInventory.hasItem("gunpowder") ? 8 : 5);
    tiredTimer.goalSecs = 2 - 2 * playerInventory.armor.item.speedMult;
    tiredTimer.goalSecs = 2 - playerInventory.armor.item.speedMult;
    tiredTimer.start();
    return this.checkBattleEnd();
  }

  /**
   * Pauses the current battle's enemies' cooldown timers for a given ammount of seconds
   * @param seconds
   */
  stunEnemy(seconds: number) {
    if (!gameState.battle) {
      alert("not in battle");
      return;
    }
    gameState.battle.enemies.forEach((e) => {
      e.stun(seconds);
    });
  }

  enemyAttack(action: EnemyAttack) {
    if (!gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    const battle = gameState.battle;
    soundManager.playSound(action.enemy.biteSound);

    action.enemy.attackAnimTimer.start();
    let enemyDamage = action.damage;

    // Stun
    if (enemyDamage > 0 && battle.stun > 0) {
      action.enemy.stun(battle.stun);
      battle.stun = 0;
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

  /**
   * Checks if the player isn't tired and attacks or defends accordingly
   * @param cursorPos
   * @param button
   * @returns
   */
  handleHeld = (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT,
  ) => {
    if (!gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    if (gameState.battle.won) {
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
      } else {
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
