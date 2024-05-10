// Initialize the Anthropic SDK
const { Configuration, OpenAIApi } = require('@anthropic-ai/claude-sdk-js');
const configuration = new Configuration({
  apiKey: 'YOUR_API_KEY_HERE'
});
const openai = new OpenAIApi(configuration);

// Get DOM elements
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSendButton = document.getElementById('chat-send');
const chatVoiceButton = document.getElementById('chat-voice');

// Hardcoded context prompt
const CONTEXT_PROMPT = `You are Claude, an AI assistant created by Anthropic. You are helpful, caring, and knowledgeable. You aim to provide accurate and informative responses to the best of your abilities. You enjoy engaging in thoughtful conversations on a wide range of topics.`;

// Function to add a message to the chat
function addMessage(message, isUser) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.classList.add(isUser ? 'user-message' : 'assistant-message');
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle chat input
chatSendButton.addEventListener('click', async () => {
  const userInput = chatInput.value.trim();
  if (userInput) {
    addMessage(userInput, true);
    chatInput.value = '';

    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `${CONTEXT_PROMPT}\n\nUser: ${userInput}\nAssistant: `,
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
    } catch (error) {
      console.error('Error:', error);
      addMessage('Apologies, there was an error processing your request.', false);
    }
  }
});

// Handle voice input
chatVoiceButton.addEventListener('click', () => {
  // Implement voice input and send the audio to the API
  console.log('Voice input not implemented yet.');
});