import { filter, first, mergeMap } from 'rxjs/operators';
import { merge, Observable } from 'rxjs/index';

import { Action, Select, Selector, State, StateContext } from '@ngxs/store';

import { DevicesState } from './devices.state';
import { AddTrack, LoadStream, StartListenStream, StopListenStream, StopStream } from '../actions/stream.action';
import { DocumentTypedSnapshot } from '../../core/interface/document-data.interface';
import { StreamCollectionService } from '../../core/services/collection/stream-collection.service';
import { StreamConnectionService } from '../../core/services/stream-connection.service';
import { FirebaseService } from '../../core/module/firebase/firebase.service';

export interface StreamModel {
  [signalId: string]: MediaStream | null;
}

export interface StreamStateModel {
  listening: boolean;
  streams: { [streamId: string]: StreamModel };
}

export interface StreamSignalData {
  offer: string | null;
  answer: string | null;
  needOffer: boolean | null;
  timestamp: number;
}

export interface StreamData {
  [key: string]: StreamSignalData;
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

  @Selector()
  static streams(state: StreamStateModel): { [streamId: string]: StreamModel } {
    return state.streams;
  }

  constructor(private readonly ss: StreamCollectionService, private readonly sc: StreamConnectionService) {}

  @Action(StartListenStream)
  startListenStream(): void {
    this.localDevices$
      .pipe(
        mergeMap((locals: string[]) =>
          merge<DocumentTypedSnapshot<StreamData>>(...locals.map(local => this.ss.getDoc$(local)))
        ),
        filter(
          streamDoc =>
            streamDoc.exists && !!streamDoc.data() && Object.values(streamDoc.data()).filter(s => !s.offer).length > 0
        )
      )
      .subscribe(async streamDoc => {
        const data: StreamData = Object.assign({}, streamDoc.data());
        const signals = Object.entries(data).filter(
          ([signalId, signal]) => FirebaseService.timestamp() - signal.timestamp < 10000 && !signal.offer
        );

        if (signals.length) {
          const newData: StreamData = {};

          for (const [signalId, signal] of signals) {
            const process: Partial<StreamSignalData> = await this.sc.processSignal(streamDoc.id, signalId, signal);

            if (Object.keys(process).length > 0) {
              newData[signalId] = { ...process, timestamp: FirebaseService.timestamp() } as StreamSignalData;
            }
          }

          streamDoc.ref.set(newData);
        }
      });
  }

  @Action(StopListenStream)
  stopListenStream({ setState }: T, { streamId }: LoadStream): void {
    // this.ss.getDoc$(streamId).subscribe(stream => {
    //   setState(stream);
    // });
  }

  @Action(StopStream)
  stopStream({ patchState, getState }: T, { signalId }: StopStream): void {
    const streams = getState().streams;
    const [streamId] = Object.entries<StreamModel>(streams).find(
      ([s, signal]) => Object.keys(signal).includes(signalId)
    ) || [void 0];

    if (streamId) {
      this.sc.stopStream(signalId, streamId);

      streams[streamId][signalId] = null;
      patchState({ streams: Object.assign({}, streams) });

    }
  }

  @Action(AddTrack)
  addTrack({ patchState, getState }: T, { signalId, streamId, track }: AddTrack): void {
    const streams = getState().streams;

    streams[streamId][signalId] = track;

    patchState({ streams: Object.assign({}, streams) });
  }

  @Action(LoadStream)
  async loadStream({ patchState, getState }: T, { signalId, streamId }: LoadStream): Promise<void> {
    const doc = await this.ss.getDoc(streamId);
    const signal = signalId || this.ss.createPushId();

    const streams = getState().streams;

    if (!streams[streamId]) {
      streams[streamId] = {};
    }

    streams[streamId][signal] = null;
    patchState({ streams: Object.assign({}, streams) });

    if (!doc.exists) {
      await doc.ref.set({});
    }

    await doc.ref.update({ [signal]: { needOffer: true, timestamp: FirebaseService.timestamp() } });

    this.ss
      .getDoc$(streamId)
      .pipe(
        filter(streamDoc => !!streamDoc.data()[signal] && !!streamDoc.data()[signal].offer),
        first()
      )
      .subscribe(async (streamDoc: DocumentTypedSnapshot<StreamData>) => {
        const offer = streamDoc.data()[signal];
        const process = await this.sc.processSignal(streamId, signal, offer);

        process.timestamp = FirebaseService.timestamp();

        streamDoc.ref.set({
          [signal]: process
        });
      });

  }
}
