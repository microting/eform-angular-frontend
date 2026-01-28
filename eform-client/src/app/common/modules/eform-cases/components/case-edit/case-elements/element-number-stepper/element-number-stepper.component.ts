import { Component, Input, OnInit } from '@angular/core';
import { FieldValueDto } from 'src/app/common/models';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'element-number-stepper',
    templateUrl: './element-number-stepper.component.html',
    styleUrls: ['./element-number-stepper.component.scss'],
    imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, TranslatePipe]
})
export class ElementNumberStepperComponent implements OnInit {
  fieldValueObj: FieldValueDto = new FieldValueDto();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor() {}

  ngOnInit() {}
}
