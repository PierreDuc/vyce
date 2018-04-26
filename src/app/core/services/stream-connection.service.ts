import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {AddTrack, OpenStream, StopStream} from '../../shared/actions/stream.action';

@Injectable()
export class StreamConnectionService {
  private readonly streams = new Map<
    string,
    {
      source: RTCPeerConnection | undefined;
      dest: RTCPeerConnection | undefined;
    }
  >();

  constructor(private readonly store: Store) {}

  public async getOffer(streamId: string): Promise<string> {
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    const pc = this.getSourceStreamConnection(streamId);

    pc.addStream(stream);

    await pc.setLocalDescription(await pc.createOffer());
    return (pc.localDescription && pc.localDescription.sdp) || '';
  }

  public async getAnswer(streamId: string, sdp: string): Promise<string> {
    const pc = this.getDestStreamConnection(streamId);

    await pc.setRemoteDescription(
      new RTCSessionDescription({
        sdp,
        type: 'offer'
      })
    );
    await pc.setLocalDescription(await pc.createAnswer());

    return (pc.localDescription && pc.localDescription.sdp) || '';
  }

  public stopStream(streamId: string): void {
    const streams = this.streams.get(streamId);

    console.log(streams);

    if (streams) {
      if (streams.dest) {
        streams.dest.close();
      }
      if (streams.source) {
        streams.source.close();
      }
    }
  }

  public setConnection(streamId: string, sdp: string): Promise<void> {
    const pc = this.getSourceStreamConnection(streamId);

    return pc.setRemoteDescription(
      new RTCSessionDescription({
        sdp,
        type: 'answer'
      })
    );
  }

  private getSourceStreamConnection(streamId: string): RTCPeerConnection {
    return this.getStreamConnection(streamId, 'source');
  }

  private getDestStreamConnection(streamId: string): RTCPeerConnection {
    return this.getStreamConnection(streamId, 'dest');
  }

  private getStreamConnection(streamId: string, key: 'source' | 'dest'): RTCPeerConnection {
    let streams = this.streams.get(streamId);
    let pc: RTCPeerConnection | undefined;

    if (!streams) {
      streams = { source: undefined, dest: undefined };
    }

    pc = streams[key];

    if (!pc) {
      pc = new RTCPeerConnection({});

      pc.addEventListener('track', (e: any) => {
        this.store.dispatch(new AddTrack(streamId, e.streams[0]));
      });

      pc.addEventListener('close', () => {
        console.log('close', key);
        if (streams) {
          delete streams[key];
          this.streams.set(streamId, streams);
        }
        if (pc) {
          pc.getLocalStreams().forEach(stream => stream.getTracks().forEach(track => track.stop()));
          pc.getRemoteStreams().forEach(stream => stream.getTracks().forEach(track => track.stop()));
        }

        this.store.dispatch(new StopStream(streamId));
      });

      streams[key] = pc;

      this.streams.set(streamId, streams);
    }

    return pc;
  }
}
