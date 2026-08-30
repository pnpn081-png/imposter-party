// Synthesized Web Audio API sound effects for realistic tactile Android experience

class SoundEngine {
  private ctx: AudioContext | null = null;
  private holdOsc: OscillatorNode | null = null;
  private holdGain: GainNode | null = null;
  private isEnabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem('imposter_sound_enabled');
    if (saved !== null) {
      this.isEnabled = saved === 'true';
    }
  }

  public toggleSound(): boolean {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('imposter_sound_enabled', String(this.isEnabled));
    if (!this.isEnabled) {
      this.stopHold();
    }
    return this.isEnabled;
  }

  public getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('imposter_sound_enabled', String(enabled));
    if (!this.isEnabled) {
      this.stopHold();
    }
  }

  public vibrate(pattern: number | number[] = [40, 30, 40]) {
    if (!this.isEnabled) return;
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTap() {
    if (!this.isEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio might be blocked before user gesture
    }
  }

  startHold() {
    if (!this.isEnabled) return;
    this.vibrate([40, 30, 40]);
    try {
      this.init();
      if (!this.ctx) return;
      this.stopHold();

      this.holdOsc = this.ctx.createOscillator();
      this.holdGain = this.ctx.createGain();

      this.holdOsc.type = 'triangle';
      this.holdOsc.frequency.setValueAtTime(80, this.ctx.currentTime);
      this.holdOsc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.6);

      this.holdGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.holdGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.3);

      this.holdOsc.connect(this.holdGain);
      this.holdGain.connect(this.ctx.destination);

      this.holdOsc.start();
    } catch {
      // ignore
    }
  }

  stopHold() {
    try {
      if (this.holdGain && this.ctx) {
        this.holdGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      }
      setTimeout(() => {
        if (this.holdOsc) {
          try {
            this.holdOsc.stop();
            this.holdOsc.disconnect();
          } catch {}
          this.holdOsc = null;
        }
      }, 60);
    } catch {}
  }

  playReveal() {
    if (!this.isEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const frequencies = [330, 440, 554.37, 659.25]; // E4, A4, C#5, E5
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.35);
      });
    } catch {}
  }

  playDoorOpen() {
    if (!this.isEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  playDoorClose() {
    if (!this.isEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  playTick(isWarning: boolean = false) {
    if (!this.isEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isWarning ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isWarning ? 880 : 600, this.ctx.currentTime);

      gain.gain.setValueAtTime(isWarning ? 0.25 : 0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  playWinner() {
    if (!this.isEnabled) return;
    this.vibrate([100, 50, 100, 50, 150]);
    try {
      this.init();
      if (!this.ctx) return;
      const chords = [523.25, 659.25, 783.99, 1046.5];
      chords.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.6);
      });
    } catch {}
  }
}

export const soundEffects = new SoundEngine();
