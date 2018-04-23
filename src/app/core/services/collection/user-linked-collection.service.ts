import { Observable, Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngxs/store';

import { FirebaseService } from '../../module/firebase.service';
import { DataCollectionService } from './data-collection.service';

export abstract class UserLinkedCollectionService<T extends object> extends DataCollectionService<T> {
  protected get subPath(): string | undefined {
    const subPath: string = this.store.selectSnapshot<string>(state => state.user.uid);

    if (!subPath) {
      throw new Error('Unauthorized');
    }

    return `user/${subPath}`;
  }

  protected constructor(private readonly store: Store, fs: FirebaseService) {
    super(fs);

    this.authChange.subscribe(() => this.clearSubs());
    fs.auth().onAuthStateChanged(() => this.authChange.next());
  }

  private readonly subs: (() => void)[] = [];

  private readonly authChange = new Subject<void>();

  getDocs$(): Observable<T[]> {
    return new Observable<T[]>(subscriber => {
      this.subs.push(
        this.collection().onSnapshot(snapshot => subscriber.next(snapshot.docs.map(doc => doc.data() as T)))
      );
    }).pipe(takeUntil(this.authChange));
  }

  clearSubs(): void {
    this.subs.forEach(sub => sub());
    this.subs.length = 0;
  }
}
