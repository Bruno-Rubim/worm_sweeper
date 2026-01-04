export default class SceneManager {
    handleHover;
    handleHeld;
    handleClick;
    render;
    gameState;
    pos;
    soundManager;
    constructor(gameState, scenePos, soundManager) {
        this.gameState = gameState;
        this.pos = scenePos;
        this.soundManager = soundManager;
        this.handleHover = () => { };
        this.handleHeld = () => { };
        this.handleClick = () => { };
        this.render = () => { };
    }
}
