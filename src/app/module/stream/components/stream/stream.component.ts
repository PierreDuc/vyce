import { Observable, Subject } from 'rxjs/index';
import { map, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Select, Store } from '@ngxs/store';

import { StreamConnectionData, StreamModel, StreamState } from '../../../../shared/states/stream.state';
import { StreamConnectionService } from '../../../../core/services/stream-connection.service';

@Component({
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit, OnDestroy {
  @ViewChild('stream') readonly streamEl?: ElementRef<HTMLVideoElement>;
  @Select(StreamState.streams) readonly streams$!: Observable<{ [streamId: string]: StreamModel }>;

  private readonly destroy: Subject<void> = new Subject<void>();

  private connection: StreamConnectionData | null = null;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly sc: StreamConnectionService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        takeUntil(this.destroy),
        map(params => params.streamId),
        mergeMap((streamId: string) => this.sc.connectToStream(streamId)),
        tap(connection => (this.connection = connection)),
        mergeMap((connection: StreamConnectionData) =>
          this.streams$.pipe<MediaStream | null>(
            map(streams => {
              if (
                !streams ||
                !streams[connection.streamId] ||
                !streams[connection.streamId][connection.negotiationId]
              ) {
                return null;
              }

              return streams[connection.streamId][connection.negotiationId].stream;
            })
          )
        )
      )
      .subscribe(stream => {
        if (this.streamEl) {
          this.streamEl.nativeElement.srcObject = stream;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.connection) {
      this.sc.stopStream(this.connection);
    }

    this.destroy.next();
    this.destroy.complete();
  }
}
