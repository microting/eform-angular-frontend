import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TemplateDto } from 'src/app/common/models/dto';
import { EFormService } from 'src/app/common/services/eform';

@Component({
  selector: 'app-eform-duplicate-confirm-modal',
  templateUrl: './eform-duplicate-confirm-modal.component.html',
  styleUrls: ['./eform-duplicate-confirm-modal.component.scss'],
})
export class EformDuplicateConfirmModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() eFormDuplicated: EventEmitter<void> = new EventEmitter();
  selectedTemplateDto: TemplateDto = new TemplateDto();
  constructor(private eFormService: EFormService) {}

  ngOnInit() {}

  show(template: TemplateDto) {
    this.selectedTemplateDto = template;
    this.frame.show();
  }

  duplicateEfrom() {
    this.eFormService
      .duplicateEForms(this.selectedTemplateDto.id)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.eFormDuplicated.emit();
          this.frame.hide();
        }
      });
  }
}
