import { Component, OnInit, Input } from '@angular/core';
import {SharedTagModel} from 'src/app/common/models';

@Component({
  selector: 'app-eform-tag',
  templateUrl: './eform-tag.component.html',
  styleUrls: ['./eform-tag.component.scss']
})
export class EformTagComponent implements OnInit {
  constructor() { }

  @Input() tags: SharedTagModel[] = [];
  @Input() id: string = '';
  ngOnInit() {
  }

}
