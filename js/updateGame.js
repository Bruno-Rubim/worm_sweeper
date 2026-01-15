import { cursor, CURSORBOMB, CURSORCHISEL, CURSORDEFAULT, } from "./cursor.js";
import { GameManager } from "./gameManager.js";
import { CLICKLEFT, CLICKRIGHT, DEV } from "./global.js";
import { inputState } from "./inputState.js";
import { ChangeCursorState, ConsumeItem, Action, ToggleBook as ToggleBook, ItemDescription, RestartGame, EnemyAtack, RingBell, PickupChisel, PickupBomb, SellItem, } from "./action.js";
import timeTracker from "./timer/timeTracker.js";
import { timerQueue } from "./timer/timerQueue.js";
import sounds from "./sounds.js";
import { Chisel } from "./items/passives/chisel.js";
import consumableDic from "./items/consumable/dict.js";
import Bomb from "./items/consumable/bomb.js";
import { Weapon } from "./items/weapon/weapon.js";
import { Shield } from "./items/shield/shield.js";
import { Armor, armorDic } from "./items/armor/armor.js";
import { getItem } from "./items/passives/dict.js";
import { utils } from "./utils.js";
import { Consumable } from "./items/consumable/consumable.js";
import Position from "./position.js";
function changeCursorState(newState) {
    cursor.state = newState;
}
export function handleMouseClick(objects) {
    let action = null;
    objects.forEach((obj) => {
        if (!obj.hitbox.positionInside(cursor.pos) || obj.hidden) {
            return null;
        }
        if (obj.clickFunction &&
            (inputState.mouse.clickedRight || inputState.mouse.clickedLeft)) {
            let clickAction = obj.clickFunction(cursor.pos, inputState.mouse.clickedRight ? CLICKRIGHT : CLICKLEFT);
            if (clickAction instanceof Action) {
                action = clickAction;
            }
        }
    });
    if (action) {
        return action;
    }
}
export function handleMouseHover(objects) {
    let action = null;
    objects.forEach((obj) => {
        if (!obj.hitbox.positionInside(cursor.pos) || obj.hidden) {
            obj.mouseHovering = false;
            if (obj.notHoverFunction) {
                obj.notHoverFunction();
            }
            return null;
        }
        obj.mouseHovering = true;
        if (!obj.hoverFunction) {
            return null;
        }
        let hoverAction = obj.hoverFunction(cursor.pos);
        if (hoverAction instanceof Action) {
            action = hoverAction;
        }
    });
    if (action) {
        return action;
    }
}
export function handleMouseNotHover(objects) {
    objects.forEach((obj) => {
        if (!obj.hitbox.positionInside(cursor.pos) || obj.hidden) {
            obj.mouseHovering = false;
            if (obj.notHoverFunction) {
                obj.notHoverFunction();
            }
            return null;
        }
    });
    return;
}
function handleMouseInput(objects) {
    let actions = [];
    objects.forEach((obj) => {
        if (!obj.hitbox.positionInside(cursor.pos)) {
            obj.mouseHovering = false;
            obj.mouseHeldLeft = false;
            obj.mouseHeldRight = false;
            if (obj.notHoverFunction) {
                obj.notHoverFunction();
            }
            return null;
        }
        obj.mouseHovering = true;
        if (obj.hoverFunction) {
            let hoverAction = obj.hoverFunction(cursor.pos);
            if (hoverAction instanceof Action) {
                actions.push(hoverAction);
            }
        }
        if (obj.clickFunction &&
            (inputState.mouse.clickedRight || inputState.mouse.clickedLeft)) {
            let clickAction = obj.clickFunction(cursor.pos, inputState.mouse.clickedRight ? CLICKRIGHT : CLICKLEFT);
            if (clickAction instanceof Action) {
                actions.push(clickAction);
            }
        }
        if (inputState.mouse.heldLeft || inputState.mouse.clickedLeft) {
            obj.mouseHeldLeft = true;
            if (obj.heldFunction) {
                obj.heldFunction(cursor.pos, CLICKLEFT);
            }
        }
        else if (inputState.mouse.heldRight || inputState.mouse.clickedRight) {
            obj.mouseHeldRight = true;
            if (obj.heldFunction) {
                obj.heldFunction(cursor.pos, CLICKRIGHT);
            }
        }
    });
    if (actions.length) {
        return actions;
    }
}
function pauseGame(gameState) {
    timeTracker.togglePause();
    gameState.paused = timeTracker.isPaused;
}
function handleKeyInput(gameManager) {
    if (inputState.keyboard.Escape == "pressed") {
        inputState.keyboard.Escape = "read";
        if (gameManager.gameState.inBook) {
            return new ToggleBook();
        }
        pauseGame(gameManager.gameState);
    }
    if (DEV) {
        if (inputState.keyboard.q == "pressed") {
            inputState.keyboard.q = "read";
            if (confirm("Would you like to quit the game?")) {
                gameManager.gameState.lose();
            }
            inputState.keyboard.q = "unpressed";
        }
        if (inputState.keyboard.w == "pressed") {
            inputState.keyboard.w = "read";
            gameManager.soundManager.playSound(sounds.stab);
        }
    }
}
function consumeItem(gameManager, action) {
    switch (action.itemName) {
        case "time_potion":
            gameManager.gameState.gameTimer.addSecs(60);
            gameManager.soundManager.playSound(sounds.drink);
            break;
        case "health_vial":
            gameManager.gameState.health += 0.5;
            gameManager.soundManager.playSound(sounds.drink);
            break;
        case "health_potion":
            gameManager.gameState.health += 1;
            gameManager.soundManager.playSound(sounds.drink);
            break;
        case "health_potion_big":
            gameManager.gameState.health += 2;
            gameManager.soundManager.playSound(sounds.drink);
            break;
        case "empty":
            if (gameManager.gameState.holding instanceof Bomb) {
                gameManager.gameState.inventory.consumable =
                    gameManager.gameState.holding;
                gameManager.gameState.holding = null;
            }
            break;
    }
    if (action.itemName != "empty") {
        gameManager.gameState.inventory.consumable = consumableDic.empty;
    }
}
function toggleBook(gameManager) {
    gameManager.gameState.inBook = !gameManager.gameState.inBook;
    if (gameManager.gameState.inBook) {
        timeTracker.pause();
    }
    else if (!gameManager.gameState.paused && !gameManager.gameState.gameOver) {
        timeTracker.unpause();
    }
}
function setItemDescription(action) {
    cursor.description.hidden = false;
    cursor.description.side = action.side;
    cursor.description.text = action.description;
    cursor.description.fontSize = action.descFontSize;
}
export function checkPlayerDead(gameState) {
    if (gameState.health <= 0) {
        if (inputState.mouse.heldLeft || inputState.mouse.heldRight) {
            gameState.heldWhileDeath = true;
        }
        gameState.lose();
    }
}
function performEnemyAttack(gameManager, action) {
    if (!gameManager.gameState.battle) {
        alert("this shouldn't happen outside of battle");
        return;
    }
    gameManager.soundManager.playSound(action.enemy.biteSound);
    action.enemy.attackAnimTimer.start();
    timerQueue.push(action.enemy.attackAnimTimer);
    let damage = action.damage;
    if (damage > 0) {
        action.enemy.health -= gameManager.gameState.battle.spikes;
        gameManager.gameState.battle.spikes = 0;
    }
    const playerReflect = gameManager.gameState.battle.reflection;
    const reflectDamage = Math.min(playerReflect, damage);
    action.enemy.health -= reflectDamage;
    damage -= reflectDamage;
    gameManager.gameState.battle.reflection -= reflectDamage;
    const playerDefense = gameManager.gameState.battle.defense;
    const leftoverDefense = Math.max(0, playerDefense - damage);
    gameManager.gameState.battle.defense = leftoverDefense;
    const playerProtection = gameManager.gameState.battle.protection;
    damage = Math.max(0, damage - playerDefense - playerProtection);
    if (damage > 0) {
        gameManager.levelManager.battleManager.playDamageOverlay();
    }
    gameManager.gameState.health -= Math.max(0, damage);
    gameManager.levelManager.checkBattleEnd();
}
function ringBell(gameManager) {
    if (gameManager.gameState.currentScene == "battle") {
        gameManager.levelManager.battleManager.stunEnemy(3);
    }
    else {
        gameManager.gameState.level.cave.bellRang = true;
    }
    gameManager.soundManager.playSound(sounds.bell);
}
function pickupChisel(gameManager, action) {
    if (gameManager.gameState.holding == null) {
        gameManager.gameState.holding = action.chiselItem;
    }
    else if (gameManager.gameState.holding instanceof Chisel) {
        gameManager.gameState.holding = null;
    }
}
function pickupBomb(gameManager, action) {
    if (gameManager.gameState.holding == null) {
        gameManager.gameState.holding = action.bombItem;
        gameManager.gameState.inventory.consumable = consumableDic.empty;
    }
}
function sellItem(gameManager, action) {
    if (gameManager.gameState.currentScene == "shop" &&
        !["empty", "book", "picaxe", "flag"].includes(action.item.name)) {
        if (action.item instanceof Weapon || action.item instanceof Shield) {
            gameManager.soundManager.playSound(sounds.wrong);
            return;
        }
        const inventory = gameManager.gameState.inventory;
        if (action.item instanceof Armor) {
            inventory.armor = armorDic.empty;
        }
        else if (action.item instanceof Consumable) {
            inventory.consumable = consumableDic.empty;
        }
        else {
            if (inventory.passive_1 == action.item) {
                inventory.passive_1 = getItem("empty", new Position(4, 18 * 1));
            }
            if (inventory.passive_2 == action.item) {
                inventory.passive_2 = getItem("empty", new Position(4, 18 * 2));
            }
            if (inventory.passive_3 == action.item) {
                inventory.passive_3 = getItem("empty", new Position(4, 18 * 3));
            }
            if (inventory.passive_4 == action.item) {
                inventory.passive_4 = getItem("empty", new Position(4, 18 * 4));
            }
            if (inventory.passive_5 == action.item) {
                inventory.passive_5 = getItem("empty", new Position(4, 18 * 5));
            }
            if (inventory.passive_6 == action.item) {
                inventory.passive_6 = getItem("empty", new Position(4, 18 * 6));
            }
            if (inventory.passive_7 == action.item) {
                inventory.passive_7 = getItem("empty", new Position(4, 18 * 7));
            }
        }
        gameManager.gameState.gold += utils.randomInt(4, 1);
        gameManager.soundManager.playSound(sounds.gold);
    }
}
function handleAction(gameManager, action) {
    if (!action) {
        return;
    }
    if (action instanceof ChangeCursorState) {
        changeCursorState(action.newState);
        return "cursorChange";
    }
    if (action instanceof ConsumeItem) {
        consumeItem(gameManager, action);
        return;
    }
    if (action instanceof ToggleBook) {
        toggleBook(gameManager);
        return;
    }
    if (action instanceof ItemDescription) {
        setItemDescription(action);
        return "itemDescription";
    }
    if (action instanceof RestartGame) {
        gameManager.restart();
        return;
    }
    if (action instanceof EnemyAtack) {
        performEnemyAttack(gameManager, action);
        return;
    }
    if (action instanceof RingBell) {
        ringBell(gameManager);
        return;
    }
    if (action instanceof PickupChisel) {
        pickupChisel(gameManager, action);
        return;
    }
    if (action instanceof PickupBomb) {
        pickupBomb(gameManager, action);
        return;
    }
    if (action instanceof SellItem) {
        sellItem(gameManager, action);
        return;
    }
    console.warn("unhandled action", action);
}
function updateTimers(gameManager) {
    timerQueue.forEach((timer, i) => {
        let action = null;
        if (timer.ticsRemaining <= 0 && !timer.ended) {
            if (timer.goalFunc) {
                action = timer.goalFunc();
            }
            if (timer.loop) {
                timer.rewind();
            }
            else {
                timer.ended = true;
                if (timer.deleteAtEnd) {
                    timerQueue.splice(i, 1);
                }
            }
            handleAction(gameManager, action);
        }
    });
}
export default function updateGame(renderScale, gameManager) {
    updateTimers(gameManager);
    cursor.pos.update(inputState.mouse.pos.divide(renderScale));
    const gameObjects = [
        gameManager.levelManager,
        ...Object.values(gameManager.gameState.inventory),
    ];
    const actions = handleMouseInput(gameObjects);
    let cursorChanged = false;
    let itemDescription = false;
    actions?.forEach((action) => {
        let response = handleAction(gameManager, action);
        switch (response) {
            case "cursorChange":
                cursorChanged = true;
                break;
            case "itemDescription":
                itemDescription = true;
                break;
        }
    });
    if (gameManager.gameState.holding != null) {
        if (gameManager.gameState.holding instanceof Bomb) {
            changeCursorState(CURSORBOMB);
            cursorChanged = true;
        }
        else if (gameManager.gameState.holding instanceof Chisel &&
            !gameManager.gameState.holding.chiselTimer.inMotion) {
            changeCursorState(CURSORCHISEL);
            cursorChanged = true;
        }
    }
    if (!cursorChanged) {
        changeCursorState(CURSORDEFAULT);
    }
    if (!itemDescription) {
        cursor.description.hidden = true;
    }
    if (inputState.mouse.clickedRight) {
        inputState.mouse.clickedRight = false;
    }
    if (inputState.mouse.clickedLeft) {
        inputState.mouse.clickedLeft = false;
    }
    cursor.pos.update(cursor.pos.subtract(8, 8));
    handleAction(gameManager, handleKeyInput(gameManager));
}
