import { Injectable } from '@angular/core';

import { DataCollectionService } from './data-collection.service';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { UserStateModel } from '../../../shared/states/user.state';
import { FirebaseService } from '../../module/firebase.service';

@Injectable()
export class UsersCollectionService extends DataCollectionService<UserStateModel> {
  constructor(readonly fs: FirebaseService) {
    super(fs);
  }

  dataPath: DataPath = DataPath.Users;
}
