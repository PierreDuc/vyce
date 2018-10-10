import { filter, mergeMap, skip, takeUntil } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';

import { Inject, Injectable } from '@angular/core';

import { Select } from '@ngxs/store';

import { FirebaseService } from '../module/firebase/firebase.service';
import { DevicesState } from '../../shared/states/devices.state';
import { StreamConnectionData } from '../../shared/states/stream.state';
import { StreamConnectorService } from './connectors/stream-connector.service';
import { StreamCollectionService } from './collection/stream-collection.service';
import { DocumentTypedSnapshot } from '../interface/document-data.interface';

@Injectable()
export class StreamConnectionService {
  @Select(DevicesState.localDevices) private readonly localDevices$!: Observable<string[]>;

  private readonly stopStream$ = new Subject<void>();
  private readonly disconnectStream$ = new Subject<StreamConnectionData>();

  constructor(
    @Inject(StreamConnectorService) private readonly connectors: StreamConnectorService<StreamConnectionData>[],
    private readonly ss: StreamCollectionService
  ) {}

  public async connectToStream(streamId: string): Promise<StreamConnectionData> {
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

    throw new Error();
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
