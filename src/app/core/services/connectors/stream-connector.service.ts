import { Store } from '@ngxs/store';

import { StartStream } from '../../../shared/actions/stream.action';
import { StreamConnectionData } from '../../../shared/states/stream.state';
import { StreamConnectionType } from '../../../shared/enums/stream-connection-type.enum';

import { FirebaseService } from '../../module/firebase/firebase.service';

import { StreamCollectionService } from '../collection/stream-collection.service';

export abstract class StreamConnectorService<T extends StreamConnectionData> {
  public abstract readonly type: StreamConnectionType;

  protected readonly connections: T[] = [];

  protected readonly timeout = 10000;

  protected callerId?: string;

  protected constructor(protected readonly ss: StreamCollectionService, protected readonly store: Store) {}

  public isTimedOut({ timestamp }: T): boolean {
    return FirebaseService.timestamp() - timestamp > this.timeout;
  }

  abstract connect(streamId: string): T;

  abstract shouldHandleMessage(streamData: T, fromCaller: boolean): boolean;

  abstract async processMessage(data: T): Promise<T | void>;

  abstract disconnect(connection: T): void;

  abstract isAvailable(): Promise<boolean>;

  protected createConnection(streamId: string): T {
    if (!this.callerId) {
      this.callerId = this.ss.createPushId();
    }

    const streamConnection: T = {
      streamId,
      negotiationId: this.ss.createPushId(),
      callerId: this.callerId,
      type: this.type,
      timestamp: FirebaseService.timestamp()
    } as T;

    this.connections.push(streamConnection);

    this.store.dispatch(new StartStream(streamConnection));

    return streamConnection;
  }

  protected removeConnection(connection: StreamConnectionData): void {
    this.connections.splice(
      this.connections.findIndex(suspect => suspect.negotiationId === connection.negotiationId),
      1
    );
  }
}
