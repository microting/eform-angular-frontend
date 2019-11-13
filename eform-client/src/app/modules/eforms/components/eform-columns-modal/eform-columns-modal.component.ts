import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TemplateColumnModel, UpdateColumnsModel} from 'src/app/common/models/cases';
import {TemplateDto} from 'src/app/common/models/dto';
import {EFormService} from 'src/app/common/services/eform';

@Component({
  selector: 'app-eform-column-modal',
  templateUrl: './eform-columns-modal.component.html',
  styleUrls: ['./eform-columns-modal.component.scss']
})
export class EformColumnsModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  spinnerStatus = false;
  selectedTemplateDto: TemplateDto = new TemplateDto();
  columnEditModel: UpdateColumnsModel = new UpdateColumnsModel;
  columnModels: Array<TemplateColumnModel> = [];

  constructor(private eFormService: EFormService, private toastrService: ToastrService) { }

  ngOnInit() {
  }

  show(selectedTemplate: TemplateDto) {
    this.selectedTemplateDto = selectedTemplate;
    this.getColumnsForTemplate();
    this.frame.show();
  }

  getColumnsForTemplate() {
    this.spinnerStatus = true;
    this.eFormService.getTemplateColumns(this.selectedTemplateDto.id).subscribe((operation) => {
      if (operation && operation.success) {
        this.columnModels = operation.model;
        this.eFormService.getCurrentTemplateColumns(this.selectedTemplateDto.id).subscribe((result) => {
          if (result && result.success) {
            this.columnEditModel = result.model;
          }
        });
      } this.spinnerStatus = false;
    });
  }

  updateColumns() {
    this.spinnerStatus = true;
    this.columnEditModel.templateId = this.selectedTemplateDto.id;
    this.eFormService.updateTemplateColumns(this.columnEditModel).subscribe((data => {
      if (data && data.success) {
        this.frame.hide();
      }
      this.spinnerStatus = false;
    }));
  }
}
