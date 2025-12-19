import type GameObject from "./gameObject.js";
import { levelInterface } from "./level/levelInterface.js";
import Level from "./level/level.js";

export class GameManager {
  levelInterface = new levelInterface(new Level({}));
  gameObjects: GameObject[] = [this.levelInterface];
}
