const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const vrModeToggle = document.getElementById('vr-mode-toggle');

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

vrModeToggle.addEventListener('change', toggleVRMode);

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessageToChat('user', message);
    userInput.value = '';

    try {
        const response = await axios.post('https://your-username-your-space-name.hf.space/run', { data: [message] });
        addMessageToChat('bot', response.data.data[0]);
    } catch (error) {
        addMessageToChat('bot', 'Oops! Something went wrong.');
    }
}

function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function toggleVRMode() {
    const scene = document.querySelector('a-scene');
    if (vrModeToggle.checked) {
        scene.setAttribute('vr-mode-ui', 'enabled: true');
    } else {
        scene.removeAttribute('vr-mode-ui');
    }
}
