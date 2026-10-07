/**
 * Synthesizes calming ambient natural soundscape (mountain stream + distant temple bell chime)
 * using the Web Audio API without relying on external audio assets.
 */

class AmbientSoundEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private gainNode: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private chimeInterval: number | null = null;

  public start(): boolean {
    if (this.isPlaying) return true;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.12, this.audioCtx.currentTime + 2.5);
      this.gainNode.connect(this.audioCtx.destination);

      // Pink noise / bubbling stream generator
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.audioCtx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // Filter for gentle river stream
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(1.8, this.audioCtx.currentTime);

      this.noiseNode.connect(filter);
      filter.connect(this.gainNode);
      this.noiseNode.start();

      // Occasional serene temple singing bowl / wind chime tone
      this.chimeInterval = window.setInterval(() => {
        this.playGentleChime();
      }, 9000);

      this.isPlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  private playGentleChime() {
    if (!this.audioCtx || !this.gainNode || !this.isPlaying) return;

    try {
      const chimeFreqs = [528, 660, 792, 1056];
      const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

      const osc = this.audioCtx.createOscillator();
      const chimeGain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      chimeGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.04, this.audioCtx.currentTime + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 4.0);

      osc.connect(chimeGain);
      chimeGain.connect(this.gainNode);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 4.1);
    } catch {
      // ignore
    }
  }

  public stop(): void {
    if (!this.isPlaying) return;
    try {
      if (this.gainNode && this.audioCtx) {
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.8);
      }
      if (this.chimeInterval) {
        clearInterval(this.chimeInterval);
        this.chimeInterval = null;
      }
      setTimeout(() => {
        if (this.noiseNode) {
          try { this.noiseNode.stop(); } catch {}
          this.noiseNode.disconnect();
          this.noiseNode = null;
        }
        if (this.audioCtx) {
          this.audioCtx.close();
          this.audioCtx = null;
        }
        this.isPlaying = false;
      }, 900);
    } catch {
      this.isPlaying = false;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientSound = new AmbientSoundEngine();
