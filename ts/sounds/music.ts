export class MusicTrack {
  audioCtx = new AudioContext();
  buffer!: AudioBuffer;
  src: string;
  gainNode = this.audioCtx.createGain();

  constructor(trackName: string, volume: number) {
    this.src = `../../sounds/${trackName}.mp3`;
    this.gainNode.gain.value = volume;
    this.gainNode.connect(this.audioCtx.destination);
  }

  async load() {
    const res = await fetch(this.src);
    const arrayBuffer = await res.arrayBuffer();
    this.buffer = await this.audioCtx.decodeAudioData(arrayBuffer);
  }
}

export const musicTracks = {
  music: new MusicTrack("music", 0.3),
};

// Makes a list of all sounds and awaits their loading
const trackArr: MusicTrack[] = [...Object.values(musicTracks)];
const promiseArrays = trackArr.map((track) => track.load());
await Promise.all(promiseArrays);
