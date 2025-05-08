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
	flag: new Sprite('./images/flag.png'),
	flag_selected: new Sprite('./images/flag_selected.png'),
	game_border: new Sprite('./images/game_border.png'),
	picaxe: new Sprite('./images/picaxe.png'),
	picaxe_selected: new Sprite('./images/picaxe_selected.png'),
	numbers: new Sprite('./images/numbers.png'),
	numbers_purple: new Sprite('./images/numbers_purple.png'),
	numbers_red: new Sprite('./images/numbers_red.png'),
	minus_red: new Sprite('./images/minus_red.png'),
	
	//blocks
	dirt_block_unknown: new Sprite('./images/dirt_block_unknown.png'),
	dirt_block_hidden: new Sprite('./images/dirt_block_hidden.png'),
	dirt_block_gold: new Sprite('./images/dirt_block_gold.png'),
	exit_door: new Sprite('./images/exit_door.png'),
	threat: new Sprite('./images/threat.png'),
	empty: new Sprite('./images/empty_block.png'),
	ground_numbers: new Sprite('./images/ground_numbers.png'),
	gold: new Sprite('./images/gold.png'),
	marker_threat: new Sprite('./images/marker_threat.png'),
	marker_unsure: new Sprite('./images/marker_unsure.png'),
	marker_wrong: new Sprite('./images/marker_wrong.png'),
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
