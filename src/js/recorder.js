/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class SoundRecorder {
  async init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
    } catch (error) {
      console.warn(error);
    }
  }

  start() {
    this.mediaRecorder.start();
  }
}

export default SoundRecorder;
