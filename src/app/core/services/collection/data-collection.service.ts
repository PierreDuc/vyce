import { DocumentSnapshot, DocumentReference, CollectionReference } from '@firebase/firestore-types';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { FirebaseService } from '../../module/firebase.service';
import {Observable} from "rxjs/index";

export abstract class DataCollectionService<T extends object> {
  protected abstract dataPath: DataPath;

  protected subPath: string | null = null;

  protected streams$ = new Map<string, Observable<DocumentSnapshot>>();

  protected constructor(protected readonly fs: FirebaseService) {}

  set(data: T, id: string): Promise<void> {
    return this.doc(id).set(data);
  }

  add(data: T): Promise<DocumentReference> {
    console.log(data);

    return this.collection().add(data);
  }

  update(id: string, data: Partial<T>): Promise<void> {
    return this.doc(id).update(data);
  }

  get(id: string): Promise<DocumentSnapshot> {
    return this.doc(id).get();
  }

  get$(id: string): Observable<DocumentSnapshot> {
    if (!this.streams$.has(id)) {
      this.streams$.set(id, new Observable((subscriber) => {
        this.doc(id).onSnapshot((snapshot) => {
          subscriber.next(snapshot);
        });
      }));
    }

    return this.streams$.get(id) as Observable<DocumentSnapshot>;
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

    return this.fs.firestore().collection(`/${path}`);
  }
}
