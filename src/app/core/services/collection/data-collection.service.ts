import { Observable } from 'rxjs/index';

import { DocumentReference, CollectionReference } from '@firebase/firestore-types';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { FirebaseService } from '../../module/firebase/firebase.service';
import { DocumentTypedSnapshot } from '../../interface/document-data.interface';

export abstract class DataCollectionService<T extends object> {
  protected abstract readonly dataPath: DataPath;

  protected subPath: string | undefined;

  protected constructor(protected readonly fs: FirebaseService) {}

  set(data: T, id: string): Promise<void> {
    return this.doc(id).set(data);
  }

  add(data: T): Promise<DocumentReference> {
    return this.collection().add(data);
  }

  update(id: string, data: Partial<T>): Promise<void> {
    return this.doc(id).update(data);
  }

  getDoc(id: string): Promise<DocumentTypedSnapshot<T>> {
    return this.doc(id).get() as Promise<DocumentTypedSnapshot<T>>;
  }

  delete(id: string): Promise<void> {
    return this.doc(id).delete();
  }

  getDoc$(id: string): Observable<DocumentTypedSnapshot<T>> {
    return new Observable(subscriber => {
      this.doc(id).onSnapshot(doc => subscriber.next(doc as DocumentTypedSnapshot<T>));
    });
  }

  getDocs$(): Observable<DocumentTypedSnapshot<T>[]> {
    return new Observable(subscriber => {
      this.collection().onSnapshot(snapshot =>
        subscriber.next(snapshot.docs.map(doc => doc.data() as DocumentTypedSnapshot<T>))
      );
    });
  }

  createPushId(): string {
    return this.collection().doc().id;
  }

  protected getPath(id: string = ''): string {
    return '/' + [this.dataPath, this.subPath, id].filter(p => p).join('/');
  }

  protected doc(id: string): DocumentReference {
    return this.fs.firestore().doc(this.getPath(id));
  }

  protected collection(): CollectionReference {
    return this.fs.firestore().collection(this.getPath());
  }
}
