import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { DataCollectionService } from './data-collection.service';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { UserStateModel } from '../../../shared/states/user.state';

@Injectable()
export class UsersCollectionService extends DataCollectionService<UserStateModel> {
  constructor(readonly af: AngularFirestore) {
    super(af);
  }

  readonly dataPath: DataPath = DataPath.Users;
}
