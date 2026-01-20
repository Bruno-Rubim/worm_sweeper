import { utils } from "./utils.js";
export class SoundManager {
    generalVolume = 1;
    musicVolume = 1;
    sfxVolume = 1;
    mute = 1;
    activeSounds = [];
    playSound(sound) {
        const cloneAudio = sound.audio.cloneNode(true);
        cloneAudio.currentTime = 0;
        cloneAudio.volume =
            this.generalVolume * this.sfxVolume * sound.volumeMult * this.mute;
        cloneAudio.preservesPitch = false;
        if (Array.isArray(sound.pitch)) {
            cloneAudio.playbackRate = sound.pitch[utils.randomArrayId(sound.pitch)];
        }
        else {
            cloneAudio.playbackRate =
                sound.pitch.min + Math.random() * (sound.pitch.max - sound.pitch.min);
        }
        cloneAudio.play();
        this.clean();
        this.activeSounds.push(cloneAudio);
    }
    clean() {
        this.activeSounds = this.activeSounds.filter((sound) => !(sound.paused && sound.currentTime > 0));
    }
    pause() {
        this.clean();
        for (const i in this.activeSounds) {
            this.activeSounds[i].pause();
        }
    }
    playMusic(sound) {
        const cloneAudio = sound.audio.cloneNode(true);
        cloneAudio.currentTime = 0;
        cloneAudio.loop = true;
        cloneAudio.volume =
            this.generalVolume * this.sfxVolume * sound.volumeMult * this.mute;
        cloneAudio.play();
    }
}
export const soundManager = new SoundManager();
