<template>
  <div id="app">
    <recorder
      :record="record"
      @start="startRecording"
      @stop="finishRecording"
      test-id="Recorder"
    />
    <div
      v-if="currentRecording"
      test-id="RecordName"
    >
      Recording: {{currentRecording}}...
    </div>
    <div
      v-for=" (rec,idx) in recordings"
      :key="idx"
      test-id="Recording"
    >
      <button test-id="RecordDelete" @click="deleteRecording(idx)">x</button>
      <audio :controls="true" :src="rec.data"></audio>
      <a :download="rec.name" :href="rec.data">{{rec.name}}</a>
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
    currentRecording: null,
  }),
  computed: {
    record() {
      const rec = new SoundRecorder();
      rec.init();
      return rec;
    },
  },
  methods: {
    startRecording(name) {
      this.currentRecording = name;
    },
    finishRecording(data) {
      this.recordings.unshift({ data, name: this.currentRecording });
      this.currentRecording = '';
    },
    deleteRecording(index) {
      this.recordings.splice(index, 1);
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
