import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CaseFieldValue} from 'app/models';

@Component({
  selector: 'element-audio',
  templateUrl: './element-audio.component.html',
  styleUrls: ['./element-audio.component.css']
})
export class ElementAudioComponent implements OnInit {
  fieldValueObjects: Array<CaseFieldValue> = [];

  @Input()
  get fieldValues() {
    return this.fieldValueObjects;
  }

  set fieldValues(val) {
    this.fieldValueObjects = val;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
