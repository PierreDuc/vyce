import {filter, map, takeUntil} from 'rxjs/operators';
import { Observable } from 'rxjs/index';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import {Store} from '@ngxs/store';

import { AppState } from '../../../core/interface/app-state.interface';
import {DevicesState, LocalDeviceModel} from "../../states/devices.state";
import {DocumentTypedSnapshot} from "../../../core/interface/document-data.interface";

@Component({
  templateUrl: './stream-view.component.html',
  styleUrls: ['./stream-view.component.scss']
})
export class StreamViewComponent {
  readonly device$: Observable<DocumentTypedSnapshot<LocalDeviceModel> | null>;

  readonly stream$: Observable<MediaStream | null>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly streamId: string,
    private md: MatDialogRef<StreamViewComponent>,
    private store: Store
  ) {
    this.stream$ = this.store.select((state: AppState) => state.streams.streams).pipe(
      takeUntil(this.md.beforeClose()),
      map(streams => {
        return streams[this.streamId].stream || null;
      })
    );

    this.device$ = this.store.select(DevicesState.devices).pipe(
      map((devices: DocumentTypedSnapshot<LocalDeviceModel>[]) => devices.find(device => device.id === this.streamId) || null)
    );
  }

  onCloseClick(): void {
    this.md.close();
  }
}
