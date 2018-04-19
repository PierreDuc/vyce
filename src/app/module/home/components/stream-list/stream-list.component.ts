import { Observable } from 'rxjs/index';
import { mergeMap, map } from 'rxjs/operators';

import { Component } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { MediaDevicesService } from '../../../../core/services/media-devices.service';
import { DevicesState, DeviceStateModel } from '../../../../shared/states/devices.state';
import { AuthState } from '../../../../shared/states/auth.state';
import { ShowLogin } from '../../../../shared/actions/ui.action';

@Component({
  selector: 'vc-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class StreamListComponent {
  @Select(DevicesState) readonly devices$!: Observable<DeviceStateModel[]>;

  readonly canAddCurrent$: Observable<boolean>;

  constructor(private readonly md: MediaDevicesService, private readonly store: Store) {
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
    if (this.store.selectSnapshot(AuthState.loggedIn)) {
      this.md.addLocalAvailable();
    } else {
      this.store.dispatch(new ShowLogin());
    }
  }
}
