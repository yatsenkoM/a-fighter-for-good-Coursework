class Sounds {
    constructor() {
        this.muted = false;
    }
    init() {
        this.soundsSource = ["sounds/shot.mp3", "sounds/enemyDeath.mp3", "sounds/wound.mp3"];
        this.allSounds = [];

        for (let i = 0; i < this.soundsSource.length; i++) {
            this.allSounds[i] = new Audio();
            this.allSounds[i].src = this.soundsSource[i];
            this.allSounds[i].setAttribute("preload", "auto");
        }
    }
    playSound(soundName) {
        if (this.muted === true) {
            return;
        }

        let soundNumber;
        switch (soundName) {
            case 'shot':
                soundNumber = 0;
                break;
            case 'enemyDeath':
                soundNumber = 1;
                break;
            case 'wound':
                soundNumber = 2;
                break;
            default:
                break;
        }
        this.allSounds[soundNumber].play();
        this.allSounds[soundNumber].currentTime = 0;
    }
    muteSwitch() {
        if (this.muted === false) {
            this.muted = true;
        } else if (this.muted === true) {
            this.muted = false;
        }
    }
}
