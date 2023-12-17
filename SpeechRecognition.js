// SpeechRecognition.js

let recognition;
let transcriptContainer;

const setupSpeechRecognition = () => {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    transcriptContainer.innerText = transcript;
  };

  recognition.onend = () => {
    recognition.start();
  };
};

// Ajoutez une fonction pour démarrer la reconnaissance vocale
const startSpeechRecognition = () => {
  recognition.start();
};

// Ajoutez une fonction pour arrêter la reconnaissance vocale
const stopSpeechRecognition = () => {
  recognition.stop();
};

document.addEventListener("DOMContentLoaded", () => {
  transcriptContainer = document.createElement("div");
  transcriptContainer.id = "transcript-container";
  document.body.appendChild(transcriptContainer);
});

export {
  setupSpeechRecognition,
  startSpeechRecognition,
  stopSpeechRecognition,
};
