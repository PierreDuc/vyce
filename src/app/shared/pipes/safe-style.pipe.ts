import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({
  name: 'safeStyle'
})
export class SafeStylePipe implements PipeTransform {
  constructor(private readonly ss: DomSanitizer) {}

  transform(style: string): SafeStyle {
    return this.ss.bypassSecurityTrustStyle(style);
  }
}
