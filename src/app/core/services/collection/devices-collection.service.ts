import { Injectable } from '@angular/core';

import { DataCollectionService } from './data-collection.service';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { DeviceStateModel } from '../../../shared/states/devices.state';
import { FirebaseService } from '../../module/firebase.service';
import { Select, Store } from '@ngxs/store';
import { UserState } from '../../../shared/states/user.state';
import { Observable } from 'rxjs/index';

@Injectable()
export class DevicesCollectionService extends DataCollectionService<DeviceStateModel> {
  protected readonly dataPath: DataPath = DataPath.Devices;

  protected get subPath(): string | null {
    const subPath: string = this.store.selectSnapshot<string>(state => state.user.uid);

    if (!subPath) {
      throw new Error('Unauthorized');
    }

    return `user/${subPath}`;
  }

  @Select(UserState.uid) private readonly uid$!: Observable<string | null>;

  constructor(private readonly store: Store, fs: FirebaseService) {
    super(fs);
  }
}
