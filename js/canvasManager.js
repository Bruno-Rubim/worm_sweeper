import { fontMaps, measureTextWidth } from "./fontMaps.js";
import { GAMEHEIGHT, GAMEWIDTH, LEFT, RIGHT, CENTER } from "./global.js";
import Position from "./gameElements/position.js";
import { utils } from "./utils.js";
export default class CanvasManager {
    canvasElement = document.querySelector("canvas");
    ctx = this.canvasElement?.getContext("2d");
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
        }
        else {
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
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
    renderSprite(sprite, pos, width, height) {
        this.ctx.drawImage(sprite.img, Math.floor(pos.x * this.renderScale), Math.floor(pos.y * this.renderScale), width * this.renderScale, height * this.renderScale);
    }
    renderSpriteFromSheet(spriteSheet, pos, width, height, posInSheet, widthInSheet, heightInSheet) {
        widthInSheet ??= width;
        heightInSheet ??= height;
        this.ctx.drawImage(spriteSheet.img, posInSheet.x * widthInSheet, posInSheet.y * heightInSheet, widthInSheet, heightInSheet, Math.floor(pos.x * this.renderScale), Math.floor(pos.y * this.renderScale), width * this.renderScale, height * this.renderScale);
    }
    renderAnimationFrame(spriteSheet, pos, width, height, sheetWidthInFrames, sheetHeightInFrames, animationStartTic, currentTic, animationSpeed = 1, sheetPosShift = new Position(), loop = true) {
        const totalFrames = sheetWidthInFrames * sheetHeightInFrames;
        const currentFrame = Math.floor((currentTic - animationStartTic) * animationSpeed) %
            (loop ? sheetWidthInFrames * sheetHeightInFrames : Infinity);
        if (!loop && currentFrame > totalFrames) {
            return;
        }
        const sheetPos = new Position(currentFrame % sheetWidthInFrames, Math.floor(currentFrame / sheetWidthInFrames)).add(sheetPosShift);
        this.ctx.drawImage(spriteSheet.img, sheetPos.x * width, sheetPos.y * height, width, height, Math.floor(pos.x * this.renderScale), Math.floor(pos.y * this.renderScale), width * this.renderScale, height * this.renderScale);
    }
    renderText(font, pos, text, direction = RIGHT, limitWidth = Infinity, fontSize = 1) {
        const fontMap = fontMaps[font];
        const words = text.split(" ");
        let currentLineWidth = 0;
        words.forEach((word, i) => {
            if (word.includes("\n")) {
                const breakWords = word.split("\n");
                const firstWidth = measureTextWidth(font, breakWords[0]) * fontSize;
                const lastWidth = measureTextWidth(font, utils.lastOfArray(breakWords)) * fontSize;
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
            }
            else {
                currentLineWidth +=
                    wordWidth + (fontMap.charMaps[" "]?.width ?? 0) * fontSize;
            }
        });
        const lines = words.join(" ").replaceAll(" \n", "\n").split("\n");
        let currentX = 0;
        let currentY = 0;
        for (let lineId in lines) {
            const line = lines[lineId];
            if (direction == RIGHT) {
                currentX = 0;
            }
            else if (direction == LEFT) {
                currentX = 0 - measureTextWidth(font, line) * fontSize;
            }
            else if (direction == CENTER) {
                currentX = 0 - (measureTextWidth(font, line) * fontSize) / 2;
            }
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
                        this.renderSpriteFromSheet(fontMaps.icons.spriteSheet, pos.add(currentX, currentY), fontMaps.icons.cellWidth * fontSize, fontMaps.icons.cellHeight * fontSize, fontMaps.icons.charMaps[iconWord].pos, fontMaps.icons.cellWidth, fontMaps.icons.cellHeight);
                        currentX += iconChar.width * fontSize;
                    }
                    else {
                        console.warn(iconWord, "ain't no icon chief");
                    }
                    i += 3;
                    continue;
                }
                const charMap = fontMap.charMaps[c];
                this.renderSpriteFromSheet(fontMap.spriteSheet, pos.add(currentX, currentY), fontMap.cellWidth * fontSize, fontMap.cellHeight * fontSize, charMap.pos, fontMap.cellWidth, fontMap.cellHeight);
                currentX += charMap.width * fontSize;
            }
            currentY += fontMap.cellHeight * fontSize;
        }
    }
    renderBox(spriteSheet, pos, boxSpriteWidth, boxSpriteHeight, bodyWidth, bodyHeight, scale = 1) {
        this.renderSpriteFromSheet(spriteSheet, pos, boxSpriteWidth * scale, boxSpriteHeight * scale, new Position(), boxSpriteWidth, boxSpriteHeight);
        this.renderSpriteFromSheet(spriteSheet, pos.add(boxSpriteWidth * scale, 0), bodyWidth, boxSpriteHeight * scale, new Position(1, 0), boxSpriteWidth, boxSpriteHeight);
        this.renderSpriteFromSheet(spriteSheet, pos.add(boxSpriteWidth * scale + bodyWidth, 0), boxSpriteWidth * scale, boxSpriteHeight * scale, new Position(2, 0), boxSpriteWidth, boxSpriteHeight);
        this.renderSpriteFromSheet(spriteSheet, pos.add(0, boxSpriteHeight * scale), boxSpriteWidth * scale, bodyHeight, new Position(0, 1), boxSpriteWidth, boxSpriteHeight);
        this.renderSpriteFromSheet(spriteSheet, pos.add(boxSpriteWidth * scale, boxSpriteHeight * scale), bodyWidth, bodyHeight, new Position(1, 1), boxSpriteWidth, boxSpriteHeight);
        this.renderSpriteFromSheet(spriteSheet, pos.add(boxSpriteWidth * scale + bodyWidth, boxSpriteHeight * scale), boxSpriteWidth * scale, bodyHeight, new Position(2, 1), boxSpriteWidth, boxSpriteHeight);
        this.renderSpriteFromSheet(spriteSheet, pos.add(0, boxSpriteHeight * scale + bodyHeight), boxSpriteWidth * scale, boxSpriteHeight * scale, new Position(0, 2), boxSpriteWidth, boxSpriteHeight);
        this.renderSpriteFromSheet(spriteSheet, pos.add(boxSpriteWidth * scale, boxSpriteHeight * scale + bodyHeight), bodyWidth, boxSpriteHeight * scale, new Position(1, 2), boxSpriteWidth, boxSpriteHeight);
        this.renderSpriteFromSheet(spriteSheet, pos.add(boxSpriteWidth * scale + bodyWidth, boxSpriteHeight * scale + bodyHeight), boxSpriteWidth * scale, boxSpriteHeight * scale, new Position(2, 2), boxSpriteWidth, boxSpriteHeight);
    }
}
export const canvasManager = new CanvasManager();
