import Position from "../gameElements/position.js";

export type keyStates = "pressed" | "unpressed" | "read";

type inputStateType = {
  mouse: {
    pos: Position;
    clickedRight: boolean;
    clickedLeft: boolean;
    heldRight: boolean;
    heldLeft: boolean;
  };
  keyboard: Record<string, keyStates>;
};

// Holds the current state of mouse and keyboard inputs
export const inputState: inputStateType = {
  mouse: {
    pos: new Position(),
    clickedRight: false,
    clickedLeft: false,
    heldRight: false,
    heldLeft: false,
  },
  keyboard: {},
};

/**
 * Binds enventListeners to an HTML element to take player inputs and update the inputState
 * @param element
 */
export function bindListeners(element: HTMLElement) {
  element.addEventListener("mousemove", (e) => {
    inputState.mouse.pos = new Position(e.offsetX, e.offsetY);
  });
  element.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
      inputState.mouse.heldLeft = true;
    } else if (e.button == 2) {
      inputState.mouse.heldRight = true;
    }
  });
  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  element.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
      inputState.mouse.heldLeft = false;
      inputState.mouse.clickedLeft = true;
    } else if (e.button == 2) {
      inputState.mouse.heldRight = false;
      inputState.mouse.clickedRight = true;
    }
  });
  element.addEventListener("keydown", (e) => {
    // console.log(e.key);
    if (inputState.keyboard[e.key] != "read")
      inputState.keyboard[e.key] = "pressed";
  });
  element.addEventListener("keyup", (e) => {
    inputState.keyboard[e.key] = "unpressed";
  });
}
