class Sprite {
	constructor(src) {
		this.src = src
		this.img = new Image()
	}
	load() {
		const { src, img } = this
		return new Promise((done, fail) => {
			img.onload = () => done(img)
			img.onerror = fail
			img.src = src
		})
	}
}

const sprites = {
	//ui
	cursor_default: new Sprite('./images/cursor_default.png'),
	cursor_detonator: new Sprite('./images/cursor_detonator.png'),
	cursor_flag: new Sprite('./images/cursor_flag.png'),
	cursor_hourglass: new Sprite('./images/cursor_hourglass.png'),
	cursor_picaxe: new Sprite('./images/cursor_picaxe.png'),
	cursor_shield: new Sprite('./images/cursor_shield.png'),
	cursor_sword: new Sprite('./images/cursor_sword.png'),
	game_border: new Sprite('./images/game_border.png'),
	game_bg: new Sprite('./images/game_bg.png'),
	icon_clock: new Sprite('./images/icon_clock.png'),
	icon_damage: new Sprite('./images/icon_damage.png'),
	icon_dirt: new Sprite('./images/icon_dirt.png'),
	icon_door: new Sprite('./images/icon_door.png'),
	icon_gold: new Sprite('./images/icon_gold.png'),
	icon_heart: new Sprite('./images/icon_heart.png'),
	icon_shield: new Sprite('./images/icon_shield.png'),
	icon_sword: new Sprite('./images/icon_sword.png'),
	icon_weight: new Sprite('./images/icon_weight.png'),
	icon_worm: new Sprite('./images/icon_worm.png'),
	minus_red: new Sprite('./images/minus_red.png'),
	numbers: new Sprite('./images/numbers.png'),
	numbers_blue: new Sprite('./images/numbers_blue.png'),
	numbers_brown: new Sprite('./images/numbers_brown.png'),
	numbers_green: new Sprite('./images/numbers_green.png'),
	numbers_gray: new Sprite('./images/numbers_gray.png'),
	numbers_gold: new Sprite('./images/numbers_gold.png'),
	numbers_purple: new Sprite('./images/numbers_purple.png'),
	numbers_red: new Sprite('./images/numbers_red.png'),
	numbers_yellow: new Sprite('./images/numbers_yellow.png'),
	numbers_symbols_gray: new Sprite('./images/numbers_symbols_gray.png'),
	screen_defeat: new Sprite('./images/screen_defeat.png'),
	screen_paused: new Sprite('./images/screen_paused.png'),
	
	//shop
	picaxe: new Sprite('./images/picaxe.png'),
	dagger: new Sprite('./images/dagger.png'),
	dagger_selected: new Sprite('./images/dagger_selected.png'),
	dark_crystal: new Sprite('./images/dark_crystal.png'),
	dark_crystal_selected: new Sprite('./images/dark_crystal_selected.png'),
	detonator: new Sprite('./images/detonator.png'),
	detonator_selected: new Sprite('./images/detonator_selected.png'),
	drill: new Sprite('./images/drill.png'),
	drill_selected: new Sprite('./images/drill_selected.png'),
	flag: new Sprite('./images/flag.png'),
	flag_selected: new Sprite('./images/flag_selected.png'),
	numbers_shop_cost: new Sprite('./images/numbers_shop_cost.png'),
	potion_health: new Sprite('./images/potion_health.png'),
	potion_health_selected: new Sprite('./images/potion_health_selected.png'),
	potion_time: new Sprite('./images/potion_time.png'),
	potion_time_selected: new Sprite('./images/potion_time_selected.png'),
	shop_bg: new Sprite('./images/shop_bg.png'),
	shop_buy_button: new Sprite('./images/shop_buy_button.png'),
	shop_buy_button_poor: new Sprite('./images/shop_buy_button_poor.png'),
	shop_description_chainmail_armor: new Sprite('./images/shop_description_chainmail_armor.png'),
	shop_description_dagger: new Sprite('./images/shop_description_dagger.png'),
	shop_description_dark_crystal: new Sprite('./images/shop_description_dark_crystal.png'),
	shop_description_detonator: new Sprite('./images/shop_description_detonator.png'),
	shop_description_drill: new Sprite('./images/shop_description_drill.png'),
	shop_description_flag: new Sprite('./images/shop_description_flag.png'),
	shop_description_steel_shield: new Sprite('./images/shop_description_steel_shield.png'),
	shop_description_potion_health: new Sprite('./images/shop_description_potion_health.png'),
	shop_description_potion_time: new Sprite('./images/shop_description_potion_time.png'),
	wooden_sword: new Sprite('./images/wooden_sword.png'),
	wooden_sword_selected: new Sprite('./images/wooden_sword_selected.png'),
	wooden_shield: new Sprite('./images/wooden_shield.png'),
	wooden_shield_selected: new Sprite('./images/wooden_shield_selected.png'),
	steel_shield: new Sprite('./images/steel_shield.png'),
	steel_shield_selected: new Sprite('./images/steel_shield_selected.png'),
	chainmail_armor: new Sprite('./images/chainmail_armor.png'),
	chainmail_armor_selected: new Sprite('./images/chainmail_armor_selected.png'),
	
	//battle
	battle_bar: new Sprite('./images/battle_bar.png'),
	battle_bg: new Sprite('./images/battle_bg.png'),
	dagger_big: new Sprite('./images/dagger_big.png'),
	enemy_shadow: new Sprite('./images/enemy_shadow.png'),
	player_shadow: new Sprite('./images/player_shadow.png'),
	tired_overlay: new Sprite('./images/tired_overlay.png'),
	worm_enemy: new Sprite('./images/worm_enemy.png'),
	wooden_sword_big: new Sprite('./images/wooden_sword_big.png'),
	wooden_shield_big: new Sprite('./images/wooden_shield_big.png'),
	steel_shield_big: new Sprite('./images/steel_shield_big.png'),

	//mine
	dirt_block_unknown: new Sprite('./images/dirt_block_unknown.png'),
	dirt_block_hidden: new Sprite('./images/dirt_block_hidden.png'),
	empty: new Sprite('./images/empty_block.png'),
	exit_door: new Sprite('./images/exit_door.png'),
	exit_door_open: new Sprite('./images/exit_door_open.png'),
	ground_numbers: new Sprite('./images/ground_numbers.png'),
	gold_ore: new Sprite('./images/gold_ore.png'),
	marker_threat: new Sprite('./images/marker_threat.png'),
	marker_unsure: new Sprite('./images/marker_unsure.png'),
	marker_wrong: new Sprite('./images/marker_wrong.png'),
	shop_door: new Sprite('./images/shop_door.png'),
	shop_door_open: new Sprite('./images/shop_door_open.png'),
	threat: new Sprite('./images/threat.png'),
	worm: new Sprite('./images/worm.png'),
}

const spriteArr = Object.values(sprites)
const promises = spriteArr.map((sprite) => sprite.load())
await Promise.all(promises)

export default sprites

export function findSprite(spriteName) {
	const sprite = sprites[spriteName.replaceAll('-', '_')]
	if (!sprite) {
		throw new Error(`Sprite ${spriteName} not found`)
	}
	return sprite
}
