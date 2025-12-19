import Sprite from "./sprite.js";

const sprites: Record<string, Sprite> = {
  armor_chainmail_selected: new Sprite("./images/armor_chainmail_selected.png"),
  armor_chainmail: new Sprite("./images/armor_chainmail.png"),
  armor_swift_selected: new Sprite("./images/armor_swift_selected.png"),
  armor_swift: new Sprite("./images/armor_swift.png"),
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
  button_buy_poor: new Sprite("./images/button_buy_poor.png"),
  button_buy: new Sprite("./images/button_buy.png"),
  content_sheet: new Sprite("./images/content_sheet.png"),
  cursor_default: new Sprite("./images/cursor_default.png"),
  cursor_detonator: new Sprite("./images/cursor_detonator.png"),
  cursor_flag: new Sprite("./images/cursor_flag.png"),
  cursor_hourglass: new Sprite("./images/cursor_hourglass.png"),
  cursor_picaxe: new Sprite("./images/cursor_picaxe.png"),
  cursor_shield: new Sprite("./images/cursor_shield.png"),
  cursor_silver_bell: new Sprite("./images/cursor_silver_bell.png"),
  cursor_sword: new Sprite("./images/cursor_sword.png"),
  door_sheet: new Sprite("./images/door_sheet.png"),
  enemy_scale_worm: new Sprite("./images/enemy_scale_worm.png"),
  enemy_shadow: new Sprite("./images/enemy_shadow.png"),
  enemy_worm: new Sprite("./images/enemy_worm.png"),
  game_border: new Sprite("./images/game_border.png"),
  icon_clock: new Sprite("./images/icon_clock.png"),
  icon_damage: new Sprite("./images/icon_damage.png"),
  icon_dirt: new Sprite("./images/icon_dirt.png"),
  icon_door: new Sprite("./images/icon_door.png"),
  icon_gold: new Sprite("./images/icon_gold.png"),
  icon_heart: new Sprite("./images/icon_heart.png"),
  icon_reflection: new Sprite("./images/icon_reflection.png"),
  icon_shield: new Sprite("./images/icon_shield.png"),
  icon_sword: new Sprite("./images/icon_sword.png"),
  icon_time_reduction: new Sprite("./images/icon_time_reduction.png"),
  icon_weight: new Sprite("./images/icon_weight.png"),
  icon_worm: new Sprite("./images/icon_worm.png"),
  item_dark_crystal_selected: new Sprite(
    "./images/item_dark_crystal_selected.png"
  ),
  item_dark_crystal: new Sprite("./images/item_dark_crystal.png"),
  item_detonator_selected: new Sprite("./images/item_detonator_selected.png"),
  item_detonator: new Sprite("./images/item_detonator.png"),
  item_drill_selected: new Sprite("./images/item_drill_selected.png"),
  item_drill: new Sprite("./images/item_drill.png"),
  item_flag_selected: new Sprite("./images/item_flag_selected.png"),
  item_flag: new Sprite("./images/item_flag.png"),
  item_picaxe: new Sprite("./images/item_picaxe.png"),
  item_potion_health_selected: new Sprite(
    "./images/item_potion_health_selected.png"
  ),
  item_potion_health_small_selected: new Sprite(
    "./images/item_potion_health_small_selected.png"
  ),
  item_potion_health_small: new Sprite("./images/item_potion_health_small.png"),
  item_potion_health: new Sprite("./images/item_potion_health.png"),
  item_potion_time_pointer_hour: new Sprite(
    "./images/item_potion_time_pointer_hour.png"
  ),
  item_potion_time_pointer_minute: new Sprite(
    "./images/item_potion_time_pointer_minute.png"
  ),
  item_potion_time_selected: new Sprite(
    "./images/item_potion_time_selected.png"
  ),
  item_potion_time: new Sprite("./images/item_potion_time.png"),
  item_silver_bell_selected: new Sprite(
    "./images/item_silver_bell_selected.png"
  ),
  item_silver_bell: new Sprite("./images/item_silver_bell.png"),
  marker_threat: new Sprite("./images/marker_threat.png"),
  marker_unsure: new Sprite("./images/marker_unsure.png"),
  marker_wrong: new Sprite("./images/marker_wrong.png"),
  minus_red: new Sprite("./images/minus_red.png"),
  numbers_blue: new Sprite("./images/numbers_blue.png"),
  numbers_brown: new Sprite("./images/numbers_brown.png"),
  numbers_gold: new Sprite("./images/numbers_gold.png"),
  numbers_gray: new Sprite("./images/numbers_gray.png"),
  numbers_green: new Sprite("./images/numbers_green.png"),
  numbers_lime: new Sprite("./images/numbers_lime.png"),
  numbers_purple: new Sprite("./images/numbers_purple.png"),
  numbers_red: new Sprite("./images/numbers_red.png"),
  numbers_symbols_gray: new Sprite("./images/numbers_symbols_gray.png"),
  numbers_symbols_green: new Sprite("./images/numbers_symbols_green.png"),
  numbers_symbols_red: new Sprite("./images/numbers_symbols_red.png"),
  numbers_yellow: new Sprite("./images/numbers_yellow.png"),
  numbers: new Sprite("./images/numbers.png"),
  player_shadow: new Sprite("./images/player_shadow.png"),
  screen_defeat: new Sprite("./images/screen_defeat.png"),
  screen_paused: new Sprite("./images/screen_paused.png"),
  shield_jade_selected: new Sprite("./images/shield_jade_selected.png"),
  shield_jade: new Sprite("./images/shield_jade.png"),
  shield_steel_selected: new Sprite("./images/shield_steel_selected.png"),
  shield_steel: new Sprite("./images/shield_steel.png"),
  shield_wood_selected: new Sprite("./images/shield_wood_selected.png"),
  shield_wood: new Sprite("./images/shield_wood.png"),
  sword_big_selected: new Sprite("./images/sword_big_selected.png"),
  sword_big: new Sprite("./images/sword_big.png"),
  sword_dagger_selected: new Sprite("./images/sword_dagger_selected.png"),
  sword_dagger: new Sprite("./images/sword_dagger.png"),
  sword_wood_selected: new Sprite("./images/sword_wood_selected.png"),
  sword_wood: new Sprite("./images/sword_wood.png"),
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
