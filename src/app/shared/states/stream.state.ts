import {Action, Select, State, StateContext} from '@ngxs/store';

import {DevicesState} from './devices.state';
import {LoadStream, StartListenStream, StopListenStream} from '../actions/stream.action';
import { DocumentTypedSnapshot } from '../../core/interface/document-data.interface';
import {StreamCollectionService} from "../../core/services/collection/stream-collection.service";
import {StreamConnectionService} from "../../core/services/stream-connection.service";
import {merge, Observable} from "rxjs/index";
import {mergeMap} from "rxjs/operators";

export interface StreamStateModel {
  listening: boolean,
  streams: RTCSessionDescription[]
}

export interface StreamSignalData {
  streams: RTCSessionDescription[]
}

@State<StreamStateModel>({
  name: 'stream',
  defaults: {
    listening: false,
    streams: []
  }
})
export class StreamState<T extends StateContext<StreamStateModel>> {
  @Select(DevicesState.localDevices)
  private readonly localDevices$!: Observable<string[]>;

  constructor(private readonly ss: StreamCollectionService, private readonly sc: StreamConnectionService) {}

  @Action(StartListenStream)
  startListenStream({ getState }: T): void {
    this.localDevices$.pipe(
      mergeMap((locals: string[]) => merge<DocumentTypedSnapshot<StreamSignalData>>(
        ...locals.map(local => this.ss.getDoc$(local))
      ))
    ).subscribe(streamDoc => {
      const remotes = streamDoc.data().streams;
      const locals = getState().streams;

      const olds = locals.filter(local => remotes.every(remote => remote.sdp !== local.sdp));
      const news = remotes.filter(remote => locals.every(local => local.sdp !== remote.sdp));
      const next = remotes.filter(remote => locals.some(local => local.sdp === remote.sdp && local.type !== remote.sdp));


      debugger;
    });
  }

  @Action(StopListenStream)
  stopListenStream({ setState }: T, { streamId }: LoadStream): void {
    // this.ss.getDoc$(streamId).subscribe(stream => {
    //   setState(stream);
    // });
  }

  @Action(LoadStream)
  async loadStream({ setState }: T, { streamId }: LoadStream): Promise<void> {
    const session = await this.sc.startStream(streamId);

    if (session) {
      const doc = await this.ss.getDoc(streamId);
      const streams: RTCSessionDescription[] = doc.get('streams') || [];
      let stream: Partial<RTCSessionDescription> | undefined = streams.find(s => s.sdp === session.sdp);

      if (!stream) {
        stream = {sdp: session.sdp};
        streams.push(stream as RTCSessionDescription);
      }

      stream.type = session.type;

      console.log(streams);

      await doc.ref.set({streams});
    }
  }
}
