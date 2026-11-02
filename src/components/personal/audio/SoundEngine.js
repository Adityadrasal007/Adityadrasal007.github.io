/**
 * Procedural Web Audio Sound Engine for 3D Toy Car
 *
 * 100% synthesized in real-time — Zero external audio files required:
 * - Speed-synchronized engine oscillator (frequency + volume ramp)
 * - Dynamic tire drift screech (filtered white noise)
 * - Physics collision impact thuds (noise burst + sub-bass decay)
 * - Dual-tone retro toy car horn (440Hz + 554Hz)
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Default muted for browser autoplay policy compliance
    this.engineOsc = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.skidGain = null;
    this.skidSource = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    // 1. Continuous Engine Synthesizer
    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(38, this.ctx.currentTime);

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.engineOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);
    this.engineOsc.start();

    // 2. Tire Skid White Noise Generator
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.skidSource = this.ctx.createBufferSource();
    this.skidSource.buffer = noiseBuffer;
    this.skidSource.loop = true;

    const skidFilter = this.ctx.createBiquadFilter();
    skidFilter.type = 'bandpass';
    skidFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    skidFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    this.skidGain = this.ctx.createGain();
    this.skidGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.skidSource.connect(skidFilter);
    skidFilter.connect(this.skidGain);
    this.skidGain.connect(this.ctx.destination);
    this.skidSource.start();

    this.isInitialized = true;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!muted) {
      if (!this.isInitialized) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } else if (this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      if (this.skidGain) this.skidGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
  }

  updateEngine(speedKmH, isAccelerating) {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;

    const now = this.ctx.currentTime;
    const speedRatio = Math.min(1.0, speedKmH / 75);

    // Engine Pitch Scaling
    const baseFreq = isAccelerating ? 55 : 40;
    const targetFreq = baseFreq + speedRatio * 180;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);

    // Filter Opening with Speed
    const targetFilter = 180 + speedRatio * 650;
    this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.08);

    // Volume ramp
    const targetGain = 0.04 + speedRatio * 0.08;
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.06);
  }

  updateSkid(isSkidding) {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;
    const now = this.ctx.currentTime;
    const targetGain = isSkidding ? 0.07 : 0;
    this.skidGain.gain.setTargetAtTime(targetGain, now, 0.05);
  }

  playImpact(strength = 1.0) {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);

    const vol = Math.min(0.25, 0.08 * strength);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playHorn() {
    if (!this.isInitialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Dual Tone Classic Car Horn: F4 (349 Hz) and A4 (440 Hz)
    [349, 440].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    });
  }
}

export const sound = new SoundEngine();
export default sound;
