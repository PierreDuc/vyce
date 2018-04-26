import { mergeMap } from 'rxjs/operators';
import { merge, Observable } from 'rxjs/index';

import { Action, Select, Selector, State, StateContext } from '@ngxs/store';

import { DevicesState } from './devices.state';
import {AddTrack, LoadStream, OpenStream, StartListenStream, StopListenStream, StopStream} from '../actions/stream.action';
import { DocumentTypedSnapshot } from '../../core/interface/document-data.interface';
import { StreamCollectionService } from '../../core/services/collection/stream-collection.service';
import { StreamConnectionService } from '../../core/services/stream-connection.service';

export interface StreamStateModel {
  listening: boolean;
  streams: { [streamId: string]: MediaStreamTrack | null };
}

export interface StreamSignalData {
  offer: string;
  answer: string;
  needOffer: boolean;
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
  static streams(state: StreamStateModel): { [streamId: string]: MediaStreamTrack | null } {
    return state.streams;
  }

  constructor(private readonly ss: StreamCollectionService, private readonly sc: StreamConnectionService) {}

  @Action(StartListenStream)
  startListenStream(): void {
    this.localDevices$
      .pipe(
        mergeMap((locals: string[]) =>
          merge<DocumentTypedSnapshot<StreamSignalData>>(...locals.map(local => this.ss.getDoc$(local)))
        )
      )
      .subscribe(async streamDoc => {
        if (streamDoc.exists) {
          const {needOffer, answer} = streamDoc.data();
          streamDoc.ref.set({});

          if (needOffer) {
            const offer = await this.sc.getOffer(streamDoc.id);
            streamDoc.ref.set({offer});
          } else if (answer) {
            this.sc.setConnection(streamDoc.id, answer);
          }
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
  stopStream(ctx: T, { streamId }: StopStream): void {
    this.sc.stopStream(streamId);
  }

  @Action(AddTrack)
  addTrack({ patchState, getState }: T, { streamId, track }: AddTrack): void {
    const streams = getState().streams;
    streams[streamId] = track;

    patchState({ streams: Object.assign({}, streams) });
  }

  @Action(LoadStream)
  async loadStream({ patchState }: T, { streamId }: LoadStream): Promise<void> {
    const doc = await this.ss.getDoc(streamId);

    if (!doc.exists) {
      await doc.ref.set({});
    }

    doc.ref.update({needOffer: true});

    const sub = this.ss.getDoc$(streamId).subscribe(async streamDoc => {
      const offer = streamDoc.data().offer;

      if (offer) {
        sub.unsubscribe();
        streamDoc.ref.set({});

        const answer = await this.sc.getAnswer(streamId, offer);

        streamDoc.ref.set({answer});
      }
    });
  }
}
