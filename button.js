import { Component, InputComponent, MeshComponent, Property } from '@wonderlandengine/api';
import { CursorTarget, HowlerAudioSource } from '@wonderlandengine/components';
import { hapticFeedback } from './util.js';  // Assuming utility functions are stored here

export class ButtonComponent extends Component {
    static TypeName = 'button';
    static Properties = {
        buttonMeshObject: Property.object(),
        hoverMaterial: Property.material(),
    };

    constructor() {
        super();
        this.returnPos = new Float32Array(3);
    }

    start() {
        this.mesh = this.buttonMeshObject.getComponent(MeshComponent);
        this.defaultMaterial = this.mesh.material;
        this.buttonMeshObject.getTranslationLocal(this.returnPos);

        this.target = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget);
        this.soundClick = this.object.addComponent(HowlerAudioSource, { src: 'sfx/click.wav', spatial: true });
        this.soundUnClick = this.object.addComponent(HowlerAudioSource, { src: 'sfx/unclick.wav', spatial: true });

        this.setupVoiceInteraction();
    }

    setupVoiceInteraction() {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance();
        utterance.lang = 'en-US';

        this.target.onClick.add(() => {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();
                    const audioChunks = [];
                    mediaRecorder.addEventListener("dataavailable", event => {
                        audioChunks.push(event.data);
                    });
                    mediaRecorder.addEventListener("stop", () => {
                        const audioBlob = new Blob(audioChunks);
                        const formData = new FormData();
                        formData.append('audio', audioBlob);
                        fetch('https://api.openai.com/v1/audio/transcriptions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer YOUR_OPENAI_API_KEY`
                            },
                            body: formData
                        })
                            .then(response => response.json())
                            .then(data => {
                                const text = data.choices[0].text;
                                fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        prompt: text,
                                        max_tokens: 150
                                    })
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        const reply = data.choices[0].text.trim();
                                        utterance.text = reply;
                                        synth.speak(utterance);
                                    });
                            });
                    });
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 5000); // Record for 5 seconds
                })
                .catch(e => console.error('Error capturing audio: ', e));
        });
    }
}
