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
	detonator_cursor: new Sprite('./images/detonator_cursor.png'),
	default_cursor: new Sprite('./images/default_cursor.png'),
	defeat: new Sprite('./images/defeat.png'),
	game_border: new Sprite('./images/game_border.png'),
	flag_cursor: new Sprite('./images/flag_cursor.png'),
	icon_clock: new Sprite('./images/icon_clock.png'),
	icon_damage: new Sprite('./images/icon_damage.png'),
	icon_gold: new Sprite('./images/icon_gold.png'),
	icon_heart: new Sprite('./images/icon_heart.png'),
	icon_shield: new Sprite('./images/icon_shield.png'),
	icon_weight: new Sprite('./images/icon_weight.png'),
	icon_worm: new Sprite('./images/icon_worm.png'),
	picaxe_cursor: new Sprite('./images/picaxe_cursor.png'),
	numbers: new Sprite('./images/numbers.png'),
	numbers_blue: new Sprite('./images/numbers_blue.png'),
	numbers_green: new Sprite('./images/numbers_green.png'),
	numbers_gold: new Sprite('./images/numbers_gold.png'),
	numbers_purple: new Sprite('./images/numbers_purple.png'),
	numbers_red: new Sprite('./images/numbers_red.png'),
	numbers_yellow: new Sprite('./images/numbers_yellow.png'),
	minus_red: new Sprite('./images/minus_red.png'),
	
	//shop
	picaxe: new Sprite('./images/picaxe.png'),
	dagger: new Sprite('./images/dagger.png'),
	dagger_selected: new Sprite('./images/dagger_selected.png'),
	detonator: new Sprite('./images/detonator.png'),
	detonator_selected: new Sprite('./images/detonator_selected.png'),
	drill: new Sprite('./images/drill.png'),
	drill_selected: new Sprite('./images/drill_selected.png'),
	flag: new Sprite('./images/flag.png'),
	flag_selected: new Sprite('./images/flag_selected.png'),
	numbers_shop_cost: new Sprite('./images/numbers_shop_cost.png'),
	shop_bg: new Sprite('./images/shop_bg.png'),
	shop_buy_button: new Sprite('./images/shop_buy_button.png'),
	shop_buy_button_poor: new Sprite('./images/shop_buy_button_poor.png'),
	shop_description_dagger: new Sprite('./images/shop_description_dagger.png'),
	shop_description_detonator: new Sprite('./images/shop_description_detonator.png'),
	shop_description_drill: new Sprite('./images/shop_description_drill.png'),
	shop_description_flag: new Sprite('./images/shop_description_flag.png'),
	wooden_sword: new Sprite('./images/wooden_sword.png'),
	wooden_sword_selected: new Sprite('./images/wooden_sword_selected.png'),
	wooden_shield: new Sprite('./images/wooden_shield.png'),
	wooden_shield_selected: new Sprite('./images/wooden_shield_selected.png'),
	
	//battle
	battle_bg: new Sprite('./images/battle_bg.png'),
	enemy_shadow: new Sprite('./images/enemy_shadow.png'),
	player_shadow: new Sprite('./images/player_shadow.png'),
	tired_overlay: new Sprite('./images/tired_overlay.png'),
	worm_enemy: new Sprite('./images/worm_enemy.png'),

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
