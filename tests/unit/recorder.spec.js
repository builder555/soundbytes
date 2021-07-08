import SoundRecorder from '@/js/recorder';

describe('SoundRecorder', () => {
  it('should start recording audio', () => {
    const startRecord = jest.fn();
    Object.defineProperty(window, 'MediaRecorder', {
      value: jest.fn().mockImplementation(() => ({
        start: startRecord,
      })),
    });

    const recorder = new SoundRecorder();
    recorder.start();
    expect(startRecord).toHaveBeenCalled();
  });
});
