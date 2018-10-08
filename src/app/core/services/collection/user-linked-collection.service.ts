import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngxs/store';

import { FirebaseService } from '../../module/firebase/firebase.service';
import { DataCollectionService } from './data-collection.service';
import { DocumentTypedSnapshot } from '../../interface/document-data.interface';

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

  getDoc$(id: string): Observable<DocumentTypedSnapshot<T>> {
    return new Observable<DocumentTypedSnapshot<T>>(subscriber => {
      this.subs.push(this.doc(id).onSnapshot(doc => subscriber.next(doc as DocumentTypedSnapshot<T>)));
    }).pipe(takeUntil(this.authChange));
  }

  getDocs$(): Observable<DocumentTypedSnapshot<T>[]> {
    return new Observable<DocumentTypedSnapshot<T>[]>(subscriber => {
      this.subs.push(
        this.collection().onSnapshot(snapshot => subscriber.next(snapshot.docs as DocumentTypedSnapshot<T>[]))
      );
    }).pipe(takeUntil(this.authChange));
  }

  clearSubs(): void {
    this.subs.forEach(sub => sub());
    this.subs.length = 0;
  }
}
