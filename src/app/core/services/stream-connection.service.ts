import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { AddTrack } from '../../shared/actions/stream.action';
import { StreamSignalData } from '../../shared/states/stream.state';
import { MediaDevicesService } from './media-devices.service';

@Injectable()
export class StreamConnectionService {
  private readonly connections = new Map<
    string,
    {
      source?: RTCPeerConnection;
      dest?: RTCPeerConnection;
    }
  >();

  constructor(private readonly store: Store, private readonly md: MediaDevicesService) {}

  public async processSignal(
    streamId: string,
    signalId: string,
    { needOffer, offer, answer }: StreamSignalData
  ): Promise<Partial<StreamSignalData>> {
    if (needOffer) {
      return { offer: await this.getOffer(signalId, streamId) };
    }

    if (offer) {
      return { answer: await this.getAnswer(signalId, streamId, offer) };
    }

    if (answer) {
      await this.setConnection(signalId, answer);
    }

    return {};
  }

  public stopStream(signalId: string): void {
    const streams = this.connections.get(signalId);

    if (streams) {
      if (streams.dest) {
        streams.dest.close();
      }
      if (streams.source) {
        streams.source.close();
      }
    }
  }

  private async getOffer(signalId: string, streamId: string): Promise<string | null> {
    const stream = await this.md.getUserMedia(streamId);

    if (stream) {
      const pc = this.getSignalConnection(signalId, 'source');

      pc.addStream(stream);
      await pc.setLocalDescription(await pc.createOffer());

      return pc.localDescription && pc.localDescription.sdp;
    }

    return null;
  }

  private async getAnswer(signalId: string, streamId: string, sdp: string): Promise<string | null> {
    const pc = this.getSignalConnection(signalId, 'dest');
    pc.addEventListener('track', (e: any) => {
      this.store.dispatch(new AddTrack(signalId, streamId, e.streams[0]));
    });

    await pc.setRemoteDescription(
      new RTCSessionDescription({
        sdp,
        type: 'offer'
      })
    );
    await pc.setLocalDescription(await pc.createAnswer());

    return pc.localDescription && pc.localDescription.sdp;
  }

  private setConnection(signalId: string, sdp: string): Promise<void> {
    const pc = this.getSignalConnection(signalId, 'source');

    return pc.setRemoteDescription(
      new RTCSessionDescription({
        sdp,
        type: 'answer'
      })
    );
  }

  private getSignalConnection(signalId: string, key: 'source' | 'dest'): RTCPeerConnection {
    const streams = this.connections.get(signalId) || {};

    if (!streams[key]) {
      const pc = new RTCPeerConnection({});
      streams[key] = pc;

      pc.addEventListener('iceconnectionstatechange', () => {
        if (pc.signalingState === 'closed') {
          pc.close();
          pc.getLocalStreams().forEach(s => s.getTracks().forEach(t => t.stop()));

          this.connections.delete(signalId);
        }
      });

      this.connections.set(signalId, streams);
    }

    return streams[key] as RTCPeerConnection;
  }
}
