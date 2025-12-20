import Cave from "./level/cave.js";

type inventory = {};

export default class GameState {
  gold: number;
  time: number;
  level: Cave;

  constructor() {
    this.gold = 0;
    this.time = 0;
    this.level = new Cave({});
  }
}
