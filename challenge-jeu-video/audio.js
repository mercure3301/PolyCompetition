class MusicManager {
    constructor(trackList, options = {}) {
        this.tracks = trackList;
        this.fadeDuration = options.fadeDuration || 2000;
        this.audio = null;
        this.currentIndex = -1;
        this.isTransitioning = false;
    }

    start() {
        if (!this.tracks.length) {
            return;
        }

        if (this.audio && !this.audio.paused) {
            return;
        }

        if (this.audio && this.audio.paused) {
            this.audio.play().catch(() => {});
            return;
        }

        this.playTrack(0);
    }

    resetAndStart() {
        this.stop();
        this.playTrack(0);
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        this.currentIndex = -1;
        this.isTransitioning = false;
    }

    playTrack(index) {
        if (!this.tracks.length) return;

        this.currentIndex = index % this.tracks.length;
        if (this.audio) {
            this.audio.pause();
        }

        const source = this.tracks[this.currentIndex];
        this.audio = new Audio(source);
        this.audio.loop = true;
        this.audio.volume = 0.5;
        this.audio.play().catch(() => {});
    }

    transitionToNextTrack() {
        if (!this.tracks.length) return;
        if (this.isTransitioning) return;

        const nextIndex = (this.currentIndex + 1) % this.tracks.length;

        if (!this.audio) {
            this.playTrack(nextIndex);
            return;
        }

        const nextAudio = new Audio(this.tracks[nextIndex]);
        nextAudio.loop = true;
        nextAudio.volume = 0;

        const startCrossFade = () => {
            this.isTransitioning = true;
            const fadeDuration = this.fadeDuration;
            const stepMs = 50;
            const totalSteps = Math.ceil(fadeDuration / stepMs);
            let currentStep = 0;

            const interval = setInterval(() => {
                currentStep++;
                const progress = Math.min(1, currentStep / totalSteps);

                if (this.audio) {
                    this.audio.volume = 1 - progress;
                }
                nextAudio.volume = progress;

                if (progress >= 1) {
                    clearInterval(interval);
                    if (this.audio) {
                        this.audio.pause();
                    }
                    this.audio = nextAudio;
                    this.currentIndex = nextIndex;
                    this.isTransitioning = false;
                }
            }, stepMs);
        };

        nextAudio.play().then(startCrossFade).catch(() => {
            this.isTransitioning = false;
        });
    }
}

const musicManager = new MusicManager([
    'musique/Widow.mp3',
    'musique/Lace.mp3',
    'musique/Phantom.mp3',
    'musique/Strive.mp3',
    'musique/Cogwork Dancers.mp3',

], {
    fadeDuration: 2500
});

