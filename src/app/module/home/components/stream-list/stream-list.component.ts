import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';

import { Component } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { MediaDevicesService } from '../../../../core/services/media-devices.service';
import { DevicesState, LocalDeviceModel } from '../../../../shared/states/devices.state';
import { AuthState } from '../../../../shared/states/auth.state';
import { ShowLogin } from '../../../../shared/actions/ui.action';
import { LocalDeviceState } from '../../../../shared/enums/local-device-state.enum';
import { DocumentTypedSnapshot } from '../../../../core/interface/document-data.interface';

@Component({
  selector: 'vc-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class StreamListComponent {
  @Select(DevicesState.devices) readonly devices$!: Observable<DocumentTypedSnapshot<LocalDeviceModel>[]>;
  @Select(DevicesState.localDeviceState) readonly localState$!: Observable<LocalDeviceState>;

  readonly canAddCurrent$: Observable<boolean>;

  constructor(private readonly md: MediaDevicesService, private readonly store: Store) {
    this.canAddCurrent$ = this.localState$.pipe(map(state => state === LocalDeviceState.NotLinked));
  }

  onAddCurrentClick(): void {
    if (this.store.selectSnapshot(AuthState.loggedIn)) {
      this.md.addLocalAvailable();
    } else {
      this.store.dispatch(new ShowLogin());
    }
  }
}
