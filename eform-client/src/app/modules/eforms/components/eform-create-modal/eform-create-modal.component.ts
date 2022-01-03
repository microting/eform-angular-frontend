import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {EFormCreateModel} from 'src/app/common/models/eforms';
import {EFormService} from 'src/app/common/services/eform';
import {MdbModalRef} from 'mdb-angular-ui-kit/modal';

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

  constructor(private eFormService: EFormService,
              public modalRef: MdbModalRef<EformCreateModalComponent>) {
  }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  createTemplate() {
    if (!this.eFormCreateModel.newTag) {
      delete this.eFormCreateModel.newTag;
    }
    this.eFormService.createSingle(this.eFormCreateModel).subscribe((operation => {
      if (operation && operation.success) {
        this.onEformCreated.emit();
        this.eFormCreateModel = new EFormCreateModel;
        this.modalRef.close();
      }
    }));
  }
}
