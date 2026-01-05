import { utils } from "./utils.js";
export class Sound {
    srcList = [];
    audioList = [];
    volumeMult;
    constructor(soundName, volumeMult, altCount = 1) {
        if (altCount == 1) {
            this.srcList.push("./sounds/" + soundName + ".mp3");
        }
        else {
            for (let i = 0; i < altCount; i++) {
                this.srcList.push("./sounds/" + soundName + "-" + i + ".mp3");
            }
        }
        this.volumeMult = volumeMult ?? 1;
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
    bell: new Sound("bell", 0.3),
    clear: new Sound("clear", 0.5),
    beep: new Sound("beep", 0.5),
    bomb: new Sound("bomb", 0.8),
    door: new Sound("door", 0.7, 3),
    steps: new Sound("steps", 0.7),
    detonate: new Sound("detonate", 0.2),
};
const soundArr = Object.values(sounds);
const promiseArrays = soundArr.map((sound) => sound.load());
promiseArrays.forEach(async (arr) => {
    await Promise.all(arr);
});
export default sounds;
