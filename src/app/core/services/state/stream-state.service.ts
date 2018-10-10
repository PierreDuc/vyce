import {Injectable, NgZone} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

import { StreamViewComponent } from '../../../shared/components/stream-view/stream-view.component';
import { StreamConnectionData } from '../../../shared/states/stream.state';
import { StreamConnectionService } from '../stream-connection.service';

@Injectable()
export class StreamStateService {
  private readonly streamDialogs: { [streamId: string]: MatDialogRef<StreamViewComponent> } = {};

  private readonly dialogSettings: MatDialogConfig = {
    hasBackdrop: false,
    closeOnNavigation: false,
    autoFocus: false,
    panelClass: 'stream-view-pane'
  };

  constructor(private readonly md: MatDialog, private sc: StreamConnectionService, private zone: NgZone) {}

  public openStreamWindow(connection: StreamConnectionData): void {
    this.zone.run(() => {
      this.streamDialogs[connection.streamId] = this.md.open(StreamViewComponent, {
        data: connection.streamId,
        ...this.dialogSettings
      });
      this.streamDialogs[connection.streamId].afterClosed().subscribe(() => this.sc.stopStream(connection));
    });
  }

  public closeStreamWindow({ streamId }: StreamConnectionData): void {
    if (this.streamDialogs[streamId]) {
      this.streamDialogs[streamId].close();

      delete this.streamDialogs[streamId];
    }
  }
}
