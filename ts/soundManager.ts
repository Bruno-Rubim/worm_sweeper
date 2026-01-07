import type { Sound } from "./sounds.js";

// Plays sounds
export class SoundManager {
  generalVolume = 1;
  musicVolume = 1;
  sfxVolume = 1;
  mute = 1;

  // Play a given sound's audio element
  playSound(sound: Sound) {
    const cloneAudio = sound.audio.cloneNode(true) as HTMLAudioElement;
    cloneAudio.currentTime = 0;
    cloneAudio.volume =
      this.generalVolume * this.sfxVolume * sound.volumeMult * this.mute;
    cloneAudio.play();
  }

  playMusic(sound: Sound) {
    const cloneAudio = sound.audio.cloneNode(true) as HTMLAudioElement;
    cloneAudio.currentTime = 0;
    cloneAudio.loop = true;
    cloneAudio.volume =
      this.generalVolume * this.sfxVolume * sound.volumeMult * this.mute;
    cloneAudio.play();
  }
}
