import { UntypedFormControl } from '@angular/forms';

export function noWhitespaceValidator(control: UntypedFormControl) {
  const isSpace = (control.value || '').match(/\s/g);
  return isSpace ? { whitespace: true } : null;
}
