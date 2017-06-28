import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'app/models';

@Component({
  selector: 'element-picture',
  templateUrl: './element-picture.component.html',
  styleUrls: ['./element-picture.component.css']
})
export class ElementPictureComponent implements OnInit {
  @Input() fieldValues: Array<CaseFieldValue> = new Array<CaseFieldValue>();

  constructor() {
  }

  ngOnInit() {
  }

}
