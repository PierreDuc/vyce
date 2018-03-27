import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeStyle'
})
export class SafeStylePipe implements PipeTransform {
  constructor(readonly ss: DomSanitizer) {}

  transform(style: string): any {
    return this.ss.bypassSecurityTrustStyle(style);
  }
}
