/**
 * Ate Ate Digital Assistant - Main Controller
 */

const CommandRecognizer = require('./commandRecognizer');
const DialogueEngine = require('./dialogueEngine');
const SpeechSynthesizer = require('./speechSynthesizer');

class AteAteAssistant {
  constructor(config = {}) {
    this.config = {
      autoSpeak: config.autoSpeak !== false,
      language: config.language || 'en-US',
      ...config
    };

    this.recognizer = new CommandRecognizer({ language: this.config.language });
    this.dialogue = new DialogueEngine(this.config);
    this.synthesizer = new SpeechSynthesizer({ language: this.config.language });
    this.isListening = false;
    this.eventListeners = new Map();

    this.setupDefaultCommands();
  }

  setupDefaultCommands() {
    this.recognizer.registerCommand('start listening', () => {
      this.start();
    }, 'Start listening for commands');

    this.recognizer.registerCommand('stop listening', () => {
      this.stop();
    }, 'Stop listening for commands');
  }

  async processInput(userInput) {
    console.log(`User: ${userInput}`);
    this.emit('input-received', userInput);

    const response = this.dialogue.generateResponse(userInput);
    console.log(`Ate Ate: ${response}`);
    this.emit('response-generated', response);

    if (this.config.autoSpeak) {
      await this.speak(response);
    }

    return response;
  }

  async speak(text) {
    this.emit('speaking', text);
    await this.synthesizer.speak(text);
    this.emit('speech-complete', text);
  }

  start() {
    if (!this.isListening) {
      this.isListening = true;
      this.recognizer.start();
      this.emit('listening-started');
    }
  }

  stop() {
    if (this.isListening) {
      this.isListening = false;
      this.recognizer.stop();
      this.emit('listening-stopped');
    }
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        callback(data);
      });
    }
  }

  registerCustomCommand(trigger, callback, description) {
    this.recognizer.registerCommand(trigger, (recognizedCommand) => {
      callback(recognizedCommand);
      this.emit('command-executed', { trigger, recognizedCommand });
    }, description);
  }
}

module.exports = AteAteAssistant;
