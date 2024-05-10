// Initialize the Anthropic SDK
const { Configuration, OpenAIApi } = require('@anthropic-ai/claude-sdk-js');
const configuration = new Configuration({
  apiKey: 'YOUR_API_KEY_HERE'
});
const openai = new OpenAIApi(configuration);

// Get DOM elements
const chatMessages = document.querySelector('.chat-messages');
const chatVoiceButton = document.getElementById('chat-voice');

// Hardcoded context prompt
const CONTEXT_PROMPT = `You are Cloudy, a helpful and caring conversational AI assistant created by Anthropic. Your goal is to engage in natural and meaningful conversations with users, providing informative and thoughtful responses. You have a warm and friendly personality, and you enjoy discussing a wide range of topics. You are patient, attentive, and always strive to be genuinely helpful.`;

// Function to add a message to the chat
function addMessage(message, isUser) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.classList.add(isUser ? 'user-message' : 'assistant-message');
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle voice input
chatVoiceButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    const recognizer = new webkitSpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;

    recognizer.onresult = async (event) => {
      const userInput = event.results[event.results.length - 1][0].transcript.trim();
      addMessage(userInput, true);

      try {
        const response = await openai.createCompletion({
          model: 'text-davinci-002',
          prompt: `${CONTEXT_PROMPT}\n\nUser: ${userInput}\nCloudy:`,
          max_tokens: 2048,
          n: 1,
          stop: null,
          temperature: 0.7,
          presence_penalty: 0.6,
          frequency_penalty: 0.6,
          top_p: 1,
        });
        const assistantMessage = response.data.choices[0].text.trim();
        addMessage(assistantMessage, false);

        // Use text-to-speech to generate audio response
        const utterance = new SpeechSynthesisUtterance(assistantMessage);
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error:', error);
        addMessage('Apologies, there was an error processing your request.', false);
      }
    };

    recognizer.start();
  } catch (error) {
    console.error('Error:', error);
    addMessage('Apologies, there was an error with the voice recognition.', false);
  }
});