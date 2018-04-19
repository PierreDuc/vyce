import { Store } from '@ngxs/store';

import { FirebaseService } from '../../module/firebase.service';
import { DataCollectionService } from './data-collection.service';

export abstract class UserLinkedCollectionService<T extends object> extends DataCollectionService<T> {
  protected get subPath(): string | null {
    const subPath: string = this.store.selectSnapshot<string>(state => state.user.uid);

    if (!subPath) {
      throw new Error('Unauthorized');
    }

    return `user/${subPath}`;
  }

  protected constructor(private readonly store: Store, fs: FirebaseService) {
    super(fs);
  }
}
