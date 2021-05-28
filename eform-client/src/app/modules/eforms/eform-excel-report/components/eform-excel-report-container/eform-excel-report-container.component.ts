import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { parseISO } from 'date-fns';
import { saveAs } from 'file-saver';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AuthStateService } from 'src/app/common/store';
import {
  EformDocxReportService,
  EFormService,
  EmailRecipientsService,
} from 'src/app/common/services';
import {
  EformDocxReportGenerateModel,
  EformDocxReportHeadersModel,
  SharedTagModel,
} from 'src/app/common/models';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-excel-report-container',
  templateUrl: './eform-excel-report-container.component.html',
  styleUrls: ['./eform-excel-report-container.component.scss'],
})
export class EformExcelReportContainerComponent implements OnInit, OnDestroy {
  @ViewChild('headerEditorModal', { static: false }) headerEditorModal;
  reportHeadersModel: EformDocxReportHeadersModel = new EformDocxReportHeadersModel();
  generateReportSub$: Subscription;
  dateFrom: any;
  dateTo: any;
  range: Date[] = [];
  availableTags: SharedTagModel[] = [];
  selectedTemplateId: number;
  activatedRouteSub$: Subscription;
  updateHeadersSub$: Subscription;
  reportHeadersSub$: Subscription;

  constructor(
    private emailRecipientsService: EmailRecipientsService,
    private activateRoute: ActivatedRoute,
    private reportService: EformDocxReportService,
    private toastrService: ToastrService,
    private router: Router,
    public authStateService: AuthStateService,
    private eFormService: EFormService
  ) {
    this.activatedRouteSub$ = this.activateRoute.params.subscribe((params) => {
      // Required to reload component
      if (this.selectedTemplateId) {
        this.router.navigate(['/']).then(() => {
          this.router.navigate(['/excel-report/' + +params['eformId']]);
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
        this.onDownloadReport(model);
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
    this.headerEditorModal.show(this.reportHeadersModel);
  }

  onDownloadReport(model: EformDocxReportGenerateModel) {
    this.generateReportSub$ = this.eFormService
      .downloadEformExcel(model)
      .subscribe((data) => {
        const blob = new Blob([data]);
        saveAs(blob, `template_${this.selectedTemplateId}.xlsx`);
      });
  }

  onUpdateReportHeaders(model: EformDocxReportHeadersModel) {
    this.updateHeadersSub$ = this.reportService
      .updateTemplateDocxReportHeaders(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.headerEditorModal.hide();
          this.getReportHeaders(this.selectedTemplateId);
        }
      });
  }

  ngOnDestroy(): void {}
}
