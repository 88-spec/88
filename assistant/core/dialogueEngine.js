/**
 * Ate Ate Dialogue Engine
 * Manages conversation flows and responses
 */

class DialogueEngine {
  constructor(config = {}) {
    this.config = config;
    this.dialogues = new Map();
    this.context = {};
    this.currentDialogueState = 'idle';
    this.initializeDialogues();
  }

  initializeDialogues() {
    this.addDialogue('greeting', {
      triggers: ['hello', 'hi', 'hey', 'greetings'],
      responses: [
        'Hello! I am Ate Ate, your digital assistant. How can I help you?',
        'Hi there! I\'m Ate Ate. What can I do for you today?',
        'Greetings! Ate Ate at your service.'
      ]
    });

    this.addDialogue('status', {
      triggers: ['how are you', 'are you working', 'status'],
      responses: [
        'I\'m running smoothly and ready to assist.',
        'All systems are operational. I\'m ready to help.',
        'I\'m functioning perfectly. How can I assist you?'
      ]
    });

    this.addDialogue('help', {
      triggers: ['help', 'what can you do', 'assist'],
      responses: [
        'I can help you with voice commands, answer questions, manage tasks, and control your applications.',
        'I\'m equipped to handle voice recognition, execute commands, and provide information.'
      ]
    });

    this.addDialogue('acknowledgment', {
      triggers: ['thank you', 'thanks', 'appreciate'],
      responses: [
        'You\'re welcome! Happy to help.',
        'My pleasure. Let me know if you need anything else.',
        'Glad I could assist!'
      ]
    });

    this.addDialogue('closing', {
      triggers: ['goodbye', 'bye', 'see you', 'exit'],
      responses: [
        'Goodbye! Have a great day!',
        'See you later! Take care.',
        'Bye! Feel free to call on me anytime.'
      ]
    });
  }

  addDialogue(key, dialogueObject) {
    this.dialogues.set(key, dialogueObject);
  }

  matchDialogue(input) {
    const lowerInput = input.toLowerCase();
    for (const [key, dialogue] of this.dialogues.entries()) {
      for (const trigger of dialogue.triggers) {
        if (lowerInput.includes(trigger)) {
          return this.getRandomResponse(dialogue.responses);
        }
      }
    }
    return this.getDefaultResponse();
  }

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getDefaultResponse() {
    const defaults = [
      'I didn\'t quite understand. Could you rephrase that?',
      'Can you say that again?',
      'I\'m not sure what you mean. Please try again.'
    ];
    return this.getRandomResponse(defaults);
  }

  generateResponse(userInput) {
    this.currentDialogueState = 'processing';
    const response = this.matchDialogue(userInput);
    this.currentDialogueState = 'ready';
    return response;
  }

  setContext(key, value) {
    this.context[key] = value;
  }

  getContext(key) {
    return this.context[key];
  }
}

module.exports = DialogueEngine;
