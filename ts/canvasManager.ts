import { fontMaps } from "./fontMaps.js";
import { GAMEHEIGHT, GAMEWIDTH, CLICKLEFT, CLICKRIGHT } from "./global.js";
import Position from "./position.js";
import type { Sprite } from "./sprite.js";

export default class CanvasManager {
  canvasElement = document.querySelector("canvas")!;
  ctx = this.canvasElement?.getContext("2d")!;
  renderScale = 1;
  scaleMultiplyer = 1;
  sizeConfig = {
    originalWidth: GAMEWIDTH,
    originalHeight: GAMEHEIGHT,
    width: 0,
    height: 0,
  };

  updateElementSize() {
    let scale = 0;
    if (innerWidth > innerHeight) {
      scale = Math.floor(innerHeight / this.sizeConfig.originalHeight);
    } else {
      scale = Math.floor(innerWidth / this.sizeConfig.originalWidth);
    }
    this.sizeConfig.width = scale * this.sizeConfig.originalWidth;
    this.sizeConfig.height = scale * this.sizeConfig.originalHeight;

    this.renderScale = scale * this.scaleMultiplyer;
    this.ctx.imageSmoothingEnabled = false;

    this.canvasElement.style.left =
      Math.floor((innerWidth - this.sizeConfig.width) / 2) + "px";
    this.canvasElement.style.top =
      Math.floor((innerHeight - this.sizeConfig.height) / 2) + "px";
    this.canvasElement.width = this.sizeConfig.width;
    this.canvasElement.height = this.sizeConfig.height;
    this.canvasElement.style.position = "absolute";
    this.ctx.imageSmoothingEnabled = false;
  }

  clearCanvas() {
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
  }

  renderSprite(sprite: Sprite, pos: Position, width: number, height: number) {
    this.ctx.drawImage(
      sprite.img,
      pos.x * this.renderScale,
      pos.y * this.renderScale,
      width * this.renderScale,
      height * this.renderScale
    );
  }

  renderSpriteFromSheet(
    sprite: Sprite,
    pos: Position,
    width: number,
    height: number,
    posInSheet: Position,
    widthInSheet?: number,
    heightInSheet?: number
  ) {
    widthInSheet ??= width;
    heightInSheet ??= height;
    this.ctx.drawImage(
      sprite.img,
      posInSheet.x * widthInSheet,
      posInSheet.y * heightInSheet,
      widthInSheet,
      heightInSheet,
      pos.x * this.renderScale,
      pos.y * this.renderScale,
      width * this.renderScale,
      height * this.renderScale
    );
  }

  renderText(
    spriteSheet: Sprite,
    font: keyof typeof fontMaps,
    pos: Position,
    text: string,
    direction: typeof CLICKLEFT | typeof CLICKRIGHT = CLICKRIGHT
  ) {
    const chars = text.split("");
    const fontMap = fontMaps[font]!;
    let currentX = 0;
    let currentY = 0;
    chars.forEach((c) => {
      if (c == "\n") {
        currentY += fontMap.cellHeight;
        currentX = 0;
        return;
      }
      const charMap = fontMap.charMaps[c]!;
      if (direction == CLICKRIGHT) {
        this.renderSpriteFromSheet(
          spriteSheet,
          pos.add(currentX, currentY),
          fontMap.cellWidth,
          fontMap.cellHeight,
          charMap.pos
        );
      }
      currentX += charMap.width;
    });
  }
}
