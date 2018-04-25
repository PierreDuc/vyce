import {Injectable} from "@angular/core";

@Injectable()
export class StreamConnectionService {

  private readonly streams = new Map<string, RTCPeerConnection>();

  public async startStream(streamId: string): Promise<RTCSessionDescription | null> {
    //https://github.com/WebsiteBeaver/simple-webrtc-video-chat-using-firebase/blob/master/js/script.js

    let pc: RTCPeerConnection | undefined = this.streams.get(streamId);

    if (!pc) {
      pc = new RTCPeerConnection({
        iceServers: [{
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ]
        }]
      });

      this.streams.set(streamId, pc)
    }

    pc.addEventListener('icecandidate', (e) => {
      console.log(e);
    });

    await pc.setLocalDescription(await pc.createOffer());

    return pc.localDescription;
  }

}
