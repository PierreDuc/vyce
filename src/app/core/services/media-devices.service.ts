import { BehaviorSubject } from 'rxjs/index';

import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { InputKind } from '../../shared/enums/input-kind.enum';
import { ShowAddDevice } from '../../shared/actions/ui.action';

@Injectable()
export class MediaDevicesService {
  //@todo update to {video: MediaDeviceInfo[], audio: MediaDeviceInfo[]}
  public readonly devices$ = new BehaviorSubject<{ video: MediaDeviceInfo[]; audio: MediaDeviceInfo[] }>({
    video: [],
    audio: []
  });

  constructor(private readonly store: Store) {
    navigator.mediaDevices.addEventListener('devicechange', () => this.updateDeviceList());

    this.updateDeviceList();
  }

  public addLocalAvailable(): void {
    const { audio, video } = this.devices$.getValue();

    navigator.mediaDevices
      .getUserMedia({
        audio: audio.length > 0,
        video: video.length > 0
      })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());

        this.store.dispatch(new ShowAddDevice());
      });
  }

  private updateDeviceList(): void {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const inputDevices = {
        audio: devices.filter(device => device.kind === InputKind.Audio),
        video: devices.filter(device => device.kind === InputKind.Video)
      };

      this.devices$.next(inputDevices);
    });
  }
}
