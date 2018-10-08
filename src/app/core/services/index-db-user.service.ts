import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { del, get, keys, set, Store as IdbStore } from 'idb-keyval';

import { UserStore } from '../../shared/enums/user-store.enum';
import { AppState } from '../interface/app-state.interface';

@Injectable()
export class IndexDbUserService {
  constructor(private readonly store: Store) {}

  readonly db: string = 'vyce';

  readonly stores: Map<UserStore, IdbStore> = new Map<UserStore, IdbStore>();

  get<T>(key: string, store: UserStore): Promise<T | null> {
    const uid = this.uid();

    if (uid == null) {
      return Promise.resolve(null);
    }

    return get<T>(uid + key, this.getStore(store));
  }

  set<T>(key: string, value: T, store: UserStore): Promise<void> {
    const uid = this.uid();

    if (uid == null) {
      return Promise.resolve();
    }

    return set(uid + key, value, this.getStore(store));
  }

  del(key: string, store: UserStore): Promise<void> {
    const uid = this.uid();

    if (uid == null) {
      return Promise.resolve();
    }

    return del(uid + key, this.getStore(store));
  }

  async keys(store: UserStore): Promise<string[]> {
    const uid = this.uid();

    if (uid == null) {
      return Promise.resolve([]);
    }

    const ids = await keys(this.getStore(store));

    return (ids.filter(id => typeof id === 'string') as string[]).map(id => id.replace(uid, ''));
  }

  private uid(): string | null {
    return this.store.selectSnapshot((state: AppState) => state.user.uid);
  }

  private getStore(store: UserStore): IdbStore {
    if (!this.stores.has(store)) {
      this.stores.set(store, new IdbStore(this.db, store));
    }

    return this.stores.get(store) as IdbStore;
  }
}
