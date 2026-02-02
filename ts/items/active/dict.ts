import Position from "../../gameElements/position.js";
import { ActiveItem } from "./active.js";
import { Radar } from "./radar.js";
import { SilverBell } from "./silverBell.js";

const activeDict = {
  silver_bell: new SilverBell(),
  radar: new Radar(),

  empty: new ActiveItem({
    spriteSheetPos: new Position(14, 0),
    name: "empty",
    shopName: "",
    cost: 0,
    descriptionText: "",
  }),
  locked: new ActiveItem({
    spriteSheetPos: new Position(-1, -1),
    name: "locked",
    shopName: "",
    cost: 0,
    descriptionText: "",
  }),
};

export default activeDict;
