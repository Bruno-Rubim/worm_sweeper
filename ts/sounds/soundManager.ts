import { type Sound } from "./sounds.js";
import { utils } from "../utils.js";
import { MusicTrack } from "./music.js";

// Plays sounds
export class SoundManager {
  generalVolume = 1;
  musicVolume = 0.7;
  sfxVolume = 1;
  muted = false;
  mutedMusic = localStorage.getItem("mutedMusic") == "true";
  mutedSfx = localStorage.getItem("mutedSfx") == "true";
  activeSounds: HTMLAudioElement[] = [];
  currentMusicTrack: MusicTrack | null = null;
  musicStartTime = 0;
  musicPauseOffset = 0;
  musicSource: AudioBufferSourceNode | null = null;

  // Play a given sound's audio element
  playSound(sound: Sound) {
    const cloneAudio = sound.audio.cloneNode(true) as HTMLAudioElement;
    cloneAudio.currentTime = 0;
    // Volume
    cloneAudio.volume =
      this.generalVolume *
      this.sfxVolume *
      (this.muted ? 0 : 1) *
      (this.mutedSfx ? 0 : 1);
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

  playMusic(track: MusicTrack) {
    if (track.isPlaying) {
      return;
    }
    track.isPlaying = true;

    const source = track.audioCtx.createBufferSource();
    track.gainNode.gain.value =
      this.generalVolume *
      this.musicVolume *
      (this.muted ? 0 : 1) *
      (this.mutedMusic ? 0 : 1);
    source.buffer = track.buffer;
    source.loop = true;
    source.connect(track.gainNode);
    this.musicStartTime = track.audioCtx.currentTime - this.musicPauseOffset;
    source.start(track.audioCtx.currentTime, this.musicPauseOffset);
    this.currentMusicTrack = track;
    this.musicSource = source;
  }

  pauseMusic() {
    if (!this.musicSource || !this.currentMusicTrack) {
      if (this.currentMusicTrack) {
        if (!this.currentMusicTrack.isPlaying) {
          this.playMusic(this.currentMusicTrack);
          return;
        }
      }
      return;
    }

    this.musicPauseOffset =
      this.currentMusicTrack.audioCtx.currentTime - this.musicStartTime;
    this.musicPauseOffset %= this.musicSource.buffer!.duration; // important for loops

    this.musicSource.stop();
    this.musicSource.disconnect();
    this.musicSource = null;

    this.currentMusicTrack.isPlaying = false;
  }

  updateVolumes() {
    if (this.currentMusicTrack) {
      this.currentMusicTrack.gainNode.gain.value =
        this.generalVolume *
        this.musicVolume *
        (this.muted ? 0 : 1) *
        (this.mutedMusic ? 0 : 1);
    }
  }

  soundUp() {
    this.generalVolume += 0.1;
    this.updateVolumes();
  }

  muteMusic() {
    this.mutedMusic = !this.mutedMusic;
    localStorage.setItem("mutedMusic", this.mutedMusic.toString());
    this.updateVolumes();
  }

  muteSfx() {
    this.mutedSfx = !this.mutedSfx;
    localStorage.setItem("mutedSfx", this.mutedSfx.toString());
    this.updateVolumes();
  }
}
export const soundManager = new SoundManager();
