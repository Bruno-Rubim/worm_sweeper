import Level from "./level/level.js";

export default class GameState {
  gold: number;
  time: number;
  level: Level;
  constructor() {
    this.gold = 0;
    this.time = 0;
    this.level = new Level({});
  }
}
