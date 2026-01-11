export default class SceneManager {
    gameState;
    pos;
    soundManager;
    handleHover;
    handleNotHover;
    handleHeld;
    handleClick;
    render;
    constructor(gameState, scenePos, soundManager) {
        this.gameState = gameState;
        this.pos = scenePos;
        this.soundManager = soundManager;
        this.handleHover = () => { };
        this.handleNotHover = () => { };
        this.handleHeld = () => { };
        this.handleClick = () => { };
        this.render = () => { };
    }
}
