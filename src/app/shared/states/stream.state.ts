import { Action, Selector, State, StateContext } from '@ngxs/store';

import { StreamConnectionService } from '../../core/services/stream-connection.service';
import { StreamStateService } from '../../core/services/state/stream-state.service';

import {
  AddMediaStream,
  StartListenStream,
  StartStream,
  StopListenStream,
  RemoveStream
} from '../actions/stream.action';

import { StreamConnectionType } from '../enums/stream-connection-type.enum';

export interface StreamModel {
  connection: StreamConnectionData;
  stream: MediaStream | null;
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
  disconnect?: boolean;
}

export interface RtcPeerConnectionData extends StreamConnectionData {
  offer?: string | null;
  answer?: string | null;
  needOffer?: boolean | null;
}

@State<StreamStateModel>({
  name: 'streams',
  defaults: {
    listening: false,
    streams: {}
  }
})
export class StreamState<T extends StateContext<StreamStateModel>> {
  constructor(private readonly ss: StreamStateService, private readonly sc: StreamConnectionService) {}

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

    streams[connection.streamId] = {
      connection,
      stream: null
    };

    this.ss.openStreamWindow(connection);

    patchState({ streams: { ...streams } });
  }

  @Action(RemoveStream)
  removeStream({ patchState, getState }: T, { connection }: RemoveStream): void {
    const streams = getState().streams;

    delete streams[connection.streamId];

    this.ss.closeStreamWindow(connection);

    patchState({ streams: { ...streams } });
  }

  @Action(AddMediaStream)
  addMediaStream({ patchState, getState }: T, { connection, stream }: AddMediaStream): void {
    const streams = getState().streams;

    streams[connection.streamId].stream = stream;

    patchState({ streams: { ...streams } });
  }
}
