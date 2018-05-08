import { StreamConnectorService } from './stream-connector.service';
import { RtcPeerConnectionData, StreamConnectionData } from '../../../shared/states/stream.state';
import { StreamConnectionType } from '../../../shared/enums/stream-connection-type.enum';
import { StreamCollectionService } from '../collection/stream-collection.service';
import { AddMediaStream, RemoveStream } from '../../../shared/actions/stream.action';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { MediaDevicesService } from '../media-devices.service';

@Injectable()
export class RtcPeerConnectorService extends StreamConnectorService<RtcPeerConnectionData> {
  public readonly type = StreamConnectionType.RTCPeer;

  private readonly callerChannels: { [negationId: string]: RTCPeerConnection } = {};
  private readonly senderChannels: { [negationId: string]: RTCPeerConnection } = {};

  constructor(private readonly md: MediaDevicesService, ss: StreamCollectionService, store: Store) {
    super(ss, store);
  }

  connect(streamId: string): RtcPeerConnectionData {
    return {
      needOffer: true,
      ...this.createConnection(streamId)
    };
  }

  shouldHandleMessage({ callerId, needOffer, offer, answer }: RtcPeerConnectionData, fromCaller: boolean): boolean {
    if (needOffer || answer) {
      return (callerId !== this.callerId) === fromCaller;
    }

    if (offer) {
      return (callerId === this.callerId) === fromCaller;
    }

    return false;
  }

  async processMessage(connection: RtcPeerConnectionData): Promise<RtcPeerConnectionData | void> {
    if (connection.needOffer) {
      return { ...(await this.getOffer(connection)) };
    }

    if (connection.offer) {
      return { ...(await this.getAnswer(connection)) };
    }

    if (connection.answer) {
      await this.setConnection(connection);
    }
  }

  disconnect(connection: RtcPeerConnectionData): void {
    const pcs: RTCPeerConnection[] = [
      this.callerChannels[connection.negotiationId],
      this.senderChannels[connection.negotiationId]
    ].filter(c => !!c);

    delete this.callerChannels[connection.negotiationId];
    delete this.senderChannels[connection.negotiationId];

    pcs.forEach(pc => {
      [...pc.getLocalStreams(), ...pc.getRemoteStreams()].forEach(stream =>
        stream.getTracks().forEach(track => track.stop())
      );

      pc.close();
    });

    this.removeConnection(connection);
    this.store.dispatch(new RemoveStream(connection));
  }

  async isAvailable(): Promise<boolean> {
    return typeof RTCPeerConnection !== 'undefined';
  }

  private async getOffer(connection: RtcPeerConnectionData): Promise<RtcPeerConnectionData> {
    delete connection.needOffer;

    const stream = await this.md.getUserMedia(connection.streamId);

    if (stream) {
      const pc = this.createSenderChannel(connection);

      pc.addStream(stream);
      await pc.setLocalDescription(await pc.createOffer());

      return { ...connection, offer: pc.localDescription && pc.localDescription.sdp };
    }

    throw new Error();
  }

  private async getAnswer(connection: RtcPeerConnectionData): Promise<RtcPeerConnectionData> {
    const pc = this.createCallerChannel(connection);

    await pc.setRemoteDescription(
      new RTCSessionDescription({
        sdp: connection.offer as string,
        type: 'offer'
      })
    );

    delete connection.offer;

    await pc.setLocalDescription(await pc.createAnswer());

    return { ...connection, answer: pc.localDescription && pc.localDescription.sdp };
  }

  private setConnection(connection: RtcPeerConnectionData): Promise<void> {
    const pc = this.senderChannels[connection.negotiationId];

    return (
      pc &&
      pc.setRemoteDescription(
        new RTCSessionDescription({
          sdp: connection.answer as string,
          type: 'answer'
        })
      )
    );
  }

  private createCallerChannel(connection: RtcPeerConnectionData): RTCPeerConnection {
    const pc = this.createChannel(connection);

    pc.addEventListener('track', (e: any) => {
      this.store.dispatch(new AddMediaStream(connection, e.streams[0]));
    });

    this.callerChannels[connection.negotiationId] = pc;

    return pc;
  }

  private createSenderChannel(connection: RtcPeerConnectionData): RTCPeerConnection {
    const pc = this.createChannel(connection);

    this.senderChannels[connection.negotiationId] = pc;

    return pc;
  }

  private createChannel(connection: RtcPeerConnectionData): RTCPeerConnection {
    const pc = new RTCPeerConnection({});

    pc.addEventListener('iceconnectionstatechange', () => {
      if (pc.signalingState === 'closed') {
        this.disconnect(connection);
      }
    });

    return pc;
  }
}
