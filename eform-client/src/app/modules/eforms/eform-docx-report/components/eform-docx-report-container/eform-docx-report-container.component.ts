import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {CasePostNewComponent} from 'src/app/modules/cases/components';
import {CommonDictionaryModel, EformDocxReportGenerateModel, EformDocxReportModel, SharedTagModel} from 'src/app/common/models';
import {EmailRecipientsService} from 'src/app/common/services';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {parseISO} from 'date-fns';
import {saveAs} from 'file-saver';
import {EformDocxReportService} from 'src/app/common/services/eform';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-docx-report-container',
  templateUrl: './eform-docx-report-container.component.html',
  styleUrls: ['./eform-docx-report-container.component.scss']
})
export class EformDocxReportContainerComponent implements OnInit, OnDestroy {
  reportModel: EformDocxReportModel = new EformDocxReportModel();
  generateReportSub$: Subscription;
  downloadReportSub$: Subscription;
  dateFrom: any;
  dateTo: any;
  range: Date[] = [];
  availableEmailRecipients: CommonDictionaryModel[] = [];
  availableTags: SharedTagModel[] = [];
  selectedTemplateId: number;

  constructor(
    private emailRecipientsService: EmailRecipientsService,
    private activateRoute: ActivatedRoute,
    private reportService: EformDocxReportService,
    private toastrService: ToastrService) {
    this.activateRoute.params.subscribe(params => {
      this.dateFrom = params['dateFrom'];
      this.dateTo = params['dateTo'];
      this.selectedTemplateId = params['templateId'];
      this.range.push(parseISO(params['dateFrom']));
      this.range.push(parseISO(params['dateTo']));
      const model = {
        dateFrom: params['dateFrom'],
        dateTo: params['dateTo'],
        templateId: params['templateId']
      };
      if (model.dateFrom !== undefined) {
        this.onGenerateReport(model);
      }
    });
  }

  ngOnInit() {

  }

  onGenerateReport(model: EformDocxReportGenerateModel) {
    this.dateFrom = model.dateFrom;
    this.dateTo = model.dateTo;
    this.generateReportSub$ = this.reportService.generateReport(model).subscribe((data) => {
      if (data && data.success) {
        this.reportModel = data.model;
      }
    });
  }

  onDownloadReport(model: EformDocxReportGenerateModel) {
    this.downloadReportSub$ = this.reportService.downloadReport(model).subscribe(((data) => {
      saveAs(data, model.dateFrom + '_' + model.dateTo + '_report.docx');
    }), error => {
      this.toastrService.error('Error downloading report');
    });
  }

  ngOnDestroy(): void {

  }
}
