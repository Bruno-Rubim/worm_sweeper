import { canvasManager } from "../canvasManager.js";
import GameObject from "../gameElements/gameObject.js";
import Position from "../gameElements/position.js";
import { gameState } from "../gameState.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP } from "../global.js";
import { sprites } from "../sprites.js";

export const damageOverlay = new GameObject({
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
  canvasManager.renderAnimationFrame(
    damageOverlay.sprite,
    damageOverlay.pos,
    damageOverlay.width,
    damageOverlay.height,
    4,
    1,
    damageOverlay.animationTicStart,
    1,
    new Position(),
    false,
  );
};

export const stunnedOverlay = new GameObject({
  sprite: sprites.stunned_sheet,
  height: 128,
  width: 128,
  pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
  hidden: true,
});

stunnedOverlay.render = () => {
  if (stunnedOverlay.hidden || !gameState.stunnedTimer.inMotion) {
    return;
  }
  canvasManager.renderAnimationFrame(
    stunnedOverlay.sprite,
    stunnedOverlay.pos,
    stunnedOverlay.width,
    stunnedOverlay.height,
    4,
    1,
    stunnedOverlay.animationTicStart,
    Math.floor((100 - gameState.stunnedTimer.percentage) / 25),
    new Position(),
    false,
  );
};
