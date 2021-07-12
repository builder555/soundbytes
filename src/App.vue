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
      <a
        class="download"
        :download="rec.name"
        :href="rec.data"
        :title="'download '+rec.name"
      >
        {{rec.name}}
      </a>
      <audio
        controls
        :src="rec.data"
        class="player"
      />
      <button
        class="delete"
        test-id="RecordDelete"
        @click="deleteRecording(idx)"
      >x</button>
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
html {
  background: #1a2639;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
audio {
  width: 350px;
  height: 30px;
  margin: 5px 5px -10px 5px;
}

audio::-webkit-media-controls-panel
{
  background:#3e4a61;
}
a.download {
  background:#d9dad7;
  color:#000;
  text-decoration: none;
  border:none;
  display:inline-block;
  padding:0px 5px;
  line-height:30px;
  border-radius: 3px;
}
a.download:hover {
  background:#fff;
}
button.delete {
  height:30px;
  width:30px;
  font-size:15pt;
  background-color:#c24d2c;
  border:none;
  color:#fff;
}
</style>
