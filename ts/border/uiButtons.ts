import { ToggleBook, ToggleInventory, type Action } from "../action.js";
import { canvasManager } from "../canvasManager.js";
import GameObject from "../gameElements/gameObject.js";
import Position from "../gameElements/position.js";
import { gameState } from "../gameState.js";
import type { cursorClick } from "../global.js";
import { soundManager } from "../sounds/soundManager.js";
import { sprites } from "../sprites.js";

class UIButton extends GameObject {
  spriteSheetPos: Position;
  pressedCondition: () => boolean;
  constructor(args: {
    spriteSheetPos: Position;
    pos: Position;
    descriptionText: string;
    clickFunction: (cursorPos: Position, button: cursorClick) => Action | void;
    pressedCondition: () => boolean;
  }) {
    super({ ...args, width: 16, height: 16, sprite: sprites.buttons_ui_sheet });
    this.spriteSheetPos = args.spriteSheetPos;
    this.pressedCondition = args.pressedCondition;
  }

  render = () => {
    canvasManager.renderSpriteFromSheet(
      this.sprite,
      this.pos,
      this.width,
      this.height,
      this.spriteSheetPos.add(
        this.mouseHeldLeft ? 2 : this.pressedCondition() ? 4 : 0,
        0,
      ),
    );
    if (this.mouseHovering) {
      canvasManager.renderSpriteFromSheet(
        this.sprite,
        this.pos,
        this.width,
        this.height,
        this.spriteSheetPos.add(
          1 + (this.mouseHeldLeft ? 2 : this.pressedCondition() ? 4 : 0),
          0,
        ),
      );
    }
  };
}

export const bookButton = new UIButton({
  pos: new Position(4, 36),
  spriteSheetPos: new Position(0, 0),
  descriptionText: "Click to open or close the guide book.",
  clickFunction: () => new ToggleBook(),
  pressedCondition: () => gameState.inBook,
});

export const bagButton = new UIButton({
  pos: new Position(4, 18),
  spriteSheetPos: new Position(0, 1),
  descriptionText: "Click to open or close the inventory.",
  clickFunction: () => {
    return new ToggleInventory();
  },
  pressedCondition: () => gameState.inInventory,
});

export const musicButton = new UIButton({
  pos: new Position(4, 54),
  spriteSheetPos: new Position(0, 2),
  descriptionText: "Toggle music.",
  clickFunction: () => {
    soundManager.muteMusic();
  },
  pressedCondition: () => !soundManager.mutedMusic,
});
export const sfxButton = new UIButton({
  spriteSheetPos: new Position(0, 3),
  descriptionText: "Toggle sound effects.",
  pos: new Position(4, 72),
  clickFunction: () => {
    soundManager.muteSfx();
  },
  pressedCondition: () => !soundManager.mutedSfx,
});
