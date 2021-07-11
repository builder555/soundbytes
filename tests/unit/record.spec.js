import SoundRecorder from '@/js/record';

const stub = (object) => ({
  constructor: (constructorName) => ({
    with(value) {
      Object.defineProperty(object, constructorName, {
        value: jest.fn().mockImplementation(() => value),
      });
    },
  }),
  property: (propertyName) => ({
    with(value) {
      Object.defineProperty(object, propertyName, { value });
    },
  }),
});

describe('SoundRecorder', () => {
  const mockUserMedia = jest.fn();
  let recorder;
  const FakeRecorderClass = {
    start() { },
    stop() {
      this.onstop();
    },
    onstop() { },
    ondataavailable() { },
  };
  const mockStartRecord = jest.spyOn(FakeRecorderClass, 'start');
  const mockStopRecord = jest.spyOn(FakeRecorderClass, 'stop');
  const simulateChunkAvailable = (chunk) => {
    FakeRecorderClass.ondataavailable({ data: chunk });
  };
  beforeAll(() => {
    stub(window).constructor('MediaRecorder').with(FakeRecorderClass);
    stub(window.navigator).property('mediaDevices').with({ getUserMedia: mockUserMedia });
    recorder = new SoundRecorder();
  });

  it('should process getUserMedia promise to record audio', async () => {
    await recorder.init();
    expect(mockUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it('should start recording audio by calling .start() method of MediaRecorder', async () => {
    await recorder.init();
    recorder.start();
    expect(mockStartRecord).toHaveBeenCalled();
  });

  it('should stop recording audio by calling .stop() method of MediaRecorder', async () => {
    await recorder.init();
    recorder.stop();
    expect(mockStopRecord).toHaveBeenCalled();
  });

  it('should save audio chunks when recording', async () => {
    const audioChunk = '001abcd';
    await recorder.init();
    recorder.start();
    jest.spyOn(global, 'Blob').mockImplementation((data) => data);
    stub(window).property('URL').with({ createObjectURL: (data) => data });
    simulateChunkAvailable(audioChunk);
    expect(recorder.blobURL).toContain(audioChunk);
  });

  it('should clear audio chunks before a new recording', async () => {
    await recorder.init();
    recorder.start();
    simulateChunkAvailable('abc123');
    recorder.stop();
    recorder.start();
    expect(recorder.blobURL).toHaveLength(0);
  });

  it('should trigger "onStop" event when recording stops', async () => {
    const spyOnStop = jest.spyOn(recorder, 'onStop');
    await recorder.init();
    recorder.start();
    simulateChunkAvailable('abc123');
    recorder.stop();
    expect(spyOnStop).toHaveBeenCalled();
  });
});
