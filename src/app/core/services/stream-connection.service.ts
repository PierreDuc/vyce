import { filter, mergeMap, skip, takeUntil } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';

import { Inject, Injectable } from '@angular/core';

import {Select, Store} from '@ngxs/store';

import { FirebaseService } from '../module/firebase/firebase.service';
import { DevicesState } from '../../shared/states/devices.state';
import { StreamConnectionData } from '../../shared/states/stream.state';
import { StreamConnectorService } from './connectors/stream-connector.service';
import { StreamCollectionService } from './collection/stream-collection.service';
import { DocumentTypedSnapshot } from '../interface/document-data.interface';
import {ShowSnackbar} from "../../shared/actions/ui.action";

@Injectable()
export class StreamConnectionService {
  @Select(DevicesState.localDevices) private readonly localDevices$!: Observable<string[]>;

  private readonly stopStream$ = new Subject<void>();
  private readonly disconnectStream$ = new Subject<StreamConnectionData>();

  constructor(
    @Inject(StreamConnectorService) readonly connectors: StreamConnectorService<StreamConnectionData>[],
    readonly ss: StreamCollectionService, readonly store: Store
  ) {}

  public async connectToStream(streamId: string): Promise<StreamConnectionData | void> {
    for (const connector of this.connectors) {
      try {
        if (await connector.isAvailable()) {
          const connection = connector.connect(streamId);

          this.ss
            .getDoc$(streamId)
            .pipe(
              takeUntil(this.stopStream$),
              takeUntil(
                this.disconnectStream$.pipe(filter(({ negotiationId }) => negotiationId === connection.negotiationId))
              ),
              filter(streamDataDoc => streamDataDoc.exists),
              skip(1)
            )
            .subscribe(streamDataDoc => this.processMessage(streamDataDoc, true));

          await this.ss.set(connection, streamId);

          return connection;
        }
      } catch {}
    }

    this.store.dispatch(new ShowSnackbar('No connections available'));
  }

  public startListening(): void {
    this.localDevices$
      .pipe(
        takeUntil(this.stopStream$),
        mergeMap((locals: string[]) => merge(...locals.map(local => this.ss.getDoc$(local)))),
        filter(streamDataDoc => streamDataDoc.exists)
      )
      .subscribe(streamDataDoc => this.processMessage(streamDataDoc, false));
  }

  public stopListening(): void {
    this.stopStream$.next();
  }

  public stopStream(connection: StreamConnectionData): void {
    const connector = this.connectors.find(c => c.type === connection.type);

    if (connector) {
      connector.disconnect(connection);
      this.disconnectStream$.next(connection);

      connection.disconnect = true;

      this.ss.set(connection, connection.streamId);
    }
  }

  private async processMessage(
    streamDataDoc: DocumentTypedSnapshot<StreamConnectionData>,
    fromCaller: boolean
  ): Promise<void> {
    const streamData = streamDataDoc.data();
    const connector = this.connectors.find(c => c.type === streamData.type);

    let response: StreamConnectionData | void;

    if (connector && connector.shouldHandleMessage(streamData, fromCaller)) {
      if (!connector.isTimedOut(streamData)) {
        response = await connector.processMessage(streamData);
      }

      if (response) {
        streamDataDoc.ref.set({
          ...response,
          timestamp: FirebaseService.timestamp()
        });
      } else {
        streamDataDoc.ref.delete();
      }
    }
  }
}
