import {NgxsModule} from "@ngxs/store";

import { StreamListComponent } from './stream-list.component';
import {initComponent} from "../../../../../testing/init-component.function";
import {MediaDevicesService} from "../../../../core/services/media-devices.service";
import {MockMediaDevicesService} from "../../../../core/services/media-devices.service.mock";

describe('StreamListComponent', () => {
  initComponent(StreamListComponent, {
    imports: [
      NgxsModule.forRoot([]),
    ],
    providers: [
      { provide: MediaDevicesService, useClass: MockMediaDevicesService }
    ]
  });
});
