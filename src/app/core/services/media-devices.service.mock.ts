import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

import { LocalDeviceModel } from '../../shared/states/devices.state';

@Injectable()
export class MockMediaDevicesService {
  public readonly devices$ = new BehaviorSubject<{ video: MediaDeviceInfo[]; audio: MediaDeviceInfo[] }>({
    video: [],
    audio: []
  });

  constructor() {}

  public addLocalAvailable(): void {}

  public async getUserMedia(deviceId: string): Promise<MediaStream | void> {}

  public getLocalDevices(): Promise<string[]> {
    return Promise.resolve([]);
  }

  public getLocalDevice(deviceId: string): Promise<string[] | null> {
    return Promise.resolve([]);
  }

  public storeLocalDevice(deviceId: string, device: LocalDeviceModel): Promise<void> {
    return Promise.resolve();
  }

  public removeLocalDevice(deviceId: string): Promise<void> {
    return Promise.resolve();
  }
}
