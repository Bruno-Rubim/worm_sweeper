export class MusicTrack {
  audioCtx = new AudioContext();
  buffer!: AudioBuffer;
  src: string;
  isPlaying = false;
  gainNode = this.audioCtx.createGain();

  constructor(trackName: string) {
    this.src = `./sounds/${trackName}.mp3`;
    this.gainNode.gain.value = 1;
    this.gainNode.connect(this.audioCtx.destination);
  }

  async load() {
    const res = await fetch(this.src);
    const arrayBuffer = await res.arrayBuffer();
    this.buffer = await this.audioCtx.decodeAudioData(arrayBuffer);
  }
}

export const musicTracks = {
  music: new MusicTrack("music"),
};

// Makes a list of all sounds and awaits their loading
const trackArr: MusicTrack[] = [...Object.values(musicTracks)];
const promiseArrays = trackArr.map((track) => track.load());
await Promise.all(promiseArrays);
