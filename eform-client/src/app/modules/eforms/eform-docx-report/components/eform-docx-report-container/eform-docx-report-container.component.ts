import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  CommonDictionaryModel,
  EformDocxReportGenerateModel,
  EformDocxReportHeadersModel,
  EformDocxReportModel,
  SharedTagModel,
} from 'src/app/common/models';
import { EmailRecipientsService } from 'src/app/common/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { parseISO } from 'date-fns';
import { saveAs } from 'file-saver';
import { EformDocxReportService } from 'src/app/common/services/eform';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AuthStateService } from 'src/app/common/store';
import {catchError} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {EformDocxReportHeaderEditorComponent} from 'src/app/modules/eforms/eform-docx-report/components';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-docx-report-container',
  templateUrl: './eform-docx-report-container.component.html',
  styleUrls: ['./eform-docx-report-container.component.scss'],
})
export class EformDocxReportContainerComponent implements OnInit, OnDestroy {
  reportModel: EformDocxReportModel = new EformDocxReportModel();
  reportHeadersModel: EformDocxReportHeadersModel = new EformDocxReportHeadersModel();
  dateFrom: any;
  dateTo: any;
  range: Date[] = [];
  availableEmailRecipients: CommonDictionaryModel[] = [];
  availableTags: SharedTagModel[] = [];
  selectedTemplateId: number;
  generateReportSub$: Subscription;
  downloadReportSub$: Subscription;
  activatedRouteSub$: Subscription;
  updateHeadersSub$: Subscription;
  reportHeadersSub$: Subscription;
  updateReportHeadersSub$: Subscription;

  get userRole() {
    return this.authStateService.currentRole;
  }

  constructor(
    private emailRecipientsService: EmailRecipientsService,
    private activateRoute: ActivatedRoute,
    private reportService: EformDocxReportService,
    private toastrService: ToastrService,
    private router: Router,
    private authStateService: AuthStateService,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
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
      this.getReportHeaders(this.selectedTemplateId);

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

  getReportHeaders(templateId: number) {
    this.reportHeadersSub$ = this.reportService
      .getTemplateDocxReportHeaders(templateId)
      .subscribe((data) => {
        if (data && data.success) {
          this.reportHeadersModel = data.model;
        }
      });
  }

  showHeadersEditModal() {
    const idModal = this.dialog.open(EformDocxReportHeaderEditorComponent,
      {...dialogConfigHelper(this.overlay, this.reportHeadersModel), minWidth: 500})
      .id;
    this.updateReportHeadersSub$ = this.dialog.getDialogById(idModal)
      .componentInstance.updateReportHeaders
      .subscribe(data => {
        this.onUpdateReportHeaders(data, idModal);
      });
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
        this.toastrService.error('Error downloading report');
        return caught;
      }))
      .subscribe(
        (data) => {
          saveAs(data, model.dateFrom + '_' + model.dateTo + '_report.docx');
        }
      );
  }

  onUpdateReportHeaders(model: EformDocxReportHeadersModel, idModal: string) {
    this.updateHeadersSub$ = this.reportService
      .updateTemplateDocxReportHeaders(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.dialog.getDialogById(idModal).close();
          this.getReportHeaders(this.selectedTemplateId);
        }
      });
  }

  ngOnDestroy(): void {}
}
