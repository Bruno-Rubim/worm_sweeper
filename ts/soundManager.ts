import type { Sound } from "./sounds.js";

export class SoundManager {
  generalVolume = 1;
  musicVolume = 1;
  sfxVolume = 1;
  playSound(sound: Sound) {
    const cloneAudio = sound.audio.cloneNode(true) as HTMLAudioElement;
    cloneAudio.currentTime = 0;
    cloneAudio.volume = this.generalVolume * this.sfxVolume * sound.volumeMult;
    cloneAudio.play();
  }
}
