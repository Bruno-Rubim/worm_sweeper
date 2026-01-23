import { Action } from "../action.js";
import { cursor } from "../cursor.js";
import { CLICKLEFT, CLICKRIGHT } from "../global.js";
import { inputState } from "./inputState.js";
export function handleMouseInput(objects) {
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
        let heldAction = null;
        if (inputState.mouse.heldLeft || inputState.mouse.clickedLeft) {
            obj.mouseHeldLeft = true;
            if (obj.heldFunction) {
                heldAction = obj.heldFunction(cursor.pos, CLICKLEFT);
            }
        }
        else if (inputState.mouse.heldRight || inputState.mouse.clickedRight) {
            obj.mouseHeldRight = true;
            if (obj.heldFunction) {
                heldAction = obj.heldFunction(cursor.pos, CLICKRIGHT);
            }
        }
        else {
            obj.mouseHeldLeft = false;
            obj.mouseHeldRight = false;
        }
        if (heldAction instanceof Action) {
            actions.push(heldAction);
        }
    });
    if (actions.length) {
        return actions;
    }
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
