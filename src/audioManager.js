export class AudioManager {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.buffers = {};
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.activeSources = [];
  }

  async loadSound(url) {
    if (this.buffers[url]) return this.buffers[url];
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers[url] = audioBuffer;
      return audioBuffer;
    } catch (e) {
      console.error("Error loading", url, e);
      return null;
    }
  }

  playSound(url) {
    const buffer = this.buffers[url];
    if (!buffer) {
       this.loadSound(url).then(b => {
         if (b) this._playBuffer(b);
       });
       return;
    }
    this._playBuffer(buffer);
  }

  async _playBuffer(buffer) {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.masterGain);
    source.start(0);
    this.activeSources.push(source);
    source.onended = () => {
      this.activeSources = this.activeSources.filter(s => s !== source);
    };
  }

  setVolume(val) {
    this.masterGain.gain.value = val;
  }

  stopAll() {
    this.activeSources.forEach(s => {
      try { s.stop(); } catch(e){}
    });
    this.activeSources = [];
  }
}

export const globalAudio = new AudioManager();
