import { fontMaps, measureTextWidth } from "./fontMaps.js";
import { GAMEHEIGHT, GAMEWIDTH, CLICKLEFT, CLICKRIGHT } from "./global.js";
import Position from "./position.js";
import type { Sprite } from "./sprite.js";
import { utils } from "./utils.js";

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
    spriteSheet: Sprite,
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
      spriteSheet.img,
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

  renderAnimationFrame(
    spriteSheet: Sprite,
    pos: Position,
    width: number,
    height: number,
    sheetWidthInFrames: number,
    sheetHeightInFrames: number,
    birthTic: number,
    currentTic: number,
    animationSpeed: number = 1,
    sheetPosShift: Position = new Position()
  ) {
    const currentFrame =
      Math.floor((currentTic - birthTic) * animationSpeed) %
      (sheetWidthInFrames * sheetHeightInFrames);
    const sheetPos = new Position(
      currentFrame % sheetWidthInFrames,
      Math.floor(currentFrame / sheetWidthInFrames)
    ).addPos(sheetPosShift);
    this.ctx.drawImage(
      spriteSheet.img,
      sheetPos.x * width,
      sheetPos.y * height,
      width,
      height,
      pos.x * this.renderScale,
      pos.y * this.renderScale,
      width * this.renderScale,
      height * this.renderScale
    );
  }

  renderText(
    font: keyof typeof fontMaps,
    pos: Position,
    text: string,
    direction: typeof CLICKLEFT | typeof CLICKRIGHT = CLICKRIGHT,
    limitWidth: number = Infinity
  ) {
    const fontMap = fontMaps[font]!;
    const words = text.split(" ");
    let lineWidth = 0;
    words.forEach((word, i) => {
      if (word.includes("\n")) {
        const breakWords = word.split("\n");
        const firstWidth = measureTextWidth(font, breakWords[0]!);
        const lastWidth = measureTextWidth(font, utils.lastOfArray(breakWords));
        if (lineWidth + firstWidth > limitWidth) {
          words[i] = "\n" + words[i];
        }
        lineWidth = lastWidth;
        return;
      }
      const wordWidth = measureTextWidth(font, word);
      if (lineWidth + wordWidth > limitWidth) {
        words[i] = "\n" + words[i];
        lineWidth = wordWidth;
      } else {
        lineWidth += wordWidth + (fontMap.charMaps[" "]?.width ?? 0);
      }
    });
    const chars = words.join(" ").replaceAll(" \n", "\n").split("");
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
          fontMap.spriteSheet,
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
