<template>
  <div>
    <button @click="toggleRecognition">{{ isRecognizing ? 'Stop' : 'Start' }} Voice Recognition</button>
  </div>
</template>

<script>
export default {
  name: 'VoiceRecognition',
  data() {
    return {
      isRecognizing: false,
      recognition: null,
    };
  },
  methods: {
    toggleRecognition() {
      if (this.isRecognizing) {
        this.stopRecognition();
      } else {
        this.startRecognition();
      }
    },
    startRecognition() {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Web Speech API is not supported in this browser.');
        return;
      }

      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isRecognizing = true;
      };

      this.recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript.trim();
            this.$emit('voice-command', transcript);
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
      };

      this.recognition.onend = () => {
        this.isRecognizing = false;
      };

      this.recognition.start();
    },
    stopRecognition() {
      if (this.recognition) {
        this.recognition.stop();
        this.isRecognizing = false;
      }
    },
  },
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
