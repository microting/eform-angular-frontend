import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TemplateListModel} from 'src/app/common/models/eforms';

@Component({
  selector: 'app-security-group-eforms-add',
  templateUrl: './security-group-eforms-add.component.html',
  styleUrls: ['./security-group-eforms-add.component.scss']
})
export class SecurityGroupEformsAddComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() templateListModel: TemplateListModel = new TemplateListModel();
  @Output() onEformBound: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  constructor() { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  addEformToGroup(templateId: number) {

  }

}
