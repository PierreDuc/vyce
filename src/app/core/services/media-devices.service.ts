import { Injectable } from '@angular/core';

@Injectable()
export class MediaDevicesService {
  public async addLocalAvailable(): Promise<void> {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.stop();

      const ids: string[] = [
        ...stream.getVideoTracks().map(vt => vt.getSettings().deviceId as string),
        ...stream.getAudioTracks().map(at => at.getSettings().deviceId as string)
      ];

      console.log(ids);
    } catch {}
  }
}
