import { Observable } from 'rxjs/index';
import { mergeMap, map } from 'rxjs/operators';

import { Component } from '@angular/core';

import { Select } from '@ngxs/store';

import { MediaDevicesService } from '../../../../core/services/media-devices.service';
import { DevicesState, DeviceStateModel } from '../../../../shared/states/devices.state';

@Component({
  selector: 'vc-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class StreamListComponent {
  @Select(DevicesState) readonly devices$!: Observable<DeviceStateModel[]>;

  readonly canAddCurrent$: Observable<boolean>;

  constructor(private readonly md: MediaDevicesService) {
    this.canAddCurrent$ = this.devices$.pipe(
      mergeMap(added =>
        this.md.devices$.pipe(
          map(devices =>
            [...devices.audio, ...devices.video].every(device =>
              added.every(
                ({ audio, video }) =>
                  (!audio || audio.deviceId !== device.deviceId) && (!video || video.deviceId !== device.deviceId)
              )
            )
          )
        )
      )
    );
  }

  onAddCurrentClick(): void {
    this.md.addLocalAvailable();
  }
}
