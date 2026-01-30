import { canvasManager } from "../canvasManager.js";
import GameObject from "../gameElements/gameObject.js";
import Position from "../gameElements/position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP } from "../global.js";
import { sprites } from "../sprites.js";
const damageOverlay = new GameObject({
    sprite: sprites.damage_sheet,
    height: 128,
    width: 128,
    pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
    hidden: true,
});
damageOverlay.render = () => {
    if (damageOverlay.hidden) {
        return;
    }
    canvasManager.renderAnimationFrame(damageOverlay.sprite, damageOverlay.pos, damageOverlay.width, damageOverlay.height, 4, 1, damageOverlay.firstAnimationTic, 1, new Position(), false);
};
export default damageOverlay;
