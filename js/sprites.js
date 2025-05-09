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
	clock_icon: new Sprite('./images/clock_icon.png'),
	detonator_cursor: new Sprite('./images/detonator_cursor.png'),
	default_cursor: new Sprite('./images/default_cursor.png'),
	flag_cursor: new Sprite('./images/flag_cursor.png'),
	game_border: new Sprite('./images/game_border.png'),
	picaxe: new Sprite('./images/picaxe.png'),
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
	shop_description_flag: new Sprite('./images/shop_description_flag.png'),
	shop_description_detonator: new Sprite('./images/shop_description_detonator.png'),
	shop_description_drill: new Sprite('./images/shop_description_drill.png'),

	//blocks
	dirt_block_unknown: new Sprite('./images/dirt_block_unknown.png'),
	dirt_block_hidden: new Sprite('./images/dirt_block_hidden.png'),
	empty: new Sprite('./images/empty_block.png'),
	exit_door: new Sprite('./images/exit_door.png'),
	exit_door_open: new Sprite('./images/exit_door_open.png'),
	ground_numbers: new Sprite('./images/ground_numbers.png'),
	gold_ore: new Sprite('./images/gold_ore.png'),
	gold_icon: new Sprite('./images/gold_icon.png'),
	marker_threat: new Sprite('./images/marker_threat.png'),
	marker_unsure: new Sprite('./images/marker_unsure.png'),
	marker_wrong: new Sprite('./images/marker_wrong.png'),
	shop_door: new Sprite('./images/shop_door.png'),
	threat: new Sprite('./images/threat.png'),
	worm: new Sprite('./images/worm.png'),
	worm_icon: new Sprite('./images/worm_icon.png'),
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
