import { map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/index';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Store } from '@ngxs/store';

import { AppState } from '../../../core/interface/app-state.interface';

@Component({
  templateUrl: './stream-view.component.html',
  styleUrls: ['./stream-view.component.scss']
})
export class StreamViewComponent {
  stream$: Observable<MediaStream | null>;

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
  }
}
