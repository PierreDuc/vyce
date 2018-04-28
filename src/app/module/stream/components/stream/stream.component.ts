import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { StreamState } from '../../../../shared/states/stream.state';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { AddTrack, StopStream } from '../../../../shared/actions/stream.action';

@Component({
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stream') readonly streamEl?: ElementRef<HTMLVideoElement>;

  private readonly destroy: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.store
      .select(StreamState.streams)
      .pipe(map(streams => streams[this.route.snapshot.params.streamId]), takeUntil(this.destroy))
      .subscribe(stream => {
        if (this.streamEl) {
          this.streamEl.nativeElement.srcObject = stream;
        }
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new StopStream(this.route.snapshot.params.streamId));

    this.destroy.next();
    this.destroy.complete();
  }
}
