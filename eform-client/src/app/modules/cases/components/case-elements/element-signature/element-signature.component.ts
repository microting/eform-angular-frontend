import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'app/models';

@Component({
  selector: 'element-signature',
  templateUrl: './element-signature.component.html',
  styleUrls: ['./element-signature.component.css']
})
export class ElementSignatureComponent implements OnInit {
  @Input() fieldValues: Array<CaseFieldValue> = new Array<CaseFieldValue>();

  constructor() {
  }

  ngOnInit() {
  }

}
