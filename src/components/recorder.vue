<template>
  <div class="hello">
    <button v-if="isRecording" test-id="StopRecord" @click="stop">Stop</button>
    <button v-else test-id="StartRecord" @click="start">Record</button>
  </div>
</template>

<script>
export default {
  name: 'recorder',
  props: ['record'],
  data: () => ({
    isRecording: false,
    recordingNumber: 1,
  }),
  methods: {
    start() {
      this.isRecording = true;
      this.record.start();
      this.$emit('start', `recording-${this.recordingNumber}`);
      this.recordingNumber += 1;
      this.record.onStop = () => {
        this.$emit('stop', this.record.blobURL);
      };
    },
    stop() {
      this.isRecording = false;
      this.record.stop();
    },
  },
};
</script>
