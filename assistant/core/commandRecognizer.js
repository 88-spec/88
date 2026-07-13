/**
 * Ate Ate Command Recognizer
 * Processes auditory input and recognizes voice commands
 */

class CommandRecognizer {
  constructor(config = {}) {
    this.config = {
      language: config.language || 'en-US',
      continuous: config.continuous || false,
      interimResults: config.interimResults || true,
      ...config
    };
    this.commands = new Map();
    this.initializeSpeechRecognition();
  }

  initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.language = this.config.language;

    this.recognition.onstart = () => {
      console.log('Ate Ate listening...');
    };

    this.recognition.onresult = (event) => {
      this.handleRecognitionResult(event);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      console.log('Ate Ate stopped listening');
    };
  }

  registerCommand(trigger, callback, description = '') {
    this.commands.set(trigger.toLowerCase(), {
      callback,
      description,
      trigger
    });
  }

  handleRecognitionResult(event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    const recognizedCommand = transcript.toLowerCase().trim();
    console.log(`Recognized: ${recognizedCommand}`);

    if (this.commands.has(recognizedCommand)) {
      const command = this.commands.get(recognizedCommand);
      command.callback(recognizedCommand);
      return;
    }

    for (const [trigger, command] of this.commands.entries()) {
      if (recognizedCommand.includes(trigger)) {
        command.callback(recognizedCommand);
        return;
      }
    }

    console.log('Command not recognized');
  }

  start() {
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
  }

  abort() {
    this.recognition.abort();
  }
}

module.exports = CommandRecognizer;
