import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { InputKind } from '../../shared/enums/input-kind.enum';
import {ShowAddDevice, ShowSnackbar} from '../../shared/actions/ui.action';
import { LocalDeviceModel } from '../../shared/states/devices.state';
import { IndexDbUserService } from './index-db-user.service';
import { UserStore } from '../../shared/enums/user-store.enum';
import { CheckLocalDevice } from '../../shared/actions/devices.action';

@Injectable()
export class MediaDevicesService {
  public readonly devices$ = new BehaviorSubject<{ video: MediaDeviceInfo[]; audio: MediaDeviceInfo[] }>({
    video: [],
    audio: []
  });

  constructor(readonly store: Store, readonly idu: IndexDbUserService) {
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
      }).catch((e) => {
        this.store.dispatch(new ShowSnackbar({
          message: 'To use this function you have to accept the access to camera and/or microphone',
          config: { politeness: 'assertive' },
          action: 'Try again'
        })).subscribe(() => this.addLocalAvailable())
      });
  }

  public async getUserMedia(deviceId: string): Promise<MediaStream | void> {
    const localDevices: string[] | null = await this.getLocalDevice(deviceId);

    if (localDevices) {
      const { video, audio } = this.devices$.getValue();

      const videoDevice = video.find(d => localDevices.includes(d.deviceId));
      const audioDevice = audio.find(d => localDevices.includes(d.deviceId));

      return navigator.mediaDevices.getUserMedia({
        video: videoDevice ? { deviceId: videoDevice.deviceId } : false,
        audio: audioDevice ? { deviceId: audioDevice.deviceId } : false
      });
    }
  }

  public getLocalDevices(): Promise<string[]> {
    return this.idu.keys(UserStore.Devices);
  }

  public getLocalDevice(deviceId: string): Promise<string[] | null> {
    return this.idu.get<string[]>(deviceId, UserStore.Devices);
  }

  public storeLocalDevice(deviceId: string, device: LocalDeviceModel): Promise<void> {
    const localDeviceIds: string[] = [];

    if (device.audio) {
      localDeviceIds.push(device.audio.deviceId);
    }
    if (device.video) {
      localDeviceIds.push(device.video.deviceId);
    }

    return this.idu.set(deviceId, localDeviceIds, UserStore.Devices);
  }

  public removeLocalDevice(deviceId: string): Promise<void> {
    return this.idu.del(deviceId, UserStore.Devices);
  }

  private updateDeviceList(): Promise<void> {
    return navigator.mediaDevices.enumerateDevices().then(devices => {
      const inputDevices = {
        audio: devices.filter(({ kind }) => kind === InputKind.Audio),
        video: devices.filter(({ kind }) => kind === InputKind.Video)
      };

      this.devices$.next(inputDevices);
      this.store.dispatch(new CheckLocalDevice());
    });
  }
}
