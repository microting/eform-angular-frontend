import { Pipe, PipeTransform } from '@angular/core';

/**
 * Mock TranslatePipe for testing
 * Returns the key as-is or a simple transformed version
 */
@Pipe({ 
  name: 'translate',
  standalone: false
})
export class MockTranslatePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}
