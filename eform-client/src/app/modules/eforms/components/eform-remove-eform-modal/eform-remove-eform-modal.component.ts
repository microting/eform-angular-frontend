import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {TemplateDto} from 'src/app/common/models/dto';
import {EFormService} from 'src/app/common/services/eform';

@Component({
  selector: 'app-eform-remove-eform-modal',
  templateUrl: './eform-remove-eform-modal.component.html',
  styleUrls: ['./eform-remove-eform-modal.component.scss']
})
export class EformRemoveEformModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() onEFormDeleted: EventEmitter<void> = new EventEmitter();
  selectedTemplateDto: TemplateDto = new TemplateDto();
  spinnerStatus = false;
  constructor(private eFormService: EFormService) { }

  ngOnInit() {
  }

  show(template: TemplateDto) {
    this.selectedTemplateDto = template;
    this.frame.show();
  }

  deleteEfrom() {
    this.eFormService.deleteSingle(this.selectedTemplateDto.id).subscribe(operation => {
      if (operation && operation.success) {
        this.onEFormDeleted.emit();
        this.frame.hide();
      }
    });
  }
}
