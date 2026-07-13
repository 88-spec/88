/**
 * Ate Ate Speech Synthesizer
 * Converts text responses to auditory output
 */

class SpeechSynthesizer {
  constructor(config = {}) {
    this.config = {
      rate: config.rate || 1,
      pitch: config.pitch || 1,
      volume: config.volume || 1,
      language: config.language || 'en-US',
      ...config
    };
    this.isSpeak = window.speechSynthesis;
    this.initializeSynthesizer();
  }

  initializeSynthesizer() {
    if (!this.isSpeak) {
      console.error('Speech Synthesis API not supported in this browser');
      return;
    }
  }

  async speak(text) {
    if (!this.isSpeak) {
      console.error('Speech Synthesis not available');
      return;
    }

    this.isSpeak.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.config.rate;
    utterance.pitch = this.config.pitch;
    utterance.volume = this.config.volume;
    utterance.lang = this.config.language;

    utterance.onstart = () => {
      console.log('Ate Ate is speaking...');
    };

    utterance.onend = () => {
      console.log('Ate Ate finished speaking');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };

    this.isSpeak.speak(utterance);

    return new Promise((resolve) => {
      utterance.onend = () => {
        console.log('Ate Ate finished speaking');
        resolve();
      };
    });
  }

  getVoices() {
    if (!this.isSpeak) return [];
    return this.isSpeak.getVoices();
  }

  setVoice(voiceIndex) {
    const voices = this.getVoices();
    if (voiceIndex >= 0 && voiceIndex < voices.length) {
      this.selectedVoice = voices[voiceIndex];
    }
  }

  stop() {
    if (this.isSpeak) {
      this.isSpeak.cancel();
    }
  }
}

module.exports = SpeechSynthesizer;
