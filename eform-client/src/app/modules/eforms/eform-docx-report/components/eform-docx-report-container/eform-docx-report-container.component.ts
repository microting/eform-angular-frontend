import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {Subscription} from 'rxjs';
import {
  CommonDictionaryModel,
  EformDocxReportGenerateModel,
  EformDocxReportModel,
  SharedTagModel,
} from 'src/app/common/models';
import {
  EmailRecipientsService,
  EformDocxReportService
} from 'src/app/common/services';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {parseISO} from 'date-fns';
import {saveAs} from 'file-saver';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {catchError} from 'rxjs/operators';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { EformNewSubheaderComponent } from '../../../../../common/modules/eform-shared/components/eform-new-subheader/eform-new-subheader.component';
import { EformDocxReportHeaderComponent } from '../eform-docx-report-header/eform-docx-report-header.component';
import { NgIf, NgFor } from '@angular/common';
import { EformDocxReportTableComponent } from '../eform-docx-report-table/eform-docx-report-table.component';
import { EformDocxReportImagesComponent } from '../eform-docx-report-images/eform-docx-report-images.component';

@AutoUnsubscribe()
@Component({
    selector: 'app-eform-docx-report-container',
    templateUrl: './eform-docx-report-container.component.html',
    styleUrls: ['./eform-docx-report-container.component.scss'],
    imports: [EformNewSubheaderComponent, EformDocxReportHeaderComponent, NgIf, NgFor, EformDocxReportTableComponent, EformDocxReportImagesComponent, TranslatePipe]
})
export class EformDocxReportContainerComponent implements OnInit, OnDestroy {
  private translateService = inject(TranslateService);
  private emailRecipientsService = inject(EmailRecipientsService);
  private activateRoute = inject(ActivatedRoute);
  private reportService = inject(EformDocxReportService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  reportModel: EformDocxReportModel = new EformDocxReportModel();
  dateFrom: any;
  dateTo: any;
  range: Date[] = [];
  availableTags: SharedTagModel[] = [];
  selectedTemplateId: number;
  generateReportSub$: Subscription;
  downloadReportSub$: Subscription;
  activatedRouteSub$: Subscription;

  constructor() {
    this.activatedRouteSub$ = this.activateRoute.params.subscribe((params) => {
      // Required to reload component
      if (this.selectedTemplateId) {
        this.router.navigate(['/']).then(() => {
          this.router.navigate(['/docx-report/' + +params['eformId']]).then();
        });
      }

      this.dateFrom = params['dateFrom'];
      this.dateTo = params['dateTo'];
      this.selectedTemplateId = +params['eformId'];

      if (this.dateFrom && this.dateTo) {
        this.range.push(parseISO(this.dateFrom));
        this.range.push(parseISO(this.dateTo));
      }
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

  ngOnInit() {
  }

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
      .pipe(catchError(
        (error, caught) => {
          this.toastrService.info(this.translateService.instant('No data in selected period'));
          return caught;
        }))
      .subscribe(
        (data) => {
          saveAs(data, model.dateFrom + '_' + model.dateTo + '_report.docx');
        }
      );
  }

  ngOnDestroy(): void {
  }
}
