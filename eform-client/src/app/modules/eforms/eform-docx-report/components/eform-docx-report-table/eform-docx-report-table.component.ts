import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild, inject } from '@angular/core';
import { EformDocxReportItemModel } from 'src/app/common/models';
import { MtxGridColumn, MtxGrid } from '@ng-matero/extensions/grid';
import * as R from 'ramda';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { DateFormatterComponent } from '../../../../../common/modules/eform-shared/components/date-formatter/date-formatter.component';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-eform-docx-report-table',
    templateUrl: './eform-docx-report-table.component.html',
    styleUrls: ['./eform-docx-report-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MtxGrid, DateFormatterComponent, NgIf, MatIcon]
})
export class EformDocxReportTableComponent implements OnInit, OnChanges {
  private router = inject(Router);
  private translateService = inject(TranslateService);

  @ViewChild('caseFieldTpl', { static: true }) caseFieldTpl!: TemplateRef<any>;
  @Input() items: EformDocxReportItemModel[] = [];
  @Input() dateFrom: any;
  @Input() dateTo: any;
  @Input() itemHeaders: { key: string; value: string }[] = [];

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Case Id'), field: 'microtingSdkCaseId'},
    {header: this.translateService.stream('Created At'), field: 'createdAt'},
    {header: this.translateService.stream('Done by'), field: 'doneBy',},
    {header: this.translateService.stream('Actions'), field: 'actions',},
  ];

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.itemHeaders && !changes.itemHeaders.isFirstChange() && changes.itemHeaders.currentValue &&
        changes.items && !changes.items.isFirstChange() && changes.items.currentValue) {
      const itemHeaders =
        this.itemHeaders.map((x, index) => {
          return {
            header: x.value,
            field: index.toString(),
            cellTemplate: this.caseFieldTpl,
          }
        });
      this.tableHeaders =
        [
          {header: this.translateService.stream('Case Id'), field: 'microtingSdkCaseId'},
          {header: this.translateService.stream('Created At'), field: 'createdAt'},
          {header: this.translateService.stream('Done by'), field: 'doneBy',},
          ...itemHeaders,
          {
            header: this.translateService.stream('Actions'),
            field: 'actions',
            type: 'button',
            buttons:[
              {
                type:'icon',
                icon: 'edit',
                color: 'accent',
                click: (record => this.router.navigate([`/cases/edit/${record.microtingSdkCaseId}/${record.eFormId}`])),
                tooltip: this.translateService.stream('Edit Case'),
              }
            ]
          },
        ]
    }
  }

  getCaseFieldValue(row: EformDocxReportItemModel, path: string) {
    const lensPath = R.lensPath(['caseFields', path]);
    return R.view(
      lensPath,
      row
    );
  }
}
