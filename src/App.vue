<template>
  <div id="app">
    <recorder
      :record="record"
      @start="newRecording"
      @stop="finishRecording"
    />
    <div v-for=" (rec,idx) in recordings" :key="idx">
      <audio :controls="true" :src="rec.data"></audio> {{rec.name}}
    </div>
  </div>
</template>

<script>
import recorder from './components/recorder.vue';
import SoundRecorder from './js/record';

export default {
  name: 'App',
  components: {
    recorder,
  },
  data: () => ({
    recordings: [],
    recording: {
      name: '',
      data: '',
    },
  }),
  computed: {
    record() {
      const rec = new SoundRecorder();
      rec.init();
      return rec;
    },
  },
  methods: {
    newRecording(name) {
      this.recording.name = name;
    },
    finishRecording(data) {
      this.recording.data = data;
      this.recordings.push(this.recording);
      this.recording = { name: '', data: '' };
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
