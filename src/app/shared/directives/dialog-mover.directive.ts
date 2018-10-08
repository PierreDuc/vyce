import { fromEvent, merge, Subject, AsyncSubject } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';

import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { DialogPosition } from '@angular/material/dialog/typings/dialog-config';

@Directive({
  selector: '[vcDialogMover]'
})
export class DialogMoverDirective<T> implements OnInit, OnDestroy {
  @Input() offsetX = 0;

  @Input() offsetY = 0;

  private readonly destroy: Subject<void> = new AsyncSubject();

  constructor(private readonly md: MatDialogRef<T>, private readonly el: ElementRef, private readonly ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<PointerEvent>(this.el.nativeElement, 'pointerdown', { passive: true })
        .pipe(
          takeUntil(this.destroy),
          map(({ clientX, clientY }: PointerEvent) => {
            const rect = this.el.nativeElement.getBoundingClientRect();

            return {
              top: rect.top - clientY - this.offsetY,
              left: rect.left - clientX - this.offsetX
            };
          }),
          switchMap((newPosition: { top: number; left: number }) =>
            fromEvent<PointerEvent>(document, 'pointermove', { passive: true }).pipe(
              takeUntil(
                merge(
                  this.destroy,
                  fromEvent(document, 'pointercancel', { capture: true, passive: true }),
                  fromEvent(document, 'pointerup', { capture: true, passive: true })
                )
              ),
              map((moveEvent: PointerEvent) => ({
                top: newPosition.top + moveEvent.clientY + 'px',
                left: newPosition.left + moveEvent.clientX + 'px'
              }))
            )
          )
        )
        .subscribe((newPosition: DialogPosition) => this.md.updatePosition(newPosition));
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
