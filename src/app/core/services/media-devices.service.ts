import { BehaviorSubject } from 'rxjs/index';

import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { InputKind } from '../../shared/enums/input-kind.enum';
import { ShowAddDevice } from '../../shared/actions/ui.action';
import { DeviceStateModel } from '../../shared/states/devices.state';
import { IndexDbUserService } from './index-db-user.service';
import { UserStore } from '../../shared/enums/user-store.enum';

@Injectable()
export class MediaDevicesService {
  public readonly devices$ = new BehaviorSubject<{ video: MediaDeviceInfo[]; audio: MediaDeviceInfo[] }>({
    video: [],
    audio: []
  });

  constructor(private readonly store: Store, private readonly idu: IndexDbUserService) {
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

        this.updateDeviceList().then(() => this.store.dispatch(new ShowAddDevice()));
      });
  }

  public storeLocalDevice(deviceId: string, device: DeviceStateModel): Promise<void> {
    return this.idu.set(deviceId, device, UserStore.Devices);
  }

  private updateDeviceList(): Promise<void> {
    return navigator.mediaDevices.enumerateDevices().then(devices => {
      const inputDevices = {
        audio: devices.filter(({ kind }) => kind === InputKind.Audio),
        video: devices.filter(({ kind }) => kind === InputKind.Video)
      };

      this.devices$.next(inputDevices);
    });
  }
}
