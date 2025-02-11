import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EFormService} from 'src/app/common/services/eform';
import {EformDownloadExcelModel, TemplateDto} from 'src/app/common/models';
import {saveAs} from 'file-saver';
import {format} from 'date-fns';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';

@AutoUnsubscribe()
@Component({
    selector: 'app-eform-excel-report-modal',
    templateUrl: './eform-excel-report-modal.component.html',
    styleUrls: ['./eform-excel-report-modal.component.scss'],
    standalone: false
})
export class EformExcelReportModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', {static: true}) frame;
  selectedTemplate: TemplateDto = new TemplateDto();
  downloadExcelSub$: Subscription;
  downloadForm: FormGroup;

  constructor(private eFormService: EFormService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.downloadForm = this.formBuilder.group({
      dateRange: ['', Validators.required]
    });
  }

  show(template: TemplateDto) {
    this.selectedTemplate = template;
    this.frame.show();
  }

  downloadExcelReport() {
    const model = {
      dateFrom: format(this.downloadForm.value.dateRange[0], 'yyyy-MM-dd'),
      dateTo: format(this.downloadForm.value.dateRange[1], 'yyyy-MM-dd'),
      templateId: this.selectedTemplate.id
    } as EformDownloadExcelModel;
    this.downloadExcelSub$ = this.eFormService.downloadEformExcel(model).subscribe((data => {
      const blob = new Blob([data]);
      saveAs(blob, `template_${this.selectedTemplate.id}.xlsx`);
    }));
  }

  ngOnDestroy(): void {
  }

  close() {
    this.frame.hide();
    this.downloadForm.reset();
  }
}
