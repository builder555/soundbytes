import SoundRecorder from '@/js/recorder';

describe('SoundRecorder', () => {
  it('should start recording audio', () => {
    const startRecord = jest.fn();
    Object.defineProperty(window, 'MediaRecorder', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        start: startRecord,
        ondataavailable: jest.fn(),
        onerror: jest.fn(),
        state: '',
        stop: jest.fn(),
      })),
    });

    const recorder = new SoundRecorder();
    recorder.start();
    expect(startRecord).toHaveBeenCalled();
  });
});
