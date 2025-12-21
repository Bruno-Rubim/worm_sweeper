import Sprite from "./sprite.js";

const sprites = {
  "9s": new Sprite("9s"),
  battle_bar: new Sprite("battle_bar"),
  bg_battle: new Sprite("bg_battle"),
  bg_game: new Sprite("bg_game"),
  bg_shop: new Sprite("bg_shop"),
  big_shield_jade: new Sprite("big_shield_jade"),
  big_shield_steel: new Sprite("big_shield_steel"),
  big_shield_wood: new Sprite("big_shield_wood"),
  big_sword_big: new Sprite("big_sword_big"),
  big_sword_dagger: new Sprite("big_sword_dagger"),
  big_sword_wood: new Sprite("big_sword_wood"),
  block_sheet: new Sprite("block_sheet"),
  button_exit: new Sprite("button_exit"),
  cursor_sheet: new Sprite("cursor_sheet"),
  enemy_scale_worm: new Sprite("enemy_scale_worm"),
  enemy_shadow: new Sprite("enemy_shadow"),
  enemy_worm: new Sprite("enemy_worm"),
  game_border: new Sprite("game_border"),
  icon_sheet: new Sprite("icon_sheet"),
  item_sheet: new Sprite("item_sheet"),
  item_potion_time_pointer_hour: new Sprite("item_potion_time_pointer_hour"),
  item_potion_time_pointer_minute: new Sprite(
    "item_potion_time_pointer_minute"
  ),
  number_sheet: new Sprite("number_sheet"),
  numbers: new Sprite("numbers"),
  player_shadow: new Sprite("player_shadow"),
  screen_defeat: new Sprite("screen_defeat"),
  screen_paused: new Sprite("screen_paused"),
  transparent_pixel: new Sprite("transparent_pixel"),
  worm_remains: new Sprite("worm_remains"),
  worm: new Sprite("worm"),
};

const spriteArr = Object.values(sprites);
const promises = spriteArr.map((sprite) => sprite.load());
await Promise.all(promises);

export default sprites;

export function findSprite(spriteName: keyof typeof sprites) {
  if (Math.floor(Math.random() * 1000000) == 999) {
    spriteName = "9s";
  }
  return sprites[spriteName];
}
