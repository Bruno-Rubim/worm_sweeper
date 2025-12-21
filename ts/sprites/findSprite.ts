import Sprite from "./sprite.js";

const sprites: Record<string, Sprite> = {
  battle_bar: new Sprite("./images/battle_bar.png"),
  bg_battle: new Sprite("./images/bg_battle.png"),
  bg_game: new Sprite("./images/bg_game.png"),
  bg_shop: new Sprite("./images/bg_shop.png"),
  big_shield_jade: new Sprite("./images/big_shield_jade.png"),
  big_shield_steel: new Sprite("./images/big_shield_steel.png"),
  big_shield_wood: new Sprite("./images/big_shield_wood.png"),
  big_sword_big: new Sprite("./images/big_sword_big.png"),
  big_sword_dagger: new Sprite("./images/big_sword_dagger.png"),
  big_sword_wood: new Sprite("./images/big_sword_wood.png"),
  block_sheet: new Sprite("./images/block_sheet.png"),
  cursor_sheet: new Sprite("./images/cursor_sheet.png"),
  enemy_scale_worm: new Sprite("./images/enemy_scale_worm.png"),
  enemy_shadow: new Sprite("./images/enemy_shadow.png"),
  enemy_worm: new Sprite("./images/enemy_worm.png"),
  game_border: new Sprite("./images/game_border.png"),
  icon_sheet: new Sprite("./images/icon_sheet.png"),
  item_sheet: new Sprite("./images/item_sheet.png"),
  item_potion_time_pointer_hour: new Sprite(
    "./images/item_potion_time_pointer_hour.png"
  ),
  item_potion_time_pointer_minute: new Sprite(
    "./images/item_potion_time_pointer_minute.png"
  ),
  number_sheet: new Sprite("./images/number_sheet.png"),
  numbers: new Sprite("./images/numbers.png"),
  player_shadow: new Sprite("./images/player_shadow.png"),
  screen_defeat: new Sprite("./images/screen_defeat.png"),
  screen_paused: new Sprite("./images/screen_paused.png"),
  transparent_pixel: new Sprite("./images/transparent_pixel.png"),
  worm_remains: new Sprite("./images/worm_remains.png"),
  worm: new Sprite("./images/worm.png"),
};

const spriteArr = Object.values(sprites);
const promises = spriteArr.map((sprite) => sprite.load());
await Promise.all(promises);

export default sprites;

export function findSprite(spriteName: string) {
  const sprite = sprites[spriteName.replaceAll("-", "_")];
  if (!sprite) {
    throw new Error(`Sprite ${spriteName} not found`);
  }
  return sprite;
}
