/**
 * Web Audio API based ambient sound generator for Book Cafe / Library atmosphere
 * & Speech Synthesis helper for Reading Quotes.
 */

class AmbientSoundManager {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;

  public toggleRainAmbient(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.startRain();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private startRain() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Generate soft rain / fireplace brown noise buffer
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter formula
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter for warm rain/fireplace ambient
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime); // Soft volume

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      whiteNoise.start();
      this.noiseNode = whiteNoise;
      this.isPlaying = true;
    } catch (err) {
      console.warn("Audio Context init error", err);
      this.isPlaying = false;
    }
  }

  public stop() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
    this.isPlaying = false;
  }
}

export const ambientSound = new AmbientSoundManager();

/**
 * Web Speech API to read out quotes warmly
 */
export function speakQuote(text: string, author?: string) {
  if (!('speechSynthesis' in window)) {
    alert('이 브라우저는 음성 읽기를 지원하지 않습니다.');
    return;
  }

  window.speechSynthesis.cancel();

  const fullText = author ? `${text} ... ${author}` : text;
  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.9; // Slightly slower, calm reading speed
  utterance.pitch = 1.0;

  // Try to find Korean voice if available
  const voices = window.speechSynthesis.getVoices();
  const koVoice = voices.find(v => v.lang.includes('ko') || v.lang.includes('KR'));
  if (koVoice) {
    utterance.voice = koVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
