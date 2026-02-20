class SensorySystem {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.hapticsEnabled = true;
  }

  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playTone(freq, type, duration, vol = 0.1) {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioCtx.currentTime + duration,
      );

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  vibrate(pattern) {
    if (!this.hapticsEnabled || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }

  // Base Methods
  playSuccess() {
    this.playTone(440, "sine", 0.15, 0.1);
    setTimeout(() => this.playTone(659.25, "sine", 0.4, 0.1), 100);
    this.vibrate([50, 50, 50]);
  }

  playError() {
    this.playTone(150, "sawtooth", 0.3, 0.15);
    this.vibrate([200, 100, 200]);
  }

  playKeystroke() {
    this.playTone(800, "square", 0.02, 0.01);
  }

  // Aliases for ToastContext
  triggerSuccess() {
    this.playSuccess();
  }
  triggerError() {
    this.playError();
  }
  triggerAlert() {
    this.playTone(600, "sine", 0.1, 0.05);
    this.vibrate([30]);
  }
}

export const SensoryEngine = new SensorySystem();
