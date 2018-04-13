import { Injectable } from '@angular/core';

import { DataCollectionService } from './data-collection.service';

import { DataPath } from '../../../shared/enums/data-path.enum';
import {DeviceStateModel} from "../../../shared/states/devices.state";
import { FirebaseService } from '../../module/firebase.service';
import {Store} from "@ngxs/store";

@Injectable()
export class DevicesCollectionService extends DataCollectionService<DeviceStateModel> {

  protected dataPath: DataPath = DataPath.Devices;

  protected get subPath(): string | null {
    if (!this._subPath) {
      throw new Error('Unauthorized');
    }

    return this._subPath;
  }

  protected set subPath(subPath: string | null) {
    this._subPath = subPath;
  }

  private _subPath: string | null = null;

  constructor(private readonly store: Store, protected readonly fs: FirebaseService) {
    super(fs);

    store.select<string | null>(state => state.user.id).subscribe(id => this.subPath = id);
  }
}
