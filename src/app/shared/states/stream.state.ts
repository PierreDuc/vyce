import { Observable } from 'rxjs/index';

import { Action, Select, Selector, State, StateContext } from '@ngxs/store';

import { DevicesState } from './devices.state';
import {
  AddMediaStream,
  StartListenStream,
  StartStream,
  StopListenStream,
  RemoveStream
} from '../actions/stream.action';
import { StreamCollectionService } from '../../core/services/collection/stream-collection.service';
import { StreamConnectionService } from '../../core/services/stream-connection.service';
import { StreamConnectionType } from '../enums/stream-connection-type.enum';

export interface StreamModel {
  [negotiationId: string]: {
    connection: StreamConnectionData;
    stream: MediaStream | null;
  };
}

export interface StreamStateModel {
  listening: boolean;
  streams: { [streamId: string]: StreamModel };
}

export interface StreamConnectionData {
  type: StreamConnectionType;
  callerId: string;
  streamId: string;
  negotiationId: string;
  timestamp: number;
}

export interface RtcPeerConnectionData extends StreamConnectionData {
  offer?: string | null;
  answer?: string | null;
  needOffer?: boolean | null;
}

@State<StreamStateModel>({
  name: 'stream',
  defaults: {
    listening: false,
    streams: {}
  }
})
export class StreamState<T extends StateContext<StreamStateModel>> {
  @Select(DevicesState.localDevices) private readonly localDevices$!: Observable<string[]>;

  constructor(private readonly ss: StreamCollectionService, private readonly sc: StreamConnectionService) {}

  @Selector()
  static streams(state: StreamStateModel): { [streamId: string]: StreamModel } {
    return state.streams;
  }

  @Action(StartListenStream)
  startListenStream({ patchState, getState }: T): void {
    if (!getState().listening) {
      this.sc.startListening();

      patchState({ listening: true });
    }
  }

  @Action(StopListenStream)
  stopListenStream({ patchState, getState }: T): void {
    if (getState().listening) {
      this.sc.stopListening();

      patchState({ listening: false });
    }
  }

  @Action(StartStream)
  startStream({ patchState, getState }: T, { connection }: StartStream): void {
    const streams = getState().streams;

    if (!streams[connection.streamId]) {
      streams[connection.streamId] = {};
    }

    streams[connection.streamId][connection.negotiationId] = {
      connection,
      stream: null
    };

    patchState({ streams: { ...streams } });
  }

  @Action(RemoveStream)
  removeStream({ patchState, getState }: T, { connection }: RemoveStream): void {
    const streams = getState().streams;

    delete streams[connection.streamId][connection.negotiationId];

    patchState({ streams: { ...streams } });
  }

  @Action(AddMediaStream)
  addMediaStream({ patchState, getState }: T, { connection, stream }: AddMediaStream): void {
    const streams = getState().streams;

    streams[connection.streamId][connection.negotiationId].stream = stream;

    patchState({ streams: { ...streams } });
  }
}
