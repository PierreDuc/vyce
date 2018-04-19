import { Observable } from 'rxjs/index';

import { DocumentSnapshot, DocumentReference, CollectionReference, DocumentData } from '@firebase/firestore-types';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { FirebaseService } from '../../module/firebase.service';

export abstract class DataCollectionService<T extends object> {
  protected abstract readonly dataPath: DataPath;

  protected streams$ = new Map<string, Observable<DocumentSnapshot>>();

  protected constructor(protected readonly fs: FirebaseService) {}

  protected get subPath(): string | null {
    return null;
  }

  set(data: T, id: string): Promise<void> {
    return this.doc(id).set(data);
  }

  add(data: T): Promise<DocumentReference> {
    return this.collection().add(data);
  }

  update(id: string, data: Partial<T>): Promise<void> {
    return this.doc(id).update(data);
  }

  getDoc(id: string): Promise<DocumentSnapshot> {
    return this.doc(id).get();
  }

  getDoc$(id: string): Observable<DocumentSnapshot> {
    if (!this.streams$.has(id)) {
      this.streams$.set(
        id,
        new Observable(subscriber => {
          this.doc(id).onSnapshot(snapshot => {
            subscriber.next(snapshot);
          });
        })
      );
    }

    return this.streams$.get(id) as Observable<DocumentSnapshot>;
  }

  getDocs(): Promise<DocumentData[]> {
    return this.collection()
      .get()
      .then(snapshot => snapshot.docs.map(doc => doc.data()));
  }

  getDocs$(): Observable<T[]> {
    return new Observable(subscriber => {
      this.collection().onSnapshot(snapshot => subscriber.next(snapshot.docs.map(doc => doc.data() as T)));
    });
  }

  createPushId(): string {
    return this.collection().doc().id;
  }

  private doc(path: string): DocumentReference {
    if (this.subPath) {
      path += `${this.subPath}/`;
    }

    return this.fs.firestore().doc(`/${this.dataPath}/${path}`);
  }

  private collection(): CollectionReference {
    let path: string = this.dataPath;

    if (this.subPath) {
      path += `/${this.subPath}`;
    }

    return this.fs.firestore().collection(`/${path}/`);
  }
}
