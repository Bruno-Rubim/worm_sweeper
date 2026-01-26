import { utils } from "../utils.js";

export type fixedPitches = number[];
export type pitchRange = {
  min: number;
  max: number;
};

// Represents sounds in game
export class Sound {
  srcList: string[] = [];
  audioList: HTMLAudioElement[] = [];
  pitch: fixedPitches | pitchRange;

  constructor(args: {
    soundName: string;
    altCount?: number;
    pitchRange?: pitchRange;
    fixedPitches?: fixedPitches;
  }) {
    args.fixedPitches ??= [1];
    if (args.altCount == undefined) {
      this.srcList.push("./sounds/" + args.soundName + ".mp3");
    } else {
      // If there are alternate versions, saves all alternate versions to the source list
      for (let i = 0; i < (args.altCount ?? 1); i++) {
        this.srcList.push("./sounds/" + args.soundName + "-" + i + ".mp3");
      }
    }
    if (args.pitchRange) {
      this.pitch = {
        min: args.pitchRange.min,
        max: args.pitchRange.max,
      };
    } else {
      this.pitch = [...args.fixedPitches];
    }
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
            },
          );

          audio.src = src;
          audio.load();
        }),
      );
    });
    return promises;
  }
}

// List of sounds from the game
export const sounds = {
  bell: new Sound({
    soundName: "bell",
    pitchRange: {
      min: 0.9,
      max: 1.1,
    },
  }),
  break: new Sound({
    soundName: "break",
    pitchRange: {
      min: 0.9,
      max: 1.3,
    },
  }),
  clear: new Sound({
    soundName: "clear",
  }),
  beep: new Sound({
    soundName: "beep",
    pitchRange: {
      min: 0.9,
      max: 1.1,
    },
  }),
  bomb_fuse: new Sound({
    soundName: "bomb_fuse",
    pitchRange: {
      min: 0.9,
      max: 1.1,
    },
  }),
  explosion: new Sound({
    soundName: "explosion",
    pitchRange: {
      min: 0.9,
      max: 1.1,
    },
  }),
  door: new Sound({
    soundName: "door",
    pitchRange: {
      min: 0.9,
      max: 1.3,
    },
  }),
  steps: new Sound({ soundName: "steps" }),
  detonate: new Sound({
    soundName: "detonate",
    pitchRange: {
      min: 0.9,
      max: 1.1,
    },
  }),
  drill: new Sound({
    soundName: "drill",
    pitchRange: {
      min: 0.9,
      max: 1.5,
    },
  }),
  gold: new Sound({
    soundName: "gold",
    pitchRange: {
      min: 1.1,
      max: 1.5,
    },
  }),
  wrong: new Sound({
    soundName: "wrong",
  }),
  purchase: new Sound({
    soundName: "purchase",
    fixedPitches: [1],
  }),
  drink: new Sound({
    soundName: "drink",
    fixedPitches: [1],
  }),
  stab: new Sound({
    soundName: "stab",
    pitchRange: {
      min: 0.9,
      max: 1.3,
    },
  }),
  bite: new Sound({
    soundName: "bite",
    pitchRange: {
      min: 0.8,
      max: 1.4,
    },
  }),
  bag_open: new Sound({
    soundName: "bag_open",
    pitchRange: {
      min: 1,
      max: 1.1,
    },
  }),
  bag_close: new Sound({
    soundName: "bag_close",
    pitchRange: {
      min: 1,
      max: 1.1,
    },
  }),
  curse: new Sound({ soundName: "curse" }),
};

// Makes a list of all sounds and awaits their loading
const soundArr = [...Object.values(sounds)];
const promiseArrays = soundArr.map((sound) => sound.load());
promiseArrays.forEach(async (arr) => {
  await Promise.all(arr);
});

export default sounds;
