import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddDevice } from '../../../actions/devices.action';

@Component({
  templateUrl: './add-device-dialog.component.html',
  styleUrls: ['./add-device-dialog.component.scss']
})
export class AddDeviceDialogComponent implements OnInit {
  disableVideo = false;
  disableAudio = false;

  videoDevice: MediaDeviceInfo | undefined;
  videoDevices: MediaDeviceInfo[] = [];

  audioDevice: MediaDeviceInfo | undefined;
  audioDevices: MediaDeviceInfo[] = [];

  constructor(private readonly store: Store) {}

  async ngOnInit(): Promise<void> {
    const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
    const defaultAudio: MediaDeviceInfo | undefined = devices.find(
      device => device.deviceId === 'default' && device.kind === 'audioinput'
    );
    const defaultVideo: MediaDeviceInfo | undefined = devices.find(
      device => device.deviceId === 'default' && device.kind === 'videoinput'
    );
    const nonDefaults: MediaDeviceInfo[] = devices.filter(
      device => device.deviceId !== 'default' && device.deviceId !== 'communications'
    );
    this.audioDevices = nonDefaults.filter(device => device.kind === 'audioinput');
    this.videoDevices = nonDefaults.filter(device => device.kind === 'videoinput');

    if (defaultAudio) {
      this.audioDevice = this.audioDevices.find(device => device.groupId === defaultAudio.groupId);
    }

    if (defaultVideo) {
      this.videoDevice = this.videoDevices.find(device => device.groupId === defaultVideo.groupId);
    }

    if (!this.audioDevice && this.audioDevices.length === 1) {
      this.audioDevice = this.audioDevices[0];
    }

    if (!this.videoDevice && this.videoDevices.length === 1) {
      this.videoDevice = this.videoDevices[0];
    }
  }

  onSwitchAudioClick(): void {
    this.disableAudio = !this.disableAudio;
    this.audioDevice = undefined;
  }

  onSwitchVideoClick(): void {
    this.disableVideo = !this.disableVideo;
    this.videoDevice = undefined;
  }

  onAddDeviceClick(): void {
    const devices: MediaDeviceInfo[] = [];

    if (!this.disableAudio && this.audioDevice) {
      devices.push(this.audioDevice);
    }

    if (!this.disableVideo && this.videoDevice) {
      devices.push(this.videoDevice);
    }

    if (devices.length > 0) {
      this.store.dispatch(new AddDevice(devices));
    }
  }
}
