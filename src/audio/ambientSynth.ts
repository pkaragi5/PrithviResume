/**
 * Web Audio API Lo-Fi Futuristic Atmospheric Ambient Engine.
 * 100% procedural synthesis — zero external audio assets required.
 * Generates an endless, evolving sci-fi atmospheric soundscape with:
 * - Sub-bass drone with binaural frequency drift
 * - Ethereal floating harmonic pad voices
 * - Analog tape texture & cosmic background noise
 * - Slow breathing LFO filter sweeps
 * - Distant spatial telemetry pings
 */

export class AmbientSynth {
  private ctx: AudioContext;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;

  // Drone nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;

  // Pad voice nodes
  private padOscs: OscillatorNode[] = [];
  private padGains: GainNode[] = [];
  private padFilter: BiquadFilterNode | null = null;
  private lfoFilter: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  // Noise texture (tape / cosmic hiss)
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // Telemetry pulse timer
  private telemetryTimer: number | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  /**
   * Generates a 4-second loopable pink noise buffer with analog tape texture
   */
  private createLoFiNoiseBuffer(): AudioBuffer {
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Paul Kellet's filtered pink noise algorithm
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    return buffer;
  }

  /**
   * Starts the procedural atmospheric soundscape with smooth fade-in
   */
  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;

      // Master ambient gain with smooth 2-second fade-in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.linearRampToValueAtTime(0.095, now + 2.0);
      this.masterGain.connect(this.ctx.destination);

      // ==========================================
      // 1. DEEP SUB & FOUNDATIONAL DRONE (A1 / 55Hz)
      // ==========================================
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.4, now);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(180, now);
      this.droneFilter.Q.setValueAtTime(2.0, now);

      // Detuned dual oscillators create hypnotic slow phase beats (~0.3Hz)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55, now);

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(55.28, now);

      // Sub-bass root (A0 / 27.5Hz) for physical depth
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(27.5, now);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.subOsc.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
      this.subOsc.start(now);

      // ==========================================
      // 2. ETHEREAL HARMONIC PAD (Ethereal 5ths & 9ths)
      // ==========================================
      // Frequencies: 110Hz (A2), 164.81Hz (E3), 220Hz (A3), 246.94Hz (B3)
      const padFreqs = [110, 164.81, 220, 246.94];
      this.padOscs = [];
      this.padGains = [];

      this.padFilter = this.ctx.createBiquadFilter();
      this.padFilter.type = 'lowpass';
      this.padFilter.frequency.setValueAtTime(320, now);
      this.padFilter.Q.setValueAtTime(2.5, now);

      // Slow breathing LFO modulates pad filter cutoff (0.07Hz = ~14 second breathing cycle)
      this.lfoFilter = this.ctx.createOscillator();
      this.lfoFilter.frequency.setValueAtTime(0.07, now);

      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(160, now); // Modulates cutoff between 160Hz and 480Hz
      this.lfoFilter.connect(this.lfoGain);
      this.lfoGain.connect(this.padFilter.frequency);
      this.lfoFilter.start(now);

      padFreqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Slight micro-detune per voice
        const detune = (idx - 1.5) * 3.5;
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);

        gain.gain.setValueAtTime(0.06 / (idx + 1), now);

        osc.connect(gain);
        gain.connect(this.padFilter!);
        osc.start(now);

        this.padOscs.push(osc);
        this.padGains.push(gain);
      });

      this.padFilter.connect(this.masterGain);

      // ==========================================
      // 3. LO-FI TAPE HISS & COSMIC NOISE
      // ==========================================
      const noiseBuffer = this.createLoFiNoiseBuffer();
      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'bandpass';
      this.noiseFilter.frequency.setValueAtTime(1400, now);
      this.noiseFilter.Q.setValueAtTime(1.2, now);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.045, now);

      this.noiseSource.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      this.noiseSource.start(now);

      // ==========================================
      // 4. PERIODIC TELEMETRY RESONANCE PINGS
      // ==========================================
      this.scheduleTelemetryPing();
    } catch {
      // AudioContext policy restrictions
      this.isRunning = false;
    }
  }

  /**
   * Periodically schedules a distant, soft crystalline telemetry resonance ping
   */
  private scheduleTelemetryPing() {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;

    // Random interval between 7 and 13 seconds
    const nextInterval = 7000 + Math.random() * 6000;
    this.telemetryTimer = window.setTimeout(() => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return;

      try {
        const now = this.ctx.currentTime;
        const pingOsc = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        const pingFilter = this.ctx.createBiquadFilter();

        // High harmonic telemetry tones (e.g. 880Hz or 1318Hz)
        const freqs = [880, 1100, 1318, 1760];
        const selectedFreq = freqs[Math.floor(Math.random() * freqs.length)];

        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(selectedFreq, now);

        pingFilter.type = 'bandpass';
        pingFilter.frequency.setValueAtTime(selectedFreq, now);
        pingFilter.Q.setValueAtTime(5.0, now);

        // Soft, ethereal envelope
        pingGain.gain.setValueAtTime(0.0001, now);
        pingGain.gain.linearRampToValueAtTime(0.012, now + 0.15);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        pingOsc.connect(pingFilter);
        pingFilter.connect(pingGain);
        pingGain.connect(this.masterGain);

        pingOsc.start(now);
        pingOsc.stop(now + 3.3);
      } catch {
        // ignore
      }

      this.scheduleTelemetryPing();
    }, nextInterval);
  }

  /**
   * Stops ambient sound loop with smooth 0.8-second fade-out and node cleanup
   */
  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.telemetryTimer) {
      clearTimeout(this.telemetryTimer);
      this.telemetryTimer = null;
    }

    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);

        window.setTimeout(() => {
          // Teardown drone
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.subOsc?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.subOsc?.disconnect();
          this.droneFilter?.disconnect();
          this.droneGain?.disconnect();

          // Teardown pads
          this.padOscs.forEach((o) => {
            o.stop();
            o.disconnect();
          });
          this.padGains.forEach((g) => g.disconnect());
          this.lfoFilter?.stop();
          this.lfoFilter?.disconnect();
          this.lfoGain?.disconnect();
          this.padFilter?.disconnect();

          // Teardown noise
          this.noiseSource?.stop();
          this.noiseSource?.disconnect();
          this.noiseFilter?.disconnect();
          this.noiseGain?.disconnect();

          // Teardown master
          this.masterGain?.disconnect();

          this.droneOsc1 = null;
          this.droneOsc2 = null;
          this.subOsc = null;
          this.droneFilter = null;
          this.droneGain = null;
          this.padOscs = [];
          this.padGains = [];
          this.lfoFilter = null;
          this.lfoGain = null;
          this.padFilter = null;
          this.noiseSource = null;
          this.noiseFilter = null;
          this.noiseGain = null;
          this.masterGain = null;
        }, 850);
      } catch {
        // ignore
      }
    }
  }
}
