import { fontMaps, measureTextWidth } from "./fontMaps.js";
import { GAMEHEIGHT, GAMEWIDTH, LEFT, RIGHT, CENTER } from "./global.js";
import Position from "./position.js";
import type { Sprite } from "./sprites.js";
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

  /**
   * Updates the canvas element size and render scale based on current window
   */
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

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height,
    );
  }

  /**
   * Renders a sprite with given position and dimensions on the screen
   * @param sprite
   * @param pos
   * @param width
   * @param height
   */
  renderSprite(sprite: Sprite, pos: Position, width: number, height: number) {
    this.ctx.drawImage(
      sprite.img,
      Math.floor(pos.x * this.renderScale),
      Math.floor(pos.y * this.renderScale),
      width * this.renderScale,
      height * this.renderScale,
    );
  }

  renderSpriteFromSheet(
    spriteSheet: Sprite,
    pos: Position,
    width: number,
    height: number,
    posInSheet: Position,
    widthInSheet?: number,
    heightInSheet?: number,
  ) {
    widthInSheet ??= width;
    heightInSheet ??= height;
    this.ctx.drawImage(
      spriteSheet.img,
      posInSheet.x * widthInSheet,
      posInSheet.y * heightInSheet,
      widthInSheet,
      heightInSheet,
      Math.floor(pos.x * this.renderScale),
      Math.floor(pos.y * this.renderScale),
      width * this.renderScale,
      height * this.renderScale,
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
    sheetPosShift: Position = new Position(),
    loop: boolean = true,
  ) {
    const totalFrames = sheetWidthInFrames * sheetHeightInFrames;
    const currentFrame =
      Math.floor((currentTic - birthTic) * animationSpeed) %
      (loop ? sheetWidthInFrames * sheetHeightInFrames : Infinity);
    if (!loop && currentFrame > totalFrames) {
      return;
    }
    const sheetPos = new Position(
      currentFrame % sheetWidthInFrames,
      Math.floor(currentFrame / sheetWidthInFrames),
    ).addPos(sheetPosShift);
    this.ctx.drawImage(
      spriteSheet.img,
      sheetPos.x * width,
      sheetPos.y * height,
      width,
      height,
      Math.floor(pos.x * this.renderScale),
      Math.floor(pos.y * this.renderScale),
      width * this.renderScale,
      height * this.renderScale,
    );
  }

  renderText(
    font: keyof typeof fontMaps,
    pos: Position,
    text: string,
    direction: typeof LEFT | typeof RIGHT | typeof CENTER = RIGHT,
    limitWidth: number = Infinity,
    fontSize = 1,
  ) {
    const fontMap = fontMaps[font]!;
    const words = text.split(" ");
    let lineWidth = 0;
    words.forEach((word, i) => {
      if (word.includes("\n")) {
        const breakWords = word.split("\n");
        const firstWidth = measureTextWidth(font, breakWords[0]!) * fontSize;
        const lastWidth =
          measureTextWidth(font, utils.lastOfArray(breakWords)) * fontSize;
        if (lineWidth + firstWidth > limitWidth) {
          words[i] = "\n" + words[i];
        }
        lineWidth = lastWidth;
        return;
      }
      const wordWidth = measureTextWidth(font, word) * fontSize;
      if (lineWidth + wordWidth > limitWidth) {
        words[i] = "\n" + words[i];
        lineWidth = wordWidth;
      } else {
        lineWidth += wordWidth + (fontMap.charMaps[" "]?.width ?? 0) * fontSize;
      }
    });

    // Render by lines
    const lines = words.join(" ").replaceAll(" \n", "\n").split("\n");
    let currentX = 0;
    let currentY = 0;
    for (let lineId in lines) {
      const line = lines[lineId]!;

      // Reset X coordinates to align text
      if (direction == RIGHT) {
        currentX = 0;
      } else if (direction == LEFT) {
        currentX = 0 - measureTextWidth(font, line) * fontSize;
      } else if (direction == CENTER) {
        currentX = 0 - (measureTextWidth(font, line) * fontSize) / 2;
      }

      // Loop through characters
      const chars = line.split("");
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (!c) {
          continue;
        }
        if (c == "$") {
          let iconWord = chars.slice(i, i + 4).join("");
          if (!fontMaps.icons || !iconWord) {
            return;
          }
          const iconChar = fontMaps.icons.charMaps[iconWord];
          if (iconChar) {
            this.renderSpriteFromSheet(
              fontMaps.icons.spriteSheet,
              pos.add(currentX, currentY),
              fontMaps.icons.cellWidth * fontSize,
              fontMaps.icons.cellHeight * fontSize,
              fontMaps.icons.charMaps[iconWord]!.pos,
              fontMaps.icons.cellWidth,
              fontMaps.icons.cellHeight,
            );
            currentX += iconChar.width * fontSize;
          } else {
            console.warn(iconWord, "ain't no icon chief");
          }
          i += 3;
          continue;
        }
        const charMap = fontMap.charMaps[c]!;
        this.renderSpriteFromSheet(
          fontMap.spriteSheet,
          pos.add(currentX, currentY),
          fontMap.cellWidth * fontSize,
          fontMap.cellHeight * fontSize,
          charMap.pos,
          fontMap.cellWidth,
          fontMap.cellHeight,
        );
        currentX += charMap.width * fontSize;
      }

      // Move the Y coordinate down
      currentY += fontMap.cellHeight * fontSize;
    }
  }
}
