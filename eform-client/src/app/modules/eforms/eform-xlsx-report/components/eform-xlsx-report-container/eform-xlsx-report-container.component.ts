import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { parseISO } from 'date-fns';
import { saveAs } from 'file-saver';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { EFormService } from 'src/app/common/services';
import { EformDocxReportGenerateModel } from 'src/app/common/models';
import { AppMenuStateService } from 'src/app/common/store';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
    selector: 'app-eform-xlsx-report-container',
    templateUrl: './eform-xlsx-report-container.component.html',
    styleUrls: ['./eform-xlsx-report-container.component.scss'],
    standalone: false
})
export class EformXlsxReportContainerComponent implements OnInit, OnDestroy {
  private translateService = inject(TranslateService);
  private activateRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private appMenuStateService = inject(AppMenuStateService);
  private toastrService = inject(ToastrService);
  private eFormService = inject(EFormService);

  dateFrom: any;
  dateTo: any;
  range: Date[] = [];
  selectedTemplateId: number;
  title: string;

  activatedRouteSub$: Subscription;
  generateReportSub$: Subscription;
  getSingleEformSub$: Subscription;
  appMenuObservableSub$: Subscription;

  constructor() {
    this.activatedRouteSub$ = this.activateRoute.params.subscribe((params) => {
      // Required to reload component
      if (this.selectedTemplateId) {
        this.router.navigate(['/']).then(() => {
          this.router.navigate([`/xlsx-report/${+params['eformId']}`]);
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
        dateFrom: this.dateFrom ? this.dateFrom.toString() : null,
        dateTo: this.dateTo ? this.dateTo.toString() : null,
        templateId: this.selectedTemplateId,
      };
      if (model.dateFrom) {
        this.onDownloadReport(model);
      }

      const href = this.router.url;
      // TODO: Fix this
      // this.appMenuObservableSub$ = this.appMenuStateService.appMenuObservable.subscribe(
      //   (appMenu) => {
      //     if (appMenu) {
      //       this.title = this.appMenuStateService.getTitleByUrl(href);
      //       if (!this.title) {
      //         this.getSingleEformSub$ = this.eFormService
      //           .getSingle(this.selectedTemplateId)
      //           .subscribe((data) => {
      //             if (data.success && data.model) {
      //               this.title = data.model.label;
      //             }
      //           });
      //       }
      //     }
      //   }
      // );
    });
  }

  ngOnInit() {
  }

  onDownloadReport(model: EformDocxReportGenerateModel) {
    this.generateReportSub$ = this.eFormService
      .downloadEformExcel(model)
      .subscribe((data) => {
          const blob = new Blob([data]);
          saveAs(blob, `template_${this.selectedTemplateId}.xlsx`);
        },
        (_) => {
          this.toastrService.info(this.translateService.instant('No data in selected period'));
        });
  }

  ngOnDestroy(): void {
  }
}
