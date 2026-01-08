import { utils } from "./utils.js";
export class Sound {
    srcList = [];
    audioList = [];
    volumeMult;
    pitch;
    constructor(args) {
        args.fixedPitches ??= [1];
        if (args.altCount == undefined) {
            this.srcList.push("./sounds/" + args.soundName + ".mp3");
        }
        else {
            for (let i = 0; i < (args.altCount ?? 1); i++) {
                this.srcList.push("./sounds/" + args.soundName + "-" + i + ".mp3");
            }
        }
        this.volumeMult = args.volumeMult ?? 1;
        if (args.pitchRange) {
            this.pitch = {
                min: args.pitchRange.min,
                max: args.pitchRange.max,
            };
        }
        else {
            this.pitch = [...args.fixedPitches];
        }
    }
    get audio() {
        return this.audioList[utils.randomArrayId(this.audioList)];
    }
    load() {
        const { srcList, audioList } = this;
        let promises = [];
        this.srcList.forEach((src) => {
            const audio = new Audio();
            this.audioList.push(audio);
            promises.push(new Promise((resolve, reject) => {
                audio.addEventListener("canplaythrough", () => resolve(audio), {
                    once: true,
                });
                audio.addEventListener("error", () => {
                    console.warn(src);
                    reject(audio.error);
                }, {
                    once: true,
                });
                audio.src = src;
                audio.load();
            }));
        });
        return promises;
    }
}
export const sounds = {
    bell: new Sound({
        soundName: "bell",
        volumeMult: 0.3,
        pitchRange: {
            min: 0.9,
            max: 1.1,
        },
    }),
    break: new Sound({
        soundName: "break",
        volumeMult: 0.4,
        pitchRange: {
            min: 0.9,
            max: 1.3,
        },
    }),
    clear: new Sound({
        soundName: "clear",
        volumeMult: 0.4,
    }),
    beep: new Sound({
        soundName: "beep",
        volumeMult: 0.5,
        pitchRange: {
            min: 0.9,
            max: 1.1,
        },
    }),
    bomb: new Sound({
        soundName: "bomb",
        volumeMult: 0.8,
        pitchRange: {
            min: 0.9,
            max: 1.1,
        },
    }),
    door: new Sound({
        soundName: "door",
        volumeMult: 0.7,
        pitchRange: {
            min: 0.9,
            max: 1.3,
        },
    }),
    steps: new Sound({ soundName: "steps", volumeMult: 0.7 }),
    detonate: new Sound({
        soundName: "detonate",
        volumeMult: 0.2,
        pitchRange: {
            min: 0.9,
            max: 1.1,
        },
    }),
    drill: new Sound({
        soundName: "drill",
        volumeMult: 0.15,
        pitchRange: {
            min: 0.9,
            max: 1.5,
        },
    }),
    gold: new Sound({
        soundName: "gold",
        volumeMult: 0.2,
        pitchRange: {
            min: 1.1,
            max: 1.5,
        },
    }),
};
export const music = {
    drums: new Sound({ soundName: "drums", volumeMult: 0.3 }),
};
const soundArr = [...Object.values(sounds), ...Object.values(music)];
const promiseArrays = soundArr.map((sound) => sound.load());
promiseArrays.forEach(async (arr) => {
    await Promise.all(arr);
});
export default sounds;
