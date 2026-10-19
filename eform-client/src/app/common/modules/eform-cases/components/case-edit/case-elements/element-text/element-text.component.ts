import {Component, Input} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-text',
    templateUrl: './element-text.component.html',
    styleUrls: ['./element-text.component.scss'],
    imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, TranslatePipe]
})
export class ElementTextComponent  {
  fieldValueObj: FieldValueDto = new FieldValueDto();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor() {
  }

}
