import { ctx, renderScale } from "../canvas_handler.js";
import { findSprite } from "../sprites.js";
import {
  borderLength,
  borderThicness,
  gameCursor,
  gameManager,
} from "./game_manager.js";
import { checkTic } from "./game_tics.js";
import { Tool } from "./item.js";

function renderBorder() {
  ctx.drawImage(
    findSprite("game_border").img,
    0,
    0,
    borderLength * renderScale,
    borderLength * renderScale
  );
}

function renderInventory() {
  let index = 0;
  gameManager.inventory.forEach((item) => {
    if (!(item instanceof Tool)) {
      return;
    }
    ctx.drawImage(
      item.sprite,
      (borderLength - borderThicness + 2) * renderScale,
      (borderLength - (index + 2) * 17 - 2) * renderScale,
      16 * renderScale,
      16 * renderScale
    );
    index++;
  });
  ctx.drawImage(
    findSprite(gameManager.player.shieldItem.name).img,
    2 * renderScale,
    (borderLength - borderThicness - 34) * renderScale,
    16 * renderScale,
    16 * renderScale
  );
  ctx.drawImage(
    findSprite(gameManager.player.weaponItem.name).img,
    2 * renderScale,
    (borderLength - borderThicness - 17) * renderScale,
    16 * renderScale,
    16 * renderScale
  );
  if (gameManager.player.armorItem) {
    ctx.drawImage(
      findSprite(gameManager.player.armorItem.name).img,
      2 * renderScale,
      (borderLength - borderThicness - 53) * renderScale,
      16 * renderScale,
      16 * renderScale
    );
  }
}

const numberWidth = 8;
const numberPadding = 6;
const numberSymbols = {
  ".": 0,
  "-": 1,
};
const symbolGap = {
  ".": 1.5,
  "-": 0,
};

export function renderNumbers(
  number,
  digitSkip,
  posStartX,
  posStartY,
  numberGap,
  order,
  color
) {
  let vector = [...number.toString()];
  if (digitSkip > vector.length) {
    digitSkip = vector.length;
  }
  for (let i = 0; i < digitSkip; i++) {
    vector.pop();
  }
  if (order == "normal") {
    let shiftX = 0;
    vector.forEach((char, index) => {
      if (isNaN(Number(char))) {
        ctx.drawImage(
          findSprite(`numbers_symbols_${color}`).img,
          numberWidth * numberSymbols[char],
          0,
          numberWidth,
          numberWidth,
          (numberWidth * index +
            posStartX +
            (numberGap - Math.floor(symbolGap[char])) * index) *
            renderScale,
          posStartY * renderScale,
          numberWidth * renderScale,
          numberWidth * renderScale
        );
        shiftX -= symbolGap[char] * 2;
        return;
      }
      let number = Number(char);
      ctx.drawImage(
        findSprite(`numbers_${color}`).img,
        numberWidth * number,
        0,
        numberWidth,
        numberWidth,
        (numberWidth * index + posStartX + numberGap * index + shiftX) *
          renderScale,
        posStartY * renderScale,
        numberWidth * renderScale,
        numberWidth * renderScale
      );
    });
  } else if (order == "reversed") {
    vector.forEach((char, index) => {
      if (isNaN(Number(char))) {
        ctx.drawImage(
          findSprite(`numbers_symbols_${color}`).img,
          numberWidth * numberSymbols[char],
          0,
          numberWidth,
          numberWidth,
          (numberWidth * index +
            posStartX +
            (numberGap - Math.floor(symbolGap[char])) * index) *
            renderScale,
          posStartY * renderScale,
          numberWidth * renderScale,
          numberWidth * renderScale
        );
        shiftX -= symbolGap[char] * 2;
        return;
      }
      let number = Number(char);
      ctx.drawImage(
        findSprite(`numbers_${color}`).img,
        numberWidth * number,
        0,
        numberWidth,
        numberWidth,
        (borderLength -
          (posStartX + //base start
            (numberWidth + numberGap) * (vector.length - index))) * //individual number
          renderScale,
        posStartY * renderScale,
        numberWidth * renderScale,
        numberWidth * renderScale
      );
    });
  } else if (order == "centered") {
    vector.forEach((number, index) => {
      ctx.drawImage(
        findSprite(`numbers_${color}`).img,
        numberWidth * number,
        0,
        numberWidth,
        numberWidth,
        (posStartX -
          vector.length * ((numberWidth + numberGap) / 2) +
          (numberWidth + numberGap) * index) *
          renderScale,
        posStartY * renderScale,
        numberWidth * renderScale,
        numberWidth * renderScale
      );
    });
  }
}
const shopLetterCellWidth = 9;
const shopLetter = {
  A: { posX: 0, posY: 0, width: 6 },
  B: { posX: 1, posY: 0, width: 6 },
  C: { posX: 2, posY: 0, width: 6 },
  D: { posX: 3, posY: 0, width: 6 },
  E: { posX: 4, posY: 0, width: 6 },
  F: { posX: 5, posY: 0, width: 6 },
  G: { posX: 6, posY: 0, width: 6 },
  H: { posX: 7, posY: 0, width: 6 },
  I: { posX: 8, posY: 0, width: 3 },
  J: { posX: 9, posY: 0, width: 5 },
  K: { posX: 10, posY: 0, width: 7 },
  L: { posX: 11, posY: 0, width: 5 },
  M: { posX: 12, posY: 0, width: 8 },
  N: { posX: 13, posY: 0, width: 7 },
  O: { posX: 0, posY: 1, width: 7 },
  P: { posX: 1, posY: 1, width: 6 },
  Q: { posX: 2, posY: 1, width: 7 },
  R: { posX: 3, posY: 1, width: 6 },
  S: { posX: 4, posY: 1, width: 5 },
  T: { posX: 5, posY: 1, width: 7 },
  U: { posX: 6, posY: 1, width: 6 },
  V: { posX: 7, posY: 1, width: 7 },
  W: { posX: 8, posY: 1, width: 8 },
  X: { posX: 9, posY: 1, width: 7 },
  Y: { posX: 10, posY: 1, width: 7 },
  Z: { posX: 11, posY: 1, width: 6 },
  a: { posX: 0, posY: 2, width: 6 },
  b: { posX: 1, posY: 2, width: 6 },
  c: { posX: 2, posY: 2, width: 5 },
  d: { posX: 3, posY: 2, width: 6 },
  e: { posX: 4, posY: 2, width: 6 },
  f: { posX: 5, posY: 2, width: 4 },
  g: { posX: 6, posY: 2, width: 6 },
  h: { posX: 7, posY: 2, width: 6 },
  i: { posX: 8, posY: 2, width: 3 },
  j: { posX: 9, posY: 2, width: 4 },
  k: { posX: 10, posY: 2, width: 6 },
  l: { posX: 11, posY: 2, width: 3 },
  m: { posX: 12, posY: 2, width: 8 },
  n: { posX: 13, posY: 2, width: 6 },
  o: { posX: 0, posY: 3, width: 6 },
  p: { posX: 1, posY: 3, width: 6 },
  q: { posX: 2, posY: 3, width: 6 },
  r: { posX: 3, posY: 3, width: 5 },
  s: { posX: 4, posY: 3, width: 5 },
  t: { posX: 5, posY: 3, width: 4 },
  u: { posX: 6, posY: 3, width: 6 },
  v: { posX: 7, posY: 3, width: 6 },
  w: { posX: 8, posY: 3, width: 8 },
  x: { posX: 9, posY: 3, width: 6 },
  y: { posX: 10, posY: 3, width: 6 },
  z: { posX: 11, posY: 3, width: 6 },
  0: { posX: 0, posY: 4, width: 6 },
  1: { posX: 1, posY: 4, width: 4 },
  2: { posX: 2, posY: 4, width: 6 },
  3: { posX: 3, posY: 4, width: 6 },
  4: { posX: 4, posY: 4, width: 6 },
  5: { posX: 5, posY: 4, width: 6 },
  6: { posX: 6, posY: 4, width: 6 },
  7: { posX: 7, posY: 4, width: 6 },
  8: { posX: 8, posY: 4, width: 6 },
  9: { posX: 9, posY: 4, width: 6 },
  ":": { posX: 10, posY: 4, width: 3 },
  ".": { posX: 11, posY: 4, width: 3 },
  "-": { posX: 12, posY: 4, width: 5 },
  "/": { posX: 13, posY: 4, width: 4 },
  " ": { posX: 6, posY: -1, width: 4 },
};

function renderShopLetters(
  string,
  lineShiftY = 0,
  lineShiftX = 0,
  lineCount = 0,
  lineCharCount = 0,
  lineWidth = 0
) {
  let vector = [...string];
  function nextLine() {
    lineCount++, (lineCharCount = 0);
    lineWidth = 0;
  }
  vector.forEach((char) => {
    if (char == " " && lineCharCount == 0) {
      return;
    }
    if (char == "%") {
      lineShiftY += 3;
      nextLine();
      return;
    }
    if (char == "#") {
      nextLine();
      return;
    }
    ctx.drawImage(
      findSprite("letters_shop_description").img,
      shopLetter[char].posX * shopLetterCellWidth,
      shopLetter[char].posY * shopLetterCellWidth,
      shopLetterCellWidth,
      shopLetterCellWidth,
      (24 + lineWidth + lineShiftX) * renderScale,
      (96 + shopLetterCellWidth * lineCount + lineShiftY) * renderScale,
      shopLetterCellWidth * renderScale,
      shopLetterCellWidth * renderScale
    );
    lineWidth += shopLetter[char].width;
    lineCharCount++;
    if (lineWidth >= 84) {
      nextLine();
    }
  });
}

export function renderShopDescription(item) {
  const description = item.description;
  if (!description) {
    console.warn("no description");
    return;
  }

  renderShopLetters(description);

  let statCount = 0;
  if (item.damage) {
    statCount++;
    ctx.drawImage(
      findSprite("icon_sword").img,
      (borderThicness + 4) * renderScale,
      (borderThicness + 79 + 9 * statCount) * renderScale,
      8 * renderScale,
      8 * renderScale
    );
    renderShopLetters("Damage:", 9 * statCount + 3, 9);
    renderNumbers(
      item.damage,
      0,
      borderThicness + 54,
      borderThicness + 88,
      -1,
      "normal",
      "red"
    );
  }
  if (item.block) {
    statCount++;
    ctx.drawImage(
      findSprite("icon_shield").img,
      (borderThicness + 4) * renderScale,
      (borderThicness + 79 + 9 * statCount) * renderScale,
      8 * renderScale,
      8 * renderScale
    );
    renderShopLetters("Block:", 9 * statCount + 3, 9);
    renderNumbers(
      item.block,
      0,
      borderThicness + 42,
      borderThicness + 79 + 9 * statCount,
      -1,
      "normal",
      "blue"
    );
  }
  if (item.reflection) {
    statCount++;
    ctx.drawImage(
      findSprite("icon_reflection").img,
      (borderThicness + 4) * renderScale,
      (borderThicness + 79 + 9 * statCount) * renderScale,
      8 * renderScale,
      8 * renderScale
    );
    renderShopLetters("Reflect:", 9 * statCount + 3, 9);
    renderNumbers(
      item.reflection,
      0,
      borderThicness + 50,
      borderThicness + 79 + 9 * statCount,
      -1,
      "normal",
      "lime"
    );
  }
  if (item.weight) {
    statCount++;
    ctx.drawImage(
      findSprite("icon_weight").img,
      (borderThicness + 4) * renderScale,
      (borderThicness + 79 + 9 * statCount) * renderScale,
      8 * renderScale,
      8 * renderScale
    );
    renderShopLetters("Weight:", 9 * statCount + 3, 9);
    renderNumbers(
      item.weight,
      0,
      borderThicness + 49,
      borderThicness + 79 + 9 * statCount,
      -1,
      "normal",
      "gray"
    );
  }
  if (item.speed) {
    if (item.speed > 0) {
      statCount++;
      ctx.drawImage(
        findSprite("icon_time_reduction").img,
        (borderThicness + 4) * renderScale,
        (borderThicness + 79 + 9 * statCount) * renderScale,
        8 * renderScale,
        8 * renderScale
      );
      renderShopLetters("Speed:", 9 * statCount + 3, 9);
      renderNumbers(
        item.speed,
        0,
        borderThicness + 45,
        borderThicness + 79 + 9 * statCount,
        -1,
        "normal",
        "green"
      );
    }
  }
  if (item.healing) {
    renderNumbers(
      item.healing,
      0,
      borderThicness + 55,
      borderThicness + 97,
      -1,
      "normal",
      "red"
    );
    ctx.drawImage(
      findSprite("icon_heart").img,
      (borderThicness + 64) * renderScale,
      (borderThicness + 97) * renderScale,
      8 * renderScale,
      8 * renderScale
    );
  }
  if (item.secondsAdd) {
    renderNumbers(
      item.secondsAdd,
      0,
      borderThicness + 55,
      borderThicness + 88,
      -1,
      "normal",
      "blue"
    );
    ctx.drawImage(
      findSprite("icon_clock").img,
      (borderThicness + 71) * renderScale,
      (borderThicness + 88) * renderScale,
      8 * renderScale,
      8 * renderScale
    );
  }
  ctx.drawImage(
    findSprite("icon_gold").img,
    (borderThicness + 114) * renderScale,
    (borderThicness + 78) * renderScale,
    8 * renderScale,
    8 * renderScale
  );
  renderNumbers(
    item.cost,
    0,
    borderThicness + 16,
    borderThicness + 78,
    -1,
    "reversed",
    "gold"
  );
}

function renderHealth() {
  if (gameManager.currentLevel.currentBattle) {
    for (let i = 0; i < gameManager.player.hp; i++) {
      ctx.drawImage(
        findSprite("icon_heart").img,
        (borderLength / 2 - gameManager.player.hp * 4.5 + 9 * i) * renderScale,
        135 * renderScale,
        8 * renderScale,
        8 * renderScale
      );
    }
  } else {
    for (let i = 0; i < gameManager.player.hp; i++) {
      ctx.drawImage(
        findSprite("icon_heart").img,
        numberPadding * renderScale,
        (numberPadding + 9 * i + 12) * renderScale,
        8 * renderScale,
        8 * renderScale
      );
    }
  }
}

function renderTimer() {
  ctx.drawImage(
    findSprite(`icon_clock`).img,
    numberPadding * renderScale,
    numberPadding * renderScale,
    numberWidth * renderScale,
    numberWidth * renderScale
  );
  let seconds = gameManager.timer.seconds;
  if (seconds <= 0) {
    seconds = 0;
  }
  renderNumbers(seconds, 0, 14, numberPadding, -1, "normal", "blue");
}

function renderWormCounter() {
  const shiftX = numberPadding + 14 + 30;
  ctx.drawImage(
    findSprite(`icon_worm`).img,
    shiftX * renderScale,
    numberPadding * renderScale,
    8 * renderScale,
    8 * renderScale
  );
  let counter = gameManager.currentLevel.wormsLeft;
  renderNumbers(counter, 0, shiftX + 9, numberPadding, -1, "normal", "red");
}

function renderBlockCount() {
  ctx.drawImage(
    findSprite(`icon_dirt`).img,
    (borderLength - numberPadding - 56) * renderScale,
    numberPadding * renderScale,
    8 * renderScale,
    8 * renderScale
  );
  let counter = gameManager.currentLevel.blockCount;
  let negative = false;
  if (counter < 0) {
    counter = Math.abs(counter);
    negative = true;
  }
  renderNumbers(
    counter,
    0,
    numberPadding + 58,
    numberPadding,
    -1,
    "reversed",
    "brown"
  );
}

function renderDepth() {
  ctx.drawImage(
    findSprite(`icon_door`).img,
    (borderLength - numberPadding - 8) * renderScale,
    numberPadding * renderScale,
    8 * renderScale,
    8 * renderScale
  );
  renderNumbers(
    gameManager.currentLevel.depth + 1,
    0,
    numberPadding + numberWidth + 2,
    numberPadding,
    -1,
    "reversed",
    "green"
  );
}

function renderGoldCounter() {
  ctx.drawImage(
    findSprite(`icon_gold`).img,
    (borderLength - numberPadding - 8) * renderScale,
    (borderLength - numberPadding - 8) * renderScale,
    8 * renderScale,
    8 * renderScale
  );
  renderNumbers(
    gameManager.gold,
    0,
    numberPadding + 10,
    borderLength - numberWidth - numberPadding,
    -1,
    "reversed",
    "gold"
  );
}

function renderScreenOverlay() {
  let img = null;
  if (gameManager.ended) {
    img = findSprite("screen_defeat").img;
  } else if (gameManager.paused) {
    img = findSprite("screen_paused").img;
  }
  if (img == null) {
    return;
  }
  ctx.drawImage(
    img,
    borderThicness * renderScale,
    borderThicness * renderScale,
    128 * renderScale,
    128 * renderScale
  );
}

function renderUI() {
  renderHealth();
  renderInventory();
  renderTimer();
  renderWormCounter();
  renderBlockCount();
  renderDepth();
  renderGoldCounter();
  renderScreenOverlay();
}

function renderCursor() {
  ctx.drawImage(
    gameCursor.sprite,
    (gameCursor.posX - 8) * renderScale,
    (gameCursor.posY - 8) * renderScale,
    16 * renderScale,
    16 * renderScale
  );
}

export function renderGame() {
  checkTic();
  gameManager.currentLevel.render();
  renderBorder();
  renderUI();
  renderCursor();
}
