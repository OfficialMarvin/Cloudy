const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const caption = document.getElementById('caption');
const character = document.getElementById('character');

// Access camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error accessing camera:', err);
    });

// Dot matrix effect
function dotMatrix() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
    
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(dotMatrix);
}

// Voice recognition and API calls
function voiceRecognition() {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('Transcript:', transcript);

        try {
            const response = await fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY'
                },
                body: JSON.stringify({
                    prompt: transcript,
                    model: 'text-davinci-002',
                    max_tokens: 100,
                    n: 1,
                    stop: null,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            const generatedText = data.choices[0].text.trim();
            console.log('Generated Text:', generatedText);

            caption.textContent = generatedText;
            speakText(generatedText);
        } catch (err) {
            console.error('Error calling GPT API:', err);
        }
    };

    recognition.start();
}

// Text-to-speech
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

// Load 3D character or animated MP4s
function loadCharacter() {
    // Load cloudy.fbx or animated MP4s and display in the character div
    character.innerHTML = '<img src="cloudy_animated.mp4" alt="Cloudy">';
}

// Initialize the app
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    dotMatrix();
    voiceRecognition();
    loadCharacter();
}

init();
