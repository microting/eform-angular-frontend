import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FieldValueDto} from 'src/app/common/models';

@Component({
  selector: 'element-number',
  templateUrl: './element-number.component.html',
  styleUrls: ['./element-number.component.scss']
})
export class ElementNumberComponent implements OnInit {
  fieldValueObj: FieldValueDto = new FieldValueDto();
  numberForm: FormGroup;
  @Input()
  get fieldValue() {
    this.fieldValueObj.value = this.numberForm.getRawValue().numberControl;
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
    this.numberForm.setValue({numberControl: val.value});
  }

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.numberForm = this.formBuilder.group({
      numberControl: ['', Validators.required,
        Validators.pattern('^[1-9][\\.\\d]*(,\\d+)?$')]
    });
  }
}
