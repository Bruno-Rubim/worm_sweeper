import { canvasManager } from "../canvasManager.js";
import GameObject from "../gameElements/gameObject.js";
import Position from "../gameElements/position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP } from "../global.js";
import { sprites } from "../sprites.js";
import timeTracker from "../timer/timeTracker.js";
export const transitionOverlay = new GameObject({
    sprite: sprites.scene_transition,
    height: 128,
    width: 128,
    pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
});
transitionOverlay.render = () => {
    if (transitionOverlay.hidden) {
        return;
    }
    canvasManager.renderAnimationFrame(transitionOverlay.sprite, transitionOverlay.pos, transitionOverlay.width, transitionOverlay.height, 4, 4, transitionOverlay.animationTicStart, 1, new Position(), false);
};
