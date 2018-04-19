import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import {del, get, set, Store as IdbStore} from 'idb-keyval';

import { UserStore } from '../../shared/enums/user-store.enum';

@Injectable()
export class IndexDbUserService {
  constructor(private readonly store: Store) {}

  readonly db: string = 'vyce';

  readonly stores: Map<UserStore, IdbStore> = new Map<UserStore, IdbStore>();

  get<T>(key: string, store: UserStore): Promise<T | null> {
    const uid: string | null = this.uid();

    if (!uid) {
      return Promise.resolve(null);
    }

    return get<T>(uid + key, this.getStore(store));
  }

  set(key: string, value: any, store: UserStore): Promise<void> {
    const uid: string | null = this.uid();

    if (!uid) {
      return Promise.resolve();
    }

    return set(uid + key, value, this.getStore(store));
  }

  del(key: string, store: UserStore): Promise<void> {
    const uid: string | null = this.uid();

    if (!uid) {
      return Promise.resolve();
    }

    return del(uid + key, this.getStore(store));
  }

  private uid(): string | null {
    return this.store.selectSnapshot<string>(state => state.user.uid);
  }

  private getStore(store: UserStore): IdbStore {
    if (!this.stores.has(store)) {
      this.stores.set(store, new IdbStore(this.db, store));
    }

    return this.stores.get(store) as IdbStore;
  }
}
