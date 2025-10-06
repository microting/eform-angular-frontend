import { Pipe, PipeTransform, inject } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml',
    standalone: false
})
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);


  transform(value: any, args?: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

}
