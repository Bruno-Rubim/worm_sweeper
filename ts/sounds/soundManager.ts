import { type Sound } from "./sounds.js";
import { utils } from "../utils.js";
import { musicTracks } from "./music.js";

// Plays sounds
export class SoundManager {
  generalVolume = 1;
  musicVolume = 1;
  sfxVolume = 1;
  mute = 1;
  activeSounds: HTMLAudioElement[] = [];

  // Play a given sound's audio element
  playSound(sound: Sound) {
    const cloneAudio = sound.audio.cloneNode(true) as HTMLAudioElement;
    cloneAudio.currentTime = 0;
    // Volume
    cloneAudio.volume =
      this.generalVolume * this.sfxVolume * sound.volumeMult * this.mute;
    // Pitch
    cloneAudio.preservesPitch = false;
    if (Array.isArray(sound.pitch)) {
      cloneAudio.playbackRate = sound.pitch[utils.randomArrayId(sound.pitch)]!;
    } else {
      cloneAudio.playbackRate =
        sound.pitch.min + Math.random() * (sound.pitch.max - sound.pitch.min);
    }
    // Play
    cloneAudio.play();
    // Add to actively playing sounds
    this.clean();
    this.activeSounds.push(cloneAudio);
  }

  // Delete finished sounds from the active sounds
  clean() {
    this.activeSounds = this.activeSounds.filter(
      (sound) => !(sound.paused && sound.currentTime > 0),
    );
  }

  pause() {
    this.clean();
    for (const i in this.activeSounds) {
      this.activeSounds[i]!.pause();
    }
  }

  playMusic() {
    const source = musicTracks.music.audioCtx.createBufferSource();
    source.buffer = musicTracks.music.buffer;
    source.loop = true;
    source.connect(musicTracks.music.gainNode);
    source.start(musicTracks.music.audioCtx.currentTime);
  }
}
export const soundManager = new SoundManager();
