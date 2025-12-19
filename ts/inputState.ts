import Position from "./position.js";

export const inputState = {
  mouse: {
    pos: new Position(),
    clickedRight: false,
    clickedLeft: false,
    heldRight: false,
    heldLeft: false,
  },
};

export function bindListeners(element: HTMLElement) {
  element.addEventListener("mousemove", (e) => {
    inputState.mouse.pos = new Position(e.offsetX, e.offsetY);
  });
  element.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
      inputState.mouse.heldRight = true;
    } else if (e.button == 2) {
      inputState.mouse.heldLeft = true;
    }
  });
  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  element.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
      inputState.mouse.heldRight = false;
      inputState.mouse.clickedRight = true;
    } else if (e.button == 2) {
      inputState.mouse.heldLeft = false;
      inputState.mouse.clickedLeft = true;
    }
  });
}
