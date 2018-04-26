import { mergeMap } from 'rxjs/operators';
import { merge, Observable } from 'rxjs/index';

import { Action, Select, Selector, State, StateContext } from '@ngxs/store';

import { DevicesState } from './devices.state';
import { AddTrack, LoadStream, OpenStream, StartListenStream, StopListenStream } from '../actions/stream.action';
import { DocumentTypedSnapshot } from '../../core/interface/document-data.interface';
import { StreamCollectionService } from '../../core/services/collection/stream-collection.service';
import { StreamConnectionService } from '../../core/services/stream-connection.service';

export interface StreamStateModel {
  listening: boolean;
  streams: { [streamId: string]: MediaStreamTrack | null };
}

export interface StreamSignalData {
  offers: string[];
  answers: {
    [key: string]: string;
  };
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
  startListenStream({ getState }: T): void {
    this.localDevices$
      .pipe(
        mergeMap((locals: string[]) =>
          merge<DocumentTypedSnapshot<StreamSignalData>>(...locals.map(local => this.ss.getDoc$(local)))
        )
      )
      .subscribe(async streamDoc => {
        const offers = streamDoc.data().offers;

        if (offers.length) {
          streamDoc.ref.update({ offers: [] });

          const answers: { [key: string]: string } = {};

          await Promise.all(
            offers.map(async offer => {
              answers[offer] = await this.sc.getAnswer(streamDoc.id, offer);
            })
          );

          streamDoc.ref.update({ answers });
        }
      });
  }

  @Action(StopListenStream)
  stopListenStream({ setState }: T, { streamId }: LoadStream): void {
    // this.ss.getDoc$(streamId).subscribe(stream => {
    //   setState(stream);
    // });
  }

  @Action(AddTrack)
  addTrack({ patchState, getState }: T, { streamId, track }: AddTrack): void {
    const streams = getState().streams;
    streams[streamId] = track;
    patchState({ streams });
  }

  @Action(LoadStream)
  async loadStream({ patchState }: T, { streamId }: LoadStream): Promise<void> {
    const offer = await this.sc.getOffer(streamId);

    if (offer) {
      const doc = await this.ss.getDoc(streamId);
      const offers: string[] = doc.get('offers') || [];

      offers.push(offer);

      await doc.ref.update({ offers });

      const sub = this.ss.getDoc$(streamId).subscribe(streamDoc => {
        const answers = streamDoc.data().answers;

        if (answers && answers[offer]) {
          const answer = answers[offer];

          sub.unsubscribe();
          delete answers[offer];

          streamDoc.ref.update({ answers });

          this.sc.setConnection(streamId, answer);
        }
      });
    }
  }
}
