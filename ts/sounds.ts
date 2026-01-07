import { utils } from "./utils.js";

// Represents sounds in game
export class Sound {
  srcList: string[] = [];
  audioList: HTMLAudioElement[] = [];
  volumeMult: number;
  minPitch: number;
  maxPitch: number;

  constructor(args: {
    soundName: string;
    volumeMult?: number;
    altCount?: number;
    minPitch?: number;
    maxPitch?: number;
  }) {
    if (args.altCount == undefined) {
      this.srcList.push("./sounds/" + args.soundName + ".mp3");
    } else {
      // If there are alternate versions, saves all alternate versions to the source list
      for (let i = 0; i < (args.altCount ?? 1); i++) {
        this.srcList.push("./sounds/" + args.soundName + "-" + i + ".mp3");
      }
    }
    this.volumeMult = args.volumeMult ?? 1;
    this.minPitch = args.minPitch ?? 1;
    this.maxPitch = args.maxPitch ?? args.minPitch ?? 1;
  }

  /**
   * A random audio element from the audio list
   */
  get audio() {
    return this.audioList[utils.randomArrayId(this.audioList)]!;
  }

  /**
   * Loads all audio elments from the audio list
   * @returns
   */
  load() {
    const { srcList, audioList } = this;
    let promises: Promise<HTMLAudioElement>[] = [];
    this.srcList.forEach((src) => {
      const audio = new Audio();
      this.audioList.push(audio);
      promises.push(
        new Promise<HTMLAudioElement>((resolve, reject) => {
          audio.addEventListener("canplaythrough", () => resolve(audio), {
            once: true,
          });
          audio.addEventListener(
            "error",
            () => {
              console.warn(src);
              reject(audio.error);
            },
            {
              once: true,
            }
          );

          audio.src = src;
          audio.load();
        })
      );
    });
    return promises;
  }
}

// List of sounds from the game
export const sounds = {
  bell: new Sound({
    soundName: "bell",
    volumeMult: 0.3,
    minPitch: 0.9,
    maxPitch: 1.1,
  }),
  clear: new Sound({
    soundName: "clear",
    volumeMult: 0.4,
    minPitch: 1,
  }),
  beep: new Sound({
    soundName: "beep",
    volumeMult: 0.5,
    minPitch: 0.9,
    maxPitch: 1.1,
  }),
  bomb: new Sound({
    soundName: "bomb",
    volumeMult: 0.8,
    minPitch: 0.9,
    maxPitch: 1.1,
  }),
  door: new Sound({
    soundName: "door",
    volumeMult: 0.7,
    minPitch: 0.9,
    maxPitch: 1.3,
    altCount: 1,
  }),
  steps: new Sound({ soundName: "steps", volumeMult: 0.7 }),
  detonate: new Sound({
    soundName: "detonate",
    volumeMult: 0.2,
    minPitch: 0.9,
    maxPitch: 1.1,
  }),
  drill: new Sound({
    soundName: "drill",
    volumeMult: 0.15,
    minPitch: 0.9,
    maxPitch: 1.1,
  }),
};

export const music = {
  drums: new Sound({ soundName: "drums", volumeMult: 0.3 }),
};

// Makes a list of all sounds and awaits their loading
const soundArr = [...Object.values(sounds), ...Object.values(music)];
const promiseArrays = soundArr.map((sound) => sound.load());
promiseArrays.forEach(async (arr) => {
  await Promise.all(arr);
});

export default sounds;
