export class Sound {
  src: string;
  audio: HTMLAudioElement;
  volumeMult: number;

  constructor(soundName: string, volumeMult?: number) {
    this.src = "./sounds/" + soundName + ".mp3";
    this.audio = new Audio();
    this.volumeMult = volumeMult ?? 1;
  }

  load() {
    const { src, audio } = this;
    return new Promise<HTMLAudioElement>((resolve, reject) => {
      audio.addEventListener("canplaythrough", () => resolve(audio), {
        once: true,
      });
      audio.addEventListener("error", () => reject(audio.error), {
        once: true,
      });

      audio.src = src;
      audio.load();
    });
  }
}

export const sounds = {
  bell: new Sound("bell", 0.1),
};

const soundArr = Object.values(sounds);
const promises = soundArr.map((sound) => sound.load());
await Promise.all(promises);

export default sounds;
