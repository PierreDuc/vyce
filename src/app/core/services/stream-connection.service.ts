import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddTrack, OpenStream } from '../../shared/actions/stream.action';

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
    // https://github.com/WebsiteBeaver/simple-webrtc-video-chat-using-firebase/blob/master/js/script.js

    const pc = this.getDestStreamConnection(streamId);

    await pc.setLocalDescription(await pc.createOffer());

    return (pc.localDescription && pc.localDescription.sdp) || '';
  }

  public async getAnswer(streamId: string, sdp: string): Promise<string> {
    const pc = this.getSourceStreamConnection(streamId);

    await pc.setRemoteDescription(
      new RTCSessionDescription({
        sdp,
        type: 'offer'
      })
    );

    await pc.setLocalDescription(await pc.createAnswer());

    return (pc.localDescription && pc.localDescription.sdp) || '';
  }

  public setConnection(streamId: string, sdp: string): Promise<void> {
    const pc = this.getDestStreamConnection(streamId);

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

      // pc['onopen'] = (e: any): void => {
      //   console.log('onopen', e);
      // };
      //
      // pc['onpeeridentity'] = (e: any): void => {
      //   console.log('onpeeridentity', e);
      // };
      //
      pc['ontrack'] = (e: any): void => {
        console.log('ontrack', e);
      };

      pc.onaddstream = e => {
        console.log('onaddstream', e);
      };

      pc.onicecandidate = e => {
        console.log('onicecandidate', e);
      };

      pc.oniceconnectionstatechange = e => {
        console.log('oniceconnectionstatechange', e);
      };

      pc.onicegatheringstatechange = e => {
        console.log('onicegatheringstatechange', e);
      };

      pc.onnegotiationneeded = e => {
        console.log('onnegotiationneeded', e);
      };

      pc.onsignalingstatechange = e => {
        console.log('onsignalingstatechange', e);
      };

      streams[key] = pc;

      this.streams.set(streamId, streams);
    }

    return pc;
  }
}
