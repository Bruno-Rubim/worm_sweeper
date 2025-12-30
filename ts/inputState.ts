import Position from "./position.js";

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
  element.addEventListener("keydown", (e) => {
    if (inputState.keyboard[e.key] != "read")
      inputState.keyboard[e.key] = "pressed";
  });
  element.addEventListener("keyup", (e) => {
    inputState.keyboard[e.key] = "unpressed";
  });
}
