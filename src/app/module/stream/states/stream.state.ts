import { Action, State, StateContext } from '@ngxs/store';

import { LocalDeviceModel } from '../../../shared/states/devices.state';
import { LoadStream } from '../actions/stream.action';
import { DevicesCollectionService } from '../../../core/services/collection/devices-collection.service';
import { DocumentTypedSnapshot } from '../../../core/interface/document-data.interface';

@State<DocumentTypedSnapshot<LocalDeviceModel> | null>({
  name: 'stream',
  defaults: null
})
export class StreamState<T extends StateContext<DocumentTypedSnapshot<LocalDeviceModel> | null>> {
  constructor(private readonly ds: DevicesCollectionService) {}

  @Action(LoadStream)
  loadStream({ setState }: T, { streamId }: LoadStream): void {
    this.ds.getDoc$(streamId).subscribe(stream => {
      setState(stream);
    });
  }
}
