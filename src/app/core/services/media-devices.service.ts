import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ShowAddDevice } from '../../shared/actions/ui.action';

@Injectable()
export class MediaDevicesService {
  constructor(private readonly store: Store) {}

  public async addLocalAvailable(): Promise<void> {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());

      this.store.dispatch(new ShowAddDevice());
    } catch {}
  }
}
