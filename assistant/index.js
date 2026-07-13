/**
 * Ate Ate Digital Assistant - Application Entry Point
 */

const AteAteAssistant = require('./core/ateAteAssistant');

// Initialize Ate Ate Assistant
const ateAte = new AteAteAssistant({
  language: 'en-US',
  autoSpeak: true
});

// Setup event listeners
ateAte.on('listening-started', () => {
  console.log('✓ Ate Ate is now listening');
});

ateAte.on('listening-stopped', () => {
  console.log('✗ Ate Ate stopped listening');
});

ateAte.on('input-received', (input) => {
  console.log(`📢 User input: ${input}`);
});

ateAte.on('response-generated', (response) => {
  console.log(`🤖 Ate Ate: ${response}`);
});

ateAte.on('command-executed', (data) => {
  console.log(`⚡ Command executed: ${data.trigger}`);
});

// Register custom commands
ateAte.registerCustomCommand('open browser', () => {
  ateAte.speak('Opening browser');
}, 'Open web browser');

ateAte.registerCustomCommand('play music', () => {
  ateAte.speak('Playing music');
}, 'Play music');

if (typeof window === 'undefined') {
  console.log('Ate Ate Assistant initialized successfully');
  console.log('Available commands: hello, help, status, thank you, goodbye');
}

module.exports = ateAte;
