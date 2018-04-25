import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Select, Store } from '@ngxs/store';

import { StreamState } from '../../../shared/states/stream.state';
import { LoadStream } from '../../../shared/actions/stream.action';
import { LocalDeviceModel } from '../../../shared/states/devices.state';

@Injectable()
export class StreamResolve implements Resolve<LocalDeviceModel | null> {
  @Select(StreamState) private readonly streamState$!: Observable<LocalDeviceModel>;

  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LocalDeviceModel> | null {
    const streamId: string | null = route.paramMap.get('streamId');

    if (streamId) {
      this.store.dispatch(new LoadStream(streamId));

      return this.streamState$.pipe(first());
    }

    return null;
  }
}
