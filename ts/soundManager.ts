import type { Sound } from "./sounds.js";

// Plays sounds
export class SoundManager {
  generalVolume = 1;
  musicVolume = 1;
  sfxVolume = 1;
  mute = 1;
  activeSounds = [];

  // Play a given sound's audio element
  playSound(sound: Sound) {
    const cloneAudio = sound.audio.cloneNode(true) as HTMLAudioElement;
    cloneAudio.currentTime = 0;
    // Volume
    cloneAudio.volume =
      this.generalVolume * this.sfxVolume * sound.volumeMult * this.mute;
    // Pitch
    cloneAudio.preservesPitch = false;
    cloneAudio.mozPreservesPitch = false;
    cloneAudio.webkitPreservesPitch = false;
    cloneAudio.playbackRate = sound.minPitch + (Math.random() * (sound.maxPitch - sound.minPitch));
    // Play
    cloneAudio.play();
    // Add to actively playing sounds
    this.clean();
    this.activeSounds.push(cloneAudio);
  }

  // Delete finished sounds from the active sounds
  clean() {
    this.activeSounds = this.activeSounds.filter(
      sound => !(sound.paused && sound.currentTime > 0)
    );
  }

  pause() {
    this.clean();
    for (const i in this.activeSounds) {
      this.activeSounds[i].pause();
    }
  }

  play() {
    for (const i in this.activeSounds) {
      this.activeSounds[i].play();
    }
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
