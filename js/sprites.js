export class Sprite {
    src;
    img;
    constructor(imageName) {
        if (Math.floor(Math.random() * 1000000) == 1) {
            imageName = "9s";
        }
        this.src = "./images/" + imageName + ".png";
        this.img = new Image();
    }
    load() {
        const { src, img } = this;
        return new Promise((done, fail) => {
            img.onload = () => done(img);
            img.onerror = fail;
            img.src = src;
        });
    }
}
export const sprites = {
    "9s": new Sprite("9s"),
    battle_bar: new Sprite("battle_bar"),
    bell_shine_sheet: new Sprite("bell_shine_sheet"),
    bg_battle: new Sprite("bg_battle"),
    bg_game: new Sprite("bg_game"),
    bg_shop: new Sprite("bg_shop"),
    bg_rules: new Sprite("bg_rules"),
    big_shield_claw: new Sprite("big_shield_claw"),
    big_shield_hand: new Sprite("big_shield_hand"),
    big_shield_jade: new Sprite("big_shield_jade"),
    big_shield_steel: new Sprite("big_shield_steel"),
    big_shield_wood: new Sprite("big_shield_wood"),
    big_sword_big: new Sprite("big_sword_big"),
    big_sword_dagger: new Sprite("big_sword_dagger"),
    big_sword_wood: new Sprite("big_sword_wood"),
    big_sword_cactus: new Sprite("big_sword_cactus"),
    big_time_blade: new Sprite("big_time_blade"),
    block_sheet: new Sprite("block_sheet"),
    bomb_sheet: new Sprite("bomb_sheet"),
    button_exit: new Sprite("button_exit"),
    button_reset: new Sprite("button_reset"),
    chisel_sheet: new Sprite("chisel_sheet"),
    counter_sheet: new Sprite("counter_sheet"),
    cursor_sheet: new Sprite("cursor_sheet"),
    description_box: new Sprite("description_box"),
    description_box_sheet: new Sprite("description_box_sheet"),
    enemy_worm: new Sprite("enemy_worm"),
    enemy_scale_worm: new Sprite("enemy_scale_worm"),
    enemy_poison_worm: new Sprite("enemy_poison_worm"),
    game_border: new Sprite("game_border"),
    icon_sheet: new Sprite("icon_sheet"),
    item_sheet: new Sprite("item_sheet"),
    item_potion_time_pointer_hour: new Sprite("item_potion_time_pointer_hour"),
    item_potion_time_pointer_minute: new Sprite("item_potion_time_pointer_minute"),
    letters_book: new Sprite("letters_book"),
    letters_shop_description: new Sprite("letters_shop_description"),
    letters_description: new Sprite("letters_description"),
    number_sheet: new Sprite("number_sheet"),
    numbers: new Sprite("numbers"),
    pixel_black: new Sprite("pixel_black"),
    time_potion_pointer_sheet: new Sprite("time_potion_pointer_sheet"),
    screen_defeat: new Sprite("screen_defeat"),
    screen_paused: new Sprite("screen_paused"),
    stun_sprite_sheet: new Sprite("stun_sprite_sheet"),
    transparent_pixel: new Sprite("transparent_pixel"),
    worm_remains: new Sprite("worm_remains"),
    worm: new Sprite("worm"),
    scene_transition: new Sprite("scene_transition"),
};
const spriteArr = Object.values(sprites);
const promises = spriteArr.map((sprite) => sprite.load());
await Promise.all(promises);
