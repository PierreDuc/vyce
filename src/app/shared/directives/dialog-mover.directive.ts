import {Directive, ElementRef, OnDestroy, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material";
import {fromEvent, merge, Subject} from "rxjs/index";
import {takeUntil} from "rxjs/operators";

@Directive({
  selector: '[vcDialogMover]'
})
export class DialogMoverDirective implements OnInit, OnDestroy {

  private readonly destroy: Subject<void> = new Subject<void>();

  constructor(private readonly md: MatDialogRef<any>, private readonly el: ElementRef) {}

  ngOnInit(): void {
    fromEvent<PointerEvent>(this.el.nativeElement, 'pointerdown', { passive: true }).pipe(
      takeUntil(this.destroy)
    ).subscribe((startEvent: PointerEvent) => {

      fromEvent<PointerEvent>(document, 'pointermove', { passive: true}).pipe(
        takeUntil(merge(this.destroy, fromEvent(document, 'pointerup', {capture: true})))
      ).subscribe((moveEvent: PointerEvent) => {


      })
    })
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
