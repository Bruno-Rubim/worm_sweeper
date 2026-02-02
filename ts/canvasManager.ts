import { fontMaps, measureTextWidth } from "./fontMaps.js";
import { GAMEHEIGHT, GAMEWIDTH, LEFT, RIGHT, CENTER } from "./global.js";
import Position from "./gameElements/position.js";
import type { Sprite } from "./sprites.js";
import { utils } from "./utils.js";
import timeTracker from "./timer/timeTracker.js";

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

  constructor() {
    // Binds updating the elmeent size when the window resizes
    window.addEventListener("resize", () => {
      this.updateElementSize();
    });
    this.updateElementSize();
  }

  /**
   * Updates the canvas element size, position and render scale based on current window
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

  /**
   * Renders an image from a given spriteSheet with given position and dimensions on screen
   * @param spriteSheet
   * @param pos
   * @param width
   * @param height
   * @param posInSheet its position in the sheet
   * @param widthInSheet?width of sprites in sheet (if sprites's size is different than what will be on screen)
   * @param heightInSheet?height of sprites in sheet (if sprites's size is different than what will be on screen)
   */
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

  /**
   * Renders an animation frame given its spriteSheet details, which tic the animation started and the current tic.
   * Can loop animaiton and have a position shift within the spritesheet
   * @param spriteSheet
   * @param pos
   * @param width
   * @param height
   * @param sheetWidthInFrames
   * @param sheetHeightInFrames
   * @param animationStartTic
   * @param animationSpeed
   * @param sheetPosShift
   * @param loop
   * @returns
   */
  renderAnimationFrame(
    spriteSheet: Sprite,
    pos: Position,
    width: number,
    height: number,
    sheetWidthInFrames: number,
    sheetHeightInFrames: number,
    animationStartTic: number,
    animationSpeed: number = 1,
    sheetPosShift: Position = new Position(),
    loop: boolean = true,
    renderWidth?: number,
    renderHeight?: number,
    afterLoopFrame?: boolean,
  ) {
    const totalFrames = sheetWidthInFrames * sheetHeightInFrames;
    let currentFrame =
      Math.floor(
        (timeTracker.currentGameTic - animationStartTic) * animationSpeed,
      ) % (loop ? sheetWidthInFrames * sheetHeightInFrames : Infinity);
    if (!loop && currentFrame > totalFrames - 1) {
      if (afterLoopFrame) {
        currentFrame = totalFrames - 1;
      } else {
        return;
      }
    }
    const sheetPos = new Position(
      currentFrame % sheetWidthInFrames,
      Math.floor(currentFrame / sheetWidthInFrames),
    ).add(sheetPosShift);
    this.ctx.drawImage(
      spriteSheet.img,
      sheetPos.x * width,
      sheetPos.y * height,
      width,
      height,
      Math.floor(pos.x * this.renderScale),
      Math.floor(pos.y * this.renderScale),
      (renderWidth ?? width) * this.renderScale,
      (renderHeight ?? height) * this.renderScale,
    );
  }

  // TO-DO: Analyze if this function can be broken down, it's huge
  /**
   * Renders a given text with a given font starting from a given position.
   * Can go from position to left, right or centered at position.
   * Breaks line at a given limit width.
   * Can have a varying font size
   * @param font
   * @param pos
   * @param text
   * @param direction
   * @param limitWidth
   * @param fontSize
   * @returns
   */
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
    let currentLineWidth = 0;
    words.forEach((word, i) => {
      if (word.includes("\n")) {
        const breakWords = word.split("\n");
        const firstWidth = measureTextWidth(font, breakWords[0]!) * fontSize;
        const lastWidth =
          measureTextWidth(font, utils.lastOfArray(breakWords)) * fontSize;
        if (currentLineWidth + firstWidth > limitWidth) {
          words[i] = "\n" + words[i];
        }
        currentLineWidth = lastWidth;
        return;
      }
      const wordWidth = measureTextWidth(font, word) * fontSize;
      if (currentLineWidth + wordWidth > limitWidth) {
        words[i] = "\n" + words[i];
        currentLineWidth =
          wordWidth + (fontMap.charMaps[" "]?.width ?? 0) * fontSize;
      } else {
        currentLineWidth +=
          wordWidth + (fontMap.charMaps[" "]?.width ?? 0) * fontSize;
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

  renderBox(
    spriteSheet: Sprite,
    pos: Position,
    boxSpriteWidth: number,
    boxSpriteHeight: number,
    bodyWidth: number,
    bodyHeight: number,
    scale: number = 1,
  ) {
    // Top left corner
    this.renderSpriteFromSheet(
      spriteSheet,
      pos,
      boxSpriteWidth * scale,
      boxSpriteHeight * scale,
      new Position(),
      boxSpriteWidth,
      boxSpriteHeight,
    );

    // Ceiling
    this.renderSpriteFromSheet(
      spriteSheet,
      pos.add(boxSpriteWidth * scale, 0),
      bodyWidth,
      boxSpriteHeight * scale,
      new Position(1, 0),
      boxSpriteWidth,
      boxSpriteHeight,
    );

    // Top right corner
    this.renderSpriteFromSheet(
      spriteSheet,
      pos.add(boxSpriteWidth * scale + bodyWidth, 0),
      boxSpriteWidth * scale,
      boxSpriteHeight * scale,
      new Position(2, 0),
      boxSpriteWidth,
      boxSpriteHeight,
    );

    // Left wall
    this.renderSpriteFromSheet(
      spriteSheet,
      pos.add(0, boxSpriteHeight * scale),
      boxSpriteWidth * scale,
      bodyHeight,
      new Position(0, 1),
      boxSpriteWidth,
      boxSpriteHeight,
    );

    // Body
    this.renderSpriteFromSheet(
      spriteSheet,
      pos.add(boxSpriteWidth * scale, boxSpriteHeight * scale),
      bodyWidth,
      bodyHeight,
      new Position(1, 1),
      boxSpriteWidth,
      boxSpriteHeight,
    );

    // Right wall
    this.renderSpriteFromSheet(
      spriteSheet,
      pos.add(boxSpriteWidth * scale + bodyWidth, boxSpriteHeight * scale),
      boxSpriteWidth * scale,
      bodyHeight,
      new Position(2, 1),
      boxSpriteWidth,
      boxSpriteHeight,
    );

    // Bottom left corner
    this.renderSpriteFromSheet(
      spriteSheet,
      pos.add(0, boxSpriteHeight * scale + bodyHeight),
      boxSpriteWidth * scale,
      boxSpriteHeight * scale,
      new Position(0, 2),
      boxSpriteWidth,
      boxSpriteHeight,
    );

    // Floor
    this.renderSpriteFromSheet(
      spriteSheet,
      pos.add(boxSpriteWidth * scale, boxSpriteHeight * scale + bodyHeight),
      bodyWidth,
      boxSpriteHeight * scale,
      new Position(1, 2),
      boxSpriteWidth,
      boxSpriteHeight,
    );

    // Top right corner
    this.renderSpriteFromSheet(
      spriteSheet,
      pos.add(
        boxSpriteWidth * scale + bodyWidth,
        boxSpriteHeight * scale + bodyHeight,
      ),
      boxSpriteWidth * scale,
      boxSpriteHeight * scale,
      new Position(2, 2),
      boxSpriteWidth,
      boxSpriteHeight,
    );
  }
}
export const canvasManager = new CanvasManager();
