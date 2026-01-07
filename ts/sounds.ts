import { utils } from "./utils.js";

// Represents sounds in game
export class Sound {
  srcList: string[] = [];
  audioList: HTMLAudioElement[] = [];
  volumeMult: number;
  minPitch: number;
  maxPitch: number;

  constructor(
    soundName: string,
    volumeMult?: number,
    altCount: number = 1,
    minPitch: number = 1,
    maxPitch?: number
  ) {
    if (altCount == 1) {
      this.srcList.push("./sounds/" + soundName + ".mp3");
    } else {
      // If there are alternate versions, saves all alternate versions to the source list
      for (let i = 0; i < altCount; i++) {
        this.srcList.push("./sounds/" + soundName + "-" + i + ".mp3");
      }
    }
    this.volumeMult = volumeMult ?? 1;
    this.minPitch = minPitch;
    this.maxPitch = maxPitch ?? minPitch;
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
  bell: new Sound("bell", 0.3, 1, 0.9, 1.1),
  clear: new Sound("clear", 0.5, 1, 0.9, 1.1),
  beep: new Sound("beep", 0.5, 1, 0.9, 1.1),
  bomb: new Sound("bomb", 0.8, 1, 0.9, 1.1),
  door: new Sound("door", 0.7, 3, 0.9, 1.1),
  steps: new Sound("steps", 0.7, 1),
  detonate: new Sound("detonate", 0.2, 1, 0.9, 1.1),
  drill: new Sound("drill", 0.15, 1, 0.9, 1.1),
};

export const music = {
  drums: new Sound("drums", 0.3),
};

// Makes a list of all sounds and awaits their loading
const soundArr = [...Object.values(sounds), ...Object.values(music)];
const promiseArrays = soundArr.map((sound) => sound.load());
promiseArrays.forEach(async (arr) => {
  await Promise.all(arr);
});

export default sounds;
