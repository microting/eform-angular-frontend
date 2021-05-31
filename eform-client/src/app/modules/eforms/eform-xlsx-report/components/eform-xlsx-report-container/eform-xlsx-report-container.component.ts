import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { parseISO } from 'date-fns';
import { saveAs } from 'file-saver';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { EFormService } from 'src/app/common/services';
import { EformDocxReportGenerateModel } from 'src/app/common/models';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-xlsx-report-container',
  templateUrl: './eform-xlsx-report-container.component.html',
  styleUrls: ['./eform-xlsx-report-container.component.scss'],
})
export class EformXlsxReportContainerComponent implements OnInit, OnDestroy {
  dateFrom: any;
  dateTo: any;
  range: Date[] = [];
  selectedTemplateId: number;

  activatedRouteSub$: Subscription;
  generateReportSub$: Subscription;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
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

  onDownloadReport(model: EformDocxReportGenerateModel) {
    this.generateReportSub$ = this.eFormService
      .downloadEformExcel(model)
      .subscribe((data) => {
        const blob = new Blob([data]);
        saveAs(blob, `template_${this.selectedTemplateId}.xlsx`);
      });
  }

  ngOnDestroy(): void {}
}
