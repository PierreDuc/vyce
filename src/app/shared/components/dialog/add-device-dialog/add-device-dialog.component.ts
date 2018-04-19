import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';

import { Component } from '@angular/core';

import { Store } from '@ngxs/store';

import { AddDevice } from '../../../actions/devices.action';
import { MediaDevicesService } from '../../../../core/services/media-devices.service';
import { DeviceStateModel } from '../../../states/devices.state';
import { DeviceType } from '../../../enums/device-type.enum';

interface MediaInputType {
  disabled?: boolean;
  selected?: MediaDeviceInfo;
  devices: MediaDeviceInfo[];
}

interface MediaInputs {
  audio: MediaInputType;
  video: MediaInputType;
}

@Component({
  templateUrl: './add-device-dialog.component.html',
  styleUrls: ['./add-device-dialog.component.scss']
})
export class AddDeviceDialogComponent {
  readonly inputs$: Observable<MediaInputs>;

  readonly sources: { prop: keyof MediaInputs; icon: string }[] = [
    { prop: 'audio', icon: 'mic' },
    { prop: 'video', icon: 'videocam' }
  ];

  deviceName = '';

  constructor(private readonly store: Store, private readonly md: MediaDevicesService) {
    this.inputs$ = this.md.devices$.pipe(
      map(({ audio, video }) => ({
        audio: this.filterDevices(audio),
        video: this.filterDevices(video)
      }))
    );
  }

  onSwitchClick(input: MediaInputType): void {
    input.disabled = !input.disabled;
    // input.selected = undefined;
  }

  onAddDeviceClick({ audio, video }: MediaInputs): void {
    const device: DeviceStateModel = {
      name: this.deviceName,
      audio: (!audio.disabled && audio.selected) || false,
      video: (!video.disabled && video.selected) || false
    };

    if (device.audio || device.video) {
      this.store.dispatch(new AddDevice(device));
    }
  }

  private filterDevices(devices: MediaDeviceInfo[]): MediaInputType {
    const standard: MediaDeviceInfo | undefined = devices.find(device => device.deviceId === DeviceType.Default);
    const inputType: MediaInputType = {
      selected: (standard && devices.find(i => i.groupId === standard.groupId && i !== standard)) || devices[0],
      devices: devices.filter(input => !DeviceType.includes(input.deviceId))
    };

    inputType.disabled = inputType.devices.length === 0;

    return inputType;
  }
}
