import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';

import {Component, Input} from '@angular/core';

import {Select, Store} from '@ngxs/store';

import {AddLocalDevice, CheckLocalDevice} from '../../../actions/devices.action';
import { MediaDevicesService } from '../../../../core/services/media-devices.service';
import {DevicesState, LocalDeviceModel} from '../../../states/devices.state';
import { DeviceType } from '../../../enums/device-type.enum';
import {LocalDeviceState} from "../../../enums/local-device-state.enum";

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

  readonly states = LocalDeviceState;

  @Input('input')
  deviceId?: string;

  @Select(DevicesState.localDeviceState)
  localDeviceState$!: LocalDeviceState;

  deviceName = '';

  constructor(private readonly store: Store, private readonly md: MediaDevicesService) {
    this.inputs$ = this.md.devices$.pipe(
      map(({ audio, video }) => ({
        audio: this.filterDevices(audio),
        video: this.filterDevices(video)
      }))
    );
  }

  ngOnInit(): void {
    if (this.deviceId) {
    }
  }

  async onAddDeviceClick({ audio, video }: MediaInputs, state: LocalDeviceState): Promise<void> {
    await this.removeLocalDevice(state);

    const device: LocalDeviceModel = {
      name: this.deviceName,
      audio: (!audio.disabled && audio.selected) || false,
      video: (!video.disabled && video.selected) || false
    };

    if (device.audio || device.video) {
      this.store.dispatch(new AddLocalDevice(device));
    }
  }

  onDeleteClick(state: LocalDeviceState): void {
    this.removeLocalDevice(state).then(() => this.store.dispatch(new CheckLocalDevice()));
  }

  private async removeLocalDevice(state: LocalDeviceState): Promise<void> {
    if (state === LocalDeviceState.LocalNotSaved && this.deviceId) {
      this.md.removeLocalDevice(this.deviceId).then(() => this.store.dispatch(new CheckLocalDevice()));
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
