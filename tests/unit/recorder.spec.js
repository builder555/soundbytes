import SoundRecorder from '@/js/recorder';

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
  const mockStartRecord = jest.fn();
  beforeAll(() => {
    stub(window).constructor('MediaRecorder').with({ start: mockStartRecord });
  });
  it('should process getUserMedia promise to record audio', async () => {
    const recorder = new SoundRecorder();
    const mockUserMedia = jest.fn();
    stub(window.navigator).property('mediaDevices').with({ getUserMedia: mockUserMedia });
    await recorder.init();
    expect(mockUserMedia).toHaveBeenCalledWith({ audio: true });
  });
  it('should start recording audio by calling .start() method of MediaRecorder', async () => {
    const recorder = new SoundRecorder();
    await recorder.init();
    recorder.start();
    expect(mockStartRecord).toHaveBeenCalled();
  });
});
