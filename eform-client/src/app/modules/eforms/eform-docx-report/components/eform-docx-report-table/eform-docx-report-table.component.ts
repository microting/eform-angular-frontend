import {
  ChangeDetectionStrategy,
  Component,
  Input, OnChanges,
  OnInit,
  SimpleChanges, TemplateRef, ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { EformDocxReportItemModel } from 'src/app/common/models';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import * as R from 'ramda';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-eform-docx-report-table',
  templateUrl: './eform-docx-report-table.component.html',
  styleUrls: ['./eform-docx-report-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EformDocxReportTableComponent implements OnInit, OnChanges {
  @ViewChild('caseFieldTpl', { static: true }) caseFieldTpl!: TemplateRef<any>;
  @Input() items: EformDocxReportItemModel[] = [];
  @Input() dateFrom: any;
  @Input() dateTo: any;
  @Input() itemHeaders: { key: string; value: string }[] = [];

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.get('Case Id'), field: 'microtingSdkCaseId'},
    {header: this.translateService.get('Created At'), field: 'createdAt'},
    {header: this.translateService.get('Done by'), field: 'doneBy',},
    {header: this.translateService.get('Actions'), field: 'actions',},
  ];

  constructor(private router: Router, private translateService: TranslateService) {}

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
          {header: this.translateService.get('Case Id'), field: 'microtingSdkCaseId'},
          {header: this.translateService.get('Created At'), field: 'createdAt'},
          {header: this.translateService.get('Done by'), field: 'doneBy',},
          ...itemHeaders,
          {
            header: this.translateService.get('Actions'),
            field: 'actions',
            type: 'button',
            buttons:[
              {
                type:'icon',
                icon: 'edit',
                color: 'accent',
                click: (record => this.router.navigate([`/cases/edit/${record.microtingSdkCaseId}/${record.eFormId}`])),
                tooltip: this.translateService.get('Edit Case'),
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
