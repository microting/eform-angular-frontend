import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {EFormCreateModel} from 'src/app/common/models/eforms';
import {EFormService} from 'src/app/common/services/eform';

@Component({
  selector: 'app-eform-create-modal',
  templateUrl: './eform-create-modal.component.html',
  styleUrls: ['./eform-create-modal.component.scss']
})
export class EformCreateModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Input() availableTags: Array<CommonDictionaryModel> = [];
  @Output() onEformCreated: EventEmitter<void> = new EventEmitter<void>();
  eFormCreateModel: EFormCreateModel = new EFormCreateModel();
  spinnerStatus = false;

  constructor(private eFormService: EFormService) {
  }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  createTemplate() {
    this.spinnerStatus = true;
    if (!this.eFormCreateModel.newTag) {
      delete this.eFormCreateModel.newTag;
    }
    this.eFormService.createSingle(this.eFormCreateModel).subscribe((operation => {
      if (operation && operation.success) {
        this.onEformCreated.emit();
        this.eFormCreateModel = new EFormCreateModel;
        this.frame.hide();
      }
      this.spinnerStatus = false;
    }));
  }
}
