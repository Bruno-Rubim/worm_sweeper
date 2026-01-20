import Position from "../gameElements/position.js";
export const inputState = {
    mouse: {
        pos: new Position(),
        clickedRight: false,
        clickedLeft: false,
        heldRight: false,
        heldLeft: false,
    },
    keyboard: {},
};
export function bindListeners(element) {
    element.addEventListener("mousemove", (e) => {
        inputState.mouse.pos = new Position(e.offsetX, e.offsetY);
    });
    element.addEventListener("mousedown", (e) => {
        if (e.button == 0) {
            inputState.mouse.heldLeft = true;
        }
        else if (e.button == 2) {
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
        }
        else if (e.button == 2) {
            inputState.mouse.heldRight = false;
            inputState.mouse.clickedRight = true;
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
