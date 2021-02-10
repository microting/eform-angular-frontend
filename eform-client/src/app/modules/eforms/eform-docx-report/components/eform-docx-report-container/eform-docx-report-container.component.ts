import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CasePostNewComponent } from 'src/app/modules/cases/components';
import {
  CommonDictionaryModel,
  EformDocxReportGenerateModel,
  EformDocxReportModel,
  SharedTagModel,
} from 'src/app/common/models';
import { EmailRecipientsService } from 'src/app/common/services';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { parseISO } from 'date-fns';
import { saveAs } from 'file-saver';
import { EformDocxReportService } from 'src/app/common/services/eform';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-docx-report-container',
  templateUrl: './eform-docx-report-container.component.html',
  styleUrls: ['./eform-docx-report-container.component.scss'],
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
  activatedRouteSub$: Subscription;

  constructor(
    private emailRecipientsService: EmailRecipientsService,
    private activateRoute: ActivatedRoute,
    private reportService: EformDocxReportService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.activatedRouteSub$ = this.activateRoute.params.subscribe((params) => {
      // Required to reload component
      if (this.selectedTemplateId) {
        this.router.navigate(['/']).then(() => {
          this.router.navigate(['/docx-report/' + +params['eformId']]);
        });
      }

      this.dateFrom = params['dateFrom'];
      this.dateTo = params['dateTo'];
      this.selectedTemplateId = +params['eformId'];
      this.range.push(parseISO(params['dateFrom']));
      this.range.push(parseISO(params['dateTo']));
      const model: EformDocxReportGenerateModel = {
        dateFrom: params['dateFrom'] ? params['dateFrom'].toString() : null,
        dateTo: params['dateTo'] ? params['dateTo'].toString() : null,
        templateId: +params['eformId'],
      };
      if (model.dateFrom) {
        this.onGenerateReport(model);
      }
    });
  }

  ngOnInit() {}

  onGenerateReport(model: EformDocxReportGenerateModel) {
    this.dateFrom = model.dateFrom;
    this.dateTo = model.dateTo;
    this.generateReportSub$ = this.reportService
      .generateReport(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.reportModel = data.model;
        }
      });
  }

  onDownloadReport(model: EformDocxReportGenerateModel) {
    this.downloadReportSub$ = this.reportService
      .downloadReport(model)
      .subscribe(
        (data) => {
          saveAs(data, model.dateFrom + '_' + model.dateTo + '_report.docx');
        },
        (error) => {
          this.toastrService.error('Error downloading report');
        }
      );
  }

  ngOnDestroy(): void {}
}
