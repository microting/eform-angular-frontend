import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CaseFieldValue} from 'app/models';

@Component({
  selector: 'element-audio',
  templateUrl: './element-audio.component.html',
  styleUrls: ['./element-audio.component.css']
})
export class ElementAudioComponent implements OnInit {
  fieldValueObj: CaseFieldValue = new CaseFieldValue();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
