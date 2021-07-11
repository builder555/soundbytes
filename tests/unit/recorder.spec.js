import { shallowMount } from '@vue/test-utils';
import RecorderComponent from '@/components/recorder.vue';

let page;
const fakeRecorder = {
  start: jest.fn(),
  stop: jest.fn(() => {
    fakeRecorder.onStop();
  }),
  onStop() { },
  blobURL: '',
};
const click = async (buttonName) => {
  const button = page.find(`[test-id="${buttonName}"]`);
  button.trigger('click');
  await page.vm.$nextTick();
};
const expectItem = (name) => {
  const component = page.find(`[test-id="${name}"]`);
  const compExists = component.exists();
  return {
    toExist() {
      expect(compExists).toBe(true);
    },
    toNotExist() {
      expect(compExists).toBe(false);
    },
  };
};
const expectEmittedEvent = (name) => ({
  toHaveData(value) {
    const event = page.emitted(name).slice(-1)[0][0];
    expect(event).toEqual(value);
  },
});

const simulateAudioData = (data) => {
  fakeRecorder.blobURL = data;
};

describe('RecorderComponent.vue', () => {
  it('displays "start record" button', () => {
    page = shallowMount(RecorderComponent);
    expect(page.find('[test-id="StartRecord"]').exists()).toBe(true);
  });
  describe('recording tests', () => {
    beforeEach(() => {
      fakeRecorder.start.mockClear();
      fakeRecorder.stop.mockClear();
      page = shallowMount(RecorderComponent, {
        propsData: {
          record: fakeRecorder,
        },
        sync: true,
      });
    });
    it('starts a recording when clicking "start record" button', () => {
      expect(fakeRecorder.start).not.toHaveBeenCalled();
      click('StartRecord');
      expect(fakeRecorder.start).toHaveBeenCalled();
    });
    it('hides "start record" button after strating a recording', async () => {
      await click('StartRecord');
      expectItem('StartRecord').toNotExist();
    });
    it('displays "stop record" button after strating a recording', async () => {
      expectItem('StopRecord').toNotExist();
      await click('StartRecord');
      expectItem('StopRecord').toExist();
    });
    it('displays "start record" and hides "stop record" button after stopping a recording', async () => {
      await click('StartRecord');
      await click('StopRecord');
      expectItem('StartRecord').toExist();
      expectItem('StopRecord').toNotExist();
    });
    it('stops the recording when clicking "Stop Recrod" button', async () => {
      await click('StartRecord');
      expect(fakeRecorder.stop).not.toHaveBeenCalled();
      await click('StopRecord');
      expect(fakeRecorder.stop).toHaveBeenCalled();
    });
    it('generates a new name when starting a new recording', async () => {
      await click('StartRecord');
      expectEmittedEvent('start').toHaveData('recording-1');
      await click('StopRecord');
      await click('StartRecord');
      expectEmittedEvent('start').toHaveData('recording-2');
    });
    it('returns recorded data when stopping recording', async () => {
      await click('StartRecord');
      simulateAudioData('hello world');
      await click('StopRecord');
      expectEmittedEvent('stop').toHaveData('hello world');
    });
  });
});
