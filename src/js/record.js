class SoundRecorder {
  async init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
      this.mediaRecorder.onstop = () => this.onStop();
    } catch (error) {
      console.warn(error);
    }
  }

  get blobURL() {
    const blob = new Blob(this.audioChunks, { type: 'audio/ogg; codecs=opus' });
    return window.URL.createObjectURL(blob);
  }

  start() {
    this.audioChunks = [];
    this.mediaRecorder.start();
  }

  stop() {
    this.mediaRecorder.stop();
  }

  // eslint-disable-next-line class-methods-use-this
  onStop() { }
}

export default SoundRecorder;
