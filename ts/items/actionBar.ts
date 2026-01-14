import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import { BORDERTHICKBOTTOM, GAMEHEIGHT, GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
import { Timer } from "../timer/timer.js";

type highlightTypes = "damage" | "defense";

export type highlight = {
  startPerc: number;
  widthPerc: number;
  type: highlightTypes;
  value: number;
};

export class ActionBar extends GameObject {
  length: number;
  markerTimer: Timer;
  highLights: highlight[];
  currentHighLights: highlight[] = [];
  started = false;
  pixelsPerSecond: number;

  constructor(length: number, highlights: highlight[]) {
    super({
      sprite: sprites.action_bar_box,
      pos: new Position(
        GAMEWIDTH / 2 - 48 / 2,
        GAMEHEIGHT - BORDERTHICKBOTTOM - 20
      ),
    });

    this.length = length;
    this.highLights = highlights;
    this.pixelsPerSecond = 48 / length;
    this.markerTimer = new Timer({
      goalSecs: this.length,
      deleteAtEnd: false,
      goalFunc: () => {
        this.started = false;
      },
    });
  }

  start() {
    this.markerTimer.start();
    this.currentHighLights = JSON.parse(JSON.stringify(this.highLights));
    this.started = true;
  }

  renderHighlight(canvasManager: CanvasManager, highlight: highlight): void {
    const startX = highlight.startPerc * 0.48;
    const width = highlight.widthPerc * 0.48;
    let sheetShift = new Position();
    switch (highlight.type) {
      case "defense":
        break;
      case "damage":
        sheetShift = sheetShift.add(0, 1);
        break;
    }
    canvasManager.renderSpriteFromSheet(
      sprites.action_highlight_sheet,
      this.pos.add(startX - 1, 1),
      2,
      3,
      sheetShift
    );
    canvasManager.renderSpriteFromSheet(
      sprites.action_highlight_sheet,
      this.pos.add(startX + 1, 1),
      width,
      3,
      sheetShift.add(1, 0),
      2,
      3
    );
    canvasManager.renderSpriteFromSheet(
      sprites.action_highlight_sheet,
      this.pos.add(startX + width + 1, 1),
      2,
      3,
      sheetShift.add(2, 0)
    );
  }

  render(canvasManager: CanvasManager): void {
    //Renders bar
    canvasManager.renderBox(
      sprites.action_bar_box,
      this.pos,
      1,
      1,
      this.length * this.pixelsPerSecond,
      3,
      1
    );

    //Renders highlight
    this.currentHighLights.forEach((h) => {
      this.renderHighlight(canvasManager, h);
    });

    // Render marker
    canvasManager.renderSprite(
      sprites.red_pixel,
      this.pos.add(this.markerTimer.currentSecs * this.pixelsPerSecond - 1, -1),
      2,
      7
    );
  }

  actionCheck(): false | { type: highlightTypes; value: number } {
    let targetHighLight: highlight | undefined = undefined;
    let found = false;
    const markerX = this.markerTimer.percentageProgress;

    for (let i = 0; i < this.currentHighLights.length && !found; i++) {
      const highlight = this.currentHighLights[i]!;
      const prevHighlight = this.currentHighLights[i - 1];
      const nextHighlight = this.currentHighLights[i + 1];
      if (
        !nextHighlight ||
        (markerX > highlight.startPerc &&
          markerX < highlight.widthPerc + highlight.startPerc)
      ) {
        targetHighLight = highlight;
        found = true;
      }
      if (highlight.startPerc > markerX) {
        const nextHlStart = highlight.startPerc;
        const prevHlEnd = prevHighlight
          ? prevHighlight.startPerc + prevHighlight.widthPerc
          : 0;
        if (prevHlEnd != 0 && markerX - prevHlEnd < nextHlStart - markerX) {
          targetHighLight = prevHighlight;
        } else {
          targetHighLight = highlight;
        }
        found = true;
      }
    }

    if (!targetHighLight) {
      return false;
    }

    this.currentHighLights = this.currentHighLights.filter(
      (x) => x != targetHighLight
    );
    if (markerX > targetHighLight.startPerc) {
      return { type: targetHighLight.type, value: targetHighLight.value };
    } else {
      return false;
    }
  }
}
