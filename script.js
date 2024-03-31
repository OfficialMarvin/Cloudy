const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const caption = document.getElementById('caption');

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
    // Implement voice recognition and API calls to your GPT account
    // Update the caption div with Cloudy's responses
}

// Load 3D character or animated MP4s
function loadCharacter() {
    // Load cloudy.fbx or animated MP4s and display in the character div
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
