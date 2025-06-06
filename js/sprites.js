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
	cursor_silver_bell: new Sprite('./images/cursor_silver_bell.png'),
	game_border: new Sprite('./images/game_border.png'),
	game_bg: new Sprite('./images/game_bg.png'),
	icon_clock: new Sprite('./images/icon_clock.png'),
	icon_damage: new Sprite('./images/icon_damage.png'),
	icon_dirt: new Sprite('./images/icon_dirt.png'),
	icon_door: new Sprite('./images/icon_door.png'),
	icon_gold: new Sprite('./images/icon_gold.png'),
	icon_heart: new Sprite('./images/icon_heart.png'),
	icon_reflection: new Sprite('./images/icon_reflection.png'),
	icon_shield: new Sprite('./images/icon_shield.png'),
	icon_sword: new Sprite('./images/icon_sword.png'),
	icon_time_reduction: new Sprite('./images/icon_time_reduction.png'),
	icon_weight: new Sprite('./images/icon_weight.png'),
	icon_worm: new Sprite('./images/icon_worm.png'),
	minus_red: new Sprite('./images/minus_red.png'),
	numbers: new Sprite('./images/numbers.png'),
	numbers_blue: new Sprite('./images/numbers_blue.png'),
	numbers_brown: new Sprite('./images/numbers_brown.png'),
	numbers_green: new Sprite('./images/numbers_green.png'),
	numbers_gray: new Sprite('./images/numbers_gray.png'),
	numbers_gold: new Sprite('./images/numbers_gold.png'),
	numbers_lime: new Sprite('./images/numbers_lime.png'),
	numbers_purple: new Sprite('./images/numbers_purple.png'),
	numbers_red: new Sprite('./images/numbers_red.png'),
	numbers_yellow: new Sprite('./images/numbers_yellow.png'),
	numbers_symbols_gray: new Sprite('./images/numbers_symbols_gray.png'),
	numbers_symbols_green: new Sprite('./images/numbers_symbols_green.png'),
	numbers_symbols_red: new Sprite('./images/numbers_symbols_red.png'),
	screen_defeat: new Sprite('./images/screen_defeat.png'),
	screen_paused: new Sprite('./images/screen_paused.png'),

	//items
	big_sword: new Sprite('./images/big_sword.png'),
	big_sword_selected: new Sprite('./images/big_sword_selected.png'),
	big_sword_shop_description: new Sprite('./images/big_sword_shop_description.png'),
	chainmail_armor: new Sprite('./images/chainmail_armor.png'),
	chainmail_armor_selected: new Sprite('./images/chainmail_armor_selected.png'),
	chainmail_armor_shop_description: new Sprite('./images/chainmail_armor_shop_description.png'),
	dagger: new Sprite('./images/dagger.png'),
	dagger_selected: new Sprite('./images/dagger_selected.png'),
	dagger_shop_description: new Sprite('./images/dagger_shop_description.png'),
	dark_crystal: new Sprite('./images/dark_crystal.png'),
	dark_crystal_selected: new Sprite('./images/dark_crystal_selected.png'),
	dark_crystal_shop_description: new Sprite('./images/dark_crystal_shop_description.png'),
	detonator: new Sprite('./images/detonator.png'),
	detonator_selected: new Sprite('./images/detonator_selected.png'),
	detonator_shop_description: new Sprite('./images/detonator_shop_description.png'),
	drill: new Sprite('./images/drill.png'),
	drill_selected: new Sprite('./images/drill_selected.png'),
	drill_shop_description: new Sprite('./images/drill_shop_description.png'),
	flag: new Sprite('./images/flag.png'),
	flag_selected: new Sprite('./images/flag_selected.png'),
	flag_shop_description: new Sprite('./images/flag_shop_description.png'),
	jade_shield: new Sprite('./images/jade_shield.png'),
	jade_shield_selected: new Sprite('./images/jade_shield_selected.png'),
	jade_shield_shop_description: new Sprite('./images/jade_shield_shop_description.png'),
	picaxe: new Sprite('./images/picaxe.png'),
	potion_health: new Sprite('./images/potion_health.png'),
	potion_health_selected: new Sprite('./images/potion_health_selected.png'),
	potion_health_shop_description: new Sprite('./images/potion_health_shop_description.png'),
	potion_health_small: new Sprite('./images/potion_health_small.png'),
	potion_health_small_selected: new Sprite('./images/potion_health_small_selected.png'),
	potion_health_small_shop_description: new Sprite('./images/potion_health_small_shop_description.png'),
	potion_time: new Sprite('./images/potion_time.png'),
	potion_time_selected: new Sprite('./images/potion_time_selected.png'),
	potion_time_pointer_minute: new Sprite('./images/potion_time_pointer_minute.png'),
	potion_time_pointer_hour: new Sprite('./images/potion_time_pointer_hour.png'),
	potion_time_shop_description: new Sprite('./images/potion_time_shop_description.png'),
	silver_bell: new Sprite('./images/silver_bell.png'),
	silver_bell_selected: new Sprite('./images/silver_bell_selected.png'),
	silver_bell_shop_description: new Sprite('./images/silver_bell_shop_description.png'),
	steel_shield: new Sprite('./images/steel_shield.png'),
	steel_shield_selected: new Sprite('./images/steel_shield_selected.png'),
	steel_shield_shop_description: new Sprite('./images/steel_shield_shop_description.png'),
	swift_vest: new Sprite('./images/swift_vest.png'),
	swift_vest_selected: new Sprite('./images/swift_vest_selected.png'),
	swift_vest_shop_description: new Sprite('./images/swift_vest_shop_description.png'),
	wooden_sword: new Sprite('./images/wooden_sword.png'),
	wooden_sword_selected: new Sprite('./images/wooden_sword_selected.png'),
	wooden_shield: new Sprite('./images/wooden_shield.png'),
	wooden_shield_selected: new Sprite('./images/wooden_shield_selected.png'),

	//shop
	shop_bg: new Sprite('./images/shop_bg.png'),
	shop_buy_button: new Sprite('./images/shop_buy_button.png'),
	shop_buy_button_poor: new Sprite('./images/shop_buy_button_poor.png'),
	letters_shop_description: new Sprite('./images/letters_shop_description.png'),
	
	//battle
	battle_bar: new Sprite('./images/battle_bar.png'),
	battle_bg: new Sprite('./images/battle_bg.png'),
	big_sword_big: new Sprite('./images/big_sword_big.png'),
	dagger_big: new Sprite('./images/dagger_big.png'),
	enemy_shadow: new Sprite('./images/enemy_shadow.png'),
	jade_shield_big: new Sprite('./images/jade_shield_big.png'),
	player_shadow: new Sprite('./images/player_shadow.png'),
	scale_worm_enemy: new Sprite('./images/scale_worm_enemy.png'),
	steel_shield_big: new Sprite('./images/steel_shield_big.png'),
	tired_overlay: new Sprite('./images/tired_overlay.png'),
	worm_enemy: new Sprite('./images/worm_enemy.png'),
	wooden_sword_big: new Sprite('./images/wooden_sword_big.png'),
	wooden_shield_big: new Sprite('./images/wooden_shield_big.png'),

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
	worm_remains: new Sprite('./images/worm_remains.png'),
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
