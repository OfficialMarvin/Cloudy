const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
let listening = false;
let recognizer;

// Initialize the SpeechSynthesis API
const speechSynth = window.speechSynthesis;

// Initialize the media stream for the camera
async function initCamera() {
    try {
        const videoElement = document.createElement('video');
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('autoplay', '');
        videoElement.setAttribute('muted', '');
        document.getElementById('camera-container').appendChild(videoElement);

        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

// Initialize the Web Speech API recognizer
function initSpeechRecognizer() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.lang = 'en-US';
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;

    recognizer.onresult = async (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        console.log('Heard:', text);
        sendToPythonServer(text);
    };

    recognizer.onend = () => {
        if (listening) {
            recognizer.start();
        }
    };
}

// Send the user's speech to the local Python server and handle the response
async function sendToPythonServer(text) {
    const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
        })
    });

    if (response.ok) {
        const data = await response.json();
        const reply = data.message;
        console.log('Cloudy:', reply);
        speak(reply);
    } else {
        console.error('Error from Python server:', await response.text());
    }
}

// Use the SpeechSynthesis API to speak text out loud
function speak(text) {
    if (speechSynth.speaking) {
        console.error('SpeechSynthesis is already speaking.');
        return;
    }
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    };
    utterThis.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
    };
    speechSynth.speak(utterThis);
}

// Start listening to speech
startBtn.addEventListener('click', () => {
    if (listening) {
        recognizer.stop();
        listening = false;
    } else {
        recognizer.start();
        listening = true;
    }
});

// Stop listening to speech
stopBtn.addEventListener('click', () => {
    if (listening) {
        recognizer.stop();
        listening = false;
    }
});

// Initialize the application components
initCamera();
initSpeechRecognizer();
