// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import AudioRecorder from 'audio-recorder-polyfill';

export default class AudioMediaRecorder {
  private static instance: AudioMediaRecorder;

  private md?: MediaRecorder;

  private recordChunks: Blob[];

  static getInstance(): AudioMediaRecorder {
    if (!this.instance) {
      this.instance = new AudioMediaRecorder();
    }

    return this.instance;
  }

  constructor() {
    if (!window.MediaRecorder) {
      window.MediaRecorder = AudioRecorder;
    }
    this.recordChunks = [];
  }

  async initialize(): Promise<AudioMediaRecorder> {
    if (this.md) {
      return this;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    this.md = new MediaRecorder(stream);
    this.recordChunks = [];
    return this;
  }

  async startRecord(): Promise<void> {
    if (!this.md) {
      throw new Error('Must be initialized.');
    }

    this.recordChunks = [];

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.md.addEventListener('dataavailable', (e: BlobEvent) => {
      if (e.data.size > 0) {
        this.recordChunks.push(e.data);
      }
    });

    this.md.start();
  }

  async stopRecord(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.md) {
        throw new Error('Must be initialized.');
      }

      this.md.addEventListener('stop', () => {
        resolve(new Blob(this.recordChunks));
      });

      this.md.stop();
    });
  }
}
