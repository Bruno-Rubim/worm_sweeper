export class SoundManager {
    generalVolume = 1;
    musicVolume = 1;
    sfxVolume = 1;
    mute = 1;
    playSound(sound) {
        const cloneAudio = sound.audio.cloneNode(true);
        cloneAudio.currentTime = 0;
        cloneAudio.volume =
            this.generalVolume * this.sfxVolume * sound.volumeMult * this.mute;
        cloneAudio.play();
    }
}
