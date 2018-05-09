import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { LocalDeviceModel } from '../../../shared/states/devices.state';

import { FirebaseService } from '../../module/firebase/firebase.service';

import { UserLinkedCollectionService } from './user-linked-collection.service';

@Injectable()
export class DevicesCollectionService extends UserLinkedCollectionService<LocalDeviceModel> {
  protected readonly dataPath: DataPath = DataPath.Devices;

  constructor(store: Store, fs: FirebaseService) {
    super(store, fs);
  }
}
