export default class SceneManager {
    handleHover;
    handleHeld;
    handleClick;
    render;
    gameState;
    pos;
    constructor(gameState, scenePos) {
        this.gameState = gameState;
        this.pos = scenePos;
        this.handleHover = () => { };
        this.handleHeld = () => { };
        this.handleClick = () => { };
        this.render = () => { };
    }
}
