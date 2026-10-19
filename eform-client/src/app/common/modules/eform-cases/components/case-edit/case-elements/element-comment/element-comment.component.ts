import { Component, Input} from '@angular/core';
import { FieldValueDto } from 'src/app/common/models';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-comment',
    templateUrl: './element-comment.component.html',
    styleUrls: ['./element-comment.component.scss'],
    imports: [MatFormField, MatInput, ReactiveFormsModule, FormsModule]
})
export class ElementCommentComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
    // let value = this.fieldValueObj.value as any;
    // value = value === null ? '' : value.replaceAll('\n', '<br>');
    // this.fieldValueObj.value = value.replaceAll('\r', '<br>');
  }

  onValueChanged(e: any) {
    this.fieldValueObj = e;
  }

  constructor() {}
}
