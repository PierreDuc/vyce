import {Observable, Subject} from 'rxjs/index';
import {map, mergeMap, takeUntil} from 'rxjs/operators';

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {Select, Store} from '@ngxs/store';

import {StreamModel, StreamState} from '../../../../shared/states/stream.state';
import {LoadStream, StopStream} from '../../../../shared/actions/stream.action';
import {StreamCollectionService} from "../../../../core/services/collection/stream-collection.service";

@Component({
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit, OnDestroy {
  @ViewChild('stream') readonly streamEl?: ElementRef<HTMLVideoElement>;
  @Select(StreamState.streams) readonly streams$!: Observable<{ [streamId: string ]: StreamModel }>;

  private readonly destroy: Subject<void> = new Subject<void>();

  private signalId: string | null = null;

  constructor(private readonly store: Store, private readonly route: ActivatedRoute, private readonly ss: StreamCollectionService) {}

  ngOnInit(): void {
    this.signalId = this.ss.createPushId();

    this.route.params.pipe(
      map(params => params.streamId),
      mergeMap(streamId =>
        this.store.dispatch(new LoadStream(this.signalId, streamId)).pipe(
          mergeMap(() => this.streams$.pipe(map(streams => streams && this.signalId && streams[streamId][this.signalId])))
        )
      ),
      map(stream => stream || null),
      takeUntil(this.destroy)
    ).subscribe(stream => {
      if (this.streamEl ) {
        this.streamEl.nativeElement.srcObject = stream;
      }
    })
  }

  ngOnDestroy(): void {
    if (this.signalId) {
      this.store.dispatch(new StopStream(this.signalId));
    }

    this.destroy.next();
    this.destroy.complete();
  }
}
