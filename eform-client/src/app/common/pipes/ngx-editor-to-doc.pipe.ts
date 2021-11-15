import { Pipe, PipeTransform } from '@angular/core';
import { toDoc } from 'ngx-editor';

@Pipe({
  name: 'toDoc',
})
export class NgxEditorToDocPipe implements PipeTransform {
  constructor() {}

  async transform(src: string): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      resolve(toDoc(src));
    });
  }
}
