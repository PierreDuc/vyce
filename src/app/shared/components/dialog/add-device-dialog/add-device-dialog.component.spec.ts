import {MAT_DIALOG_DATA, MatButtonModule, MatDialogModule} from "@angular/material";

import {NgxsModule} from "@ngxs/store";

import {initComponent} from "../../../../../testing/init-component.function";
import {AddDeviceDialogComponent} from "./add-device-dialog.component";
import {MediaDevicesService} from "../../../../core/services/media-devices.service";
import {MockMediaDevicesService} from "../../../../core/services/media-devices.service.mock";

describe('AddDeviceDialog', () => {
  initComponent(AddDeviceDialogComponent, {
    imports: [
      NgxsModule.forRoot([]),
      MatButtonModule,
      MatDialogModule
    ],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MediaDevicesService, useClass: MockMediaDevicesService }
    ]
  });
});
