import { shallowMount } from '@vue/test-utils';
import app from '@/App.vue';
let page;
jest.mock('../../src/js/record', () => {
  class FakeRecorder {
    // eslint-disable-next-line class-methods-use-this
    init() { }
  }
  return FakeRecorder;
});
const expectItem = (name) => {
  const component = page.find(`[test-id="${name}"]`);
  return {
    toExist() {
      expect(component.exists()).toBe(true);
    },
    toNotExist() {
      expect(component.exists()).toBe(false);
    },
    toContain(text) {
      expect(component.text()).toContain(text);
    },
  };
};
const fromItem = (name) => {
  const component = page.find(`[test-id="${name}"]`);
  return {
    async emitEvent(eventName, data) {
      component.vm.$emit(eventName, data);
      await page.vm.$nextTick();
    },
  };
};
describe('app', () => {
  beforeEach(() => {
    page = shallowMount(app);
  });
  afterEach(() => {
    page.destroy();
  });
  it('contains the sound recording component', () => {
    expectItem('Recorder').toExist();
  });
  it('displays the name of the current recording', async () => {
    await fromItem('Recorder').emitEvent('start', 'new-record-name');
    expectItem('RecordName').toContain('new-record-name');
  });
  it('should not display the name of a recording before it starts', async () => {
    expectItem('RecordName').toNotExist();
  });
  it('displays a finished recording', async () => {
    const fakeData = 'fake-data-1';
    await fromItem('Recorder').emitEvent('start', 'new-record-name-1');
    await fromItem('Recorder').emitEvent('stop', fakeData);
    const recording = page.find('[test-id="Recording"]');
    expect(recording.find('audio').attributes('src')).toBe(fakeData);
  });
  it('provides a downloadable link to the recording', async () => {
    const fakeData = 'fake-data-1';
    const fakeName = 'new-record-name-1';
    await fromItem('Recorder').emitEvent('start', fakeName);
    await fromItem('Recorder').emitEvent('stop', fakeData);
    const recording = page.find('[test-id="Recording"]');
    expect(recording.find('a').attributes('download')).toBe(fakeName);
    expect(recording.find('a').attributes('href')).toBe(fakeData);
  });
  it('should display 2 recordings after starting and stopping twice', async () => {
    await fromItem('Recorder').emitEvent('start', 'new-record-name-1');
    await fromItem('Recorder').emitEvent('stop', 'fake-data-1');
    await fromItem('Recorder').emitEvent('start', 'new-record-name-2');
    await fromItem('Recorder').emitEvent('stop', 'fake-data-2');
    const recs = page.findAll('[test-id="Recording"]');
    expect(recs.length).toBe(2);
  });
  it('removes an existing recording when clicking X next to it', async () => {
    await fromItem('Recorder').emitEvent('start', 'new-name');
    await fromItem('Recorder').emitEvent('stop', 'fake-data');
    expect(page.findAll('[test-id="Recording"]').length).toBe(1);
    page.find('[test-id="RecordDelete"]').trigger('click');
    await page.vm.$nextTick();
    expect(page.findAll('[test-id="Recording"]').length).toBe(0);
  });
});
