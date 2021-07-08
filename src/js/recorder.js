/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class SoundRecorder {
  constructor() {
    this.mediaRecorder = new MediaRecorder();
  }

  start() {
    this.mediaRecorder.start();
  }
}

export default SoundRecorder;
