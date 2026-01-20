import { BORDERTHICKLEFT, BORDERTHICKTOP, } from "../global.js";
import Position from "../gameElements/position.js";
export default class SceneManager {
    pos;
    handleHover;
    handleNotHover;
    handleHeld;
    handleClick;
    render;
    constructor() {
        this.pos = new Position(BORDERTHICKLEFT, BORDERTHICKTOP);
        this.handleHover = () => { };
        this.handleNotHover = () => { };
        this.handleHeld = () => { };
        this.handleClick = () => { };
        this.render = () => { };
    }
}
