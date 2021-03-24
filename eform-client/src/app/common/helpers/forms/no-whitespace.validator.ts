import { FormControl } from '@angular/forms';

export function noWhitespaceValidator(control: FormControl) {
  const isSpace = (control.value || '').match(/\s/g);
  return isSpace ? { whitespace: true } : null;
}
