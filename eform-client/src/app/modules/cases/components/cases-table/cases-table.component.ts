import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {PdfIcon, UserClaimsEnum, WordIcon} from 'src/app/common/const';
import {composeCasesTableHeaders, dialogConfigHelper} from 'src/app/common/helpers';
import {
  PageSettingsModel,
  EformPermissionsSimpleModel,
  TemplateDto,
  CaseListModel,
  CaseModel,
  PaginationModel,
} from 'src/app/common/models';
import {
  EFormService,
  CasesService,
  SecurityGroupEformsPermissionsService,
} from 'src/app/common/services';
import {saveAs} from 'file-saver';
import {CasesStateService} from '../store';
import {AppMenuStateService, AuthStateService} from 'src/app/common/store';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {CaseRemoveModalComponent} from 'src/app/common/modules/eform-cases/components';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';

@AutoUnsubscribe()
@Component({
  selector: 'app-cases-table',
  templateUrl: './cases-table.component.html',
})
export class CasesTableComponent implements OnInit, OnDestroy {
  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  get userClaimsEnum() {
    return UserClaimsEnum;
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private casesService: CasesService,
    private eFormService: EFormService,
    public authStateService: AuthStateService,
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    public caseStateService: CasesStateService,
    private router: Router,
    private appMenuStateService: AppMenuStateService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
    iconRegistry.addSvgIconLiteral('file-word', sanitizer.bypassSecurityTrustHtml(WordIcon));
    iconRegistry.addSvgIconLiteral('file-pdf', sanitizer.bypassSecurityTrustHtml(PdfIcon));
  }

  currentTemplate: TemplateDto = new TemplateDto();
  eformPermissionsSimpleModel: EformPermissionsSimpleModel = new EformPermissionsSimpleModel();
  caseListModel: CaseListModel = new CaseListModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  title: string;

  tableHeaders: MtxGridColumn[];
  appMenuSub$: Subscription;
  caseRemoveModalComponentAfterClosedSub$: Subscription;

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.caseStateService.setTemplateId(+params['id']);
      this.loadTemplateData();
    });
    this.tableHeaders = [
      {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
      {
        header: this.translateService.stream('DoneAt'),
        sortProp: {id: 'DoneAt'},
        field: 'doneAtUserModifiable',
        sortable: true,
        type: 'date',
        typeParameter: {format: 'dd.MM.y HH:mm:ss'}
      },];
    this.authStateService.isAdmin ? this.tableHeaders = [...this.tableHeaders, {
      header: this.translateService.stream('CreatedAt'),
      field: 'createdAt',
      sortable: true,
      sortProp: {id: 'CreatedAt'},
      type: 'date',
      typeParameter: {format: 'dd.MM.y HH:mm:ss'}
    }] : undefined;
    this.tableHeaders = [...this.tableHeaders, {
      header: this.translateService.stream('SiteId'),
      field: 'workerName',
      sortProp: {id: 'SiteId'},
      sortable: true,
    }];
  }

  onLabelInputChanged(label: string) {
    this.caseStateService.updateNameFilter(label);
    this.loadAllCases();
  }

  onDeleteClicked(caseModel: CaseModel) {
    this.caseRemoveModalComponentAfterClosedSub$ = this.dialog.open(CaseRemoveModalComponent,
      {...dialogConfigHelper(this.overlay, {caseModel: caseModel, templateId: this.currentTemplate.id}), minWidth: 600})
      .afterClosed()
      .subscribe(data => data ? this.onCaseDeleted() : undefined);
  }

  sortTable(sort: Sort) {
    this.caseStateService.onSortTable(sort.active);
    this.loadAllCases();
  }

  loadAllCases() {
    this.caseStateService.getCases().subscribe((operation) => {
      if (operation && operation.success) {
        this.caseListModel = operation.model;
        composeCasesTableHeaders(
          this.currentTemplate,
          this.authStateService.isAdmin
        );
      }
    });
  }

  loadTemplateData() {
    this.caseStateService.loadTemplateData().subscribe((operation) => {
      if (operation && operation.success) {
        this.currentTemplate = operation.model;
        this.loadEformPermissions(this.currentTemplate.id);
        this.loadAllCases();
        this.setTitle();
        this.setTableHeaders();
      }
    });
  }

  downloadFile(caseId: number, fileType: string) {
    this.eFormService
      .downloadEformPDF(this.currentTemplate.id, caseId, fileType)
      .subscribe((data) => {
        const blob = new Blob([data]);
        saveAs(blob, `template_${this.currentTemplate.id}.${fileType}`);
      });
  }

  loadEformPermissions(templateId: number) {
    if (this.securityGroupEformsService.mappedPermissions.length) {
      this.eformPermissionsSimpleModel = this.securityGroupEformsService.mappedPermissions.find(
        (x) => x.templateId === templateId
      );
    } else {
      this.securityGroupEformsService
        .getEformsSimplePermissions()
        .subscribe((data) => {
          if (data && data.success) {
            const foundTemplates = this.securityGroupEformsService.mapEformsSimplePermissions(
              data.model
            );
            if (foundTemplates.length) {
              this.eformPermissionsSimpleModel = foundTemplates.find(
                (x) => x.templateId === templateId
              );
            }
          }
        });
    }
  }

  checkEformPermissions(permissionIndex: number) {
    if (this.eformPermissionsSimpleModel.templateId) {
      return this.eformPermissionsSimpleModel.permissionsSimpleList.find(
        (x) => x === UserClaimsEnum[permissionIndex].toString()
      );
    } else {
      return this.userClaims[UserClaimsEnum[permissionIndex].toString()];
    }
  }

  onCaseDeleted() {
    this.caseStateService.onDelete();
    this.loadAllCases();
  }

  private setTableHeaders() {
    this.tableHeaders = [
      {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
      {
        header: this.translateService.stream('DoneAt'),
        sortProp: {id: 'DoneAt'},
        field: 'doneAtUserModifiable',
        sortable: true,
        type: 'date',
        typeParameter: {format: 'dd.MM.y HH:mm:ss'}
      },];
    this.authStateService.isAdmin ? this.tableHeaders = [...this.tableHeaders, {
      header: this.translateService.stream('CreatedAt'),
      field: 'createdAt',
      sortable: true,
      sortProp: {id: 'CreatedAt'},
      type: 'date',
      typeParameter: {format: 'dd.MM.y HH:mm:ss'}
    }] : undefined;
    this.tableHeaders = [...this.tableHeaders, {
      header: this.translateService.stream('SiteId'),
      field: 'workerName',
      sortProp: {id: 'SiteId'},
      sortable: true,
    }];
    this.currentTemplate.field1 && this.currentTemplate.field1.label
      ? this.tableHeaders = [...this.tableHeaders, {
        header: this.currentTemplate.field1.label,
        field: 'fieldValue1',
        sortable: true,
        sortProp: {id: 'FieldValue1'},
      formatter: (record: CaseModel) => {
        return record.fieldValue1;
      }
      }] : undefined;
    this.currentTemplate.field2 && this.currentTemplate.field2.label
      ? this.tableHeaders = [...this.tableHeaders, {
        header: this.currentTemplate.field2.label,
        field: 'fieldValue2',
        sortable: true,
        sortProp: {id: 'FieldValue2'},
        formatter: (record: CaseModel) => {
          return record.fieldValue2;
        },
      }] : undefined;
    this.currentTemplate.field3 && this.currentTemplate.field3.label
      ? this.tableHeaders = [...this.tableHeaders, {
        header: this.currentTemplate.field3.label,
        field: 'fieldValue3',
        sortable: true,
        sortProp: {id: 'FieldValue3'},
        formatter: (record: CaseModel) => {
          return record.fieldValue3;
        }
      }] : undefined;
    this.currentTemplate.field4 && this.currentTemplate.field4.label
      ? this.tableHeaders = [...this.tableHeaders, {
        header: this.currentTemplate.field4.label,
        field: 'fieldValue4',
        sortable: true,
        sortProp: {id: 'FieldValue4'},
        formatter: (record: CaseModel) => {
          return record.fieldValue4;
        }
      }] : undefined;
    this.currentTemplate.field5 && this.currentTemplate.field5.label
      ? this.tableHeaders = [...this.tableHeaders, {
        header: this.currentTemplate.field5.label,
        field: 'fieldValue5',
        sortable: true,
        sortProp: {id: 'FieldValue5'},
        formatter: (record: CaseModel) => {
          return record.fieldValue5;
        }
      }] : undefined;
    this.currentTemplate.field6 && this.currentTemplate.field6.label
      ? this.tableHeaders = [...this.tableHeaders, {
        header: this.currentTemplate.field6.label,
        field: 'fieldValue6',
        sortable: true,
        sortProp: {id: 'FieldValue6'},
        formatter: (record: CaseModel) => {
          return record.fieldValue6;
        }
      }] : undefined;
    this.currentTemplate.field7 && this.currentTemplate.field7.label
      ? this.tableHeaders = [...this.tableHeaders, {
        header: this.currentTemplate.field7.label,
        field: 'fieldValue7',
        sortable: true,
        sortProp: {id: 'FieldValue7'},
        formatter: (record: CaseModel) => {
          return record.fieldValue7;
        }
      }] : undefined;
    this.currentTemplate.field8 && this.currentTemplate.field8.label
      ? this.tableHeaders = [...this.tableHeaders, {
        header: this.currentTemplate.field8.label,
        field: 'fieldValue8',
        sortable: true,
        sortProp: {id: 'FieldValue8'},
        formatter: (record: CaseModel) => {
          return record.fieldValue8;
        }
      }] : undefined;
    this.currentTemplate.field9 && this.currentTemplate.field9.label
      ? this.tableHeaders = [...this.tableHeaders, {
        header: this.currentTemplate.field9.label,
        field: 'fieldValue9',
        sortable: true,
        sortProp: {id: 'FieldValue9'},
        formatter: (record: CaseModel) => {
          return record.fieldValue9;
        }
      }] : undefined;
    this.tableHeaders = [
      ...this.tableHeaders,
      { header: this.translateService.stream('Actions'), field: 'actions', },
    ];
  }

  private setTitle() {
    const href = this.router.url;
    // TODO: Fix this
    // this.appMenuSub$ = this.appMenuStateService.appMenuObservable.subscribe(
    //   (appMenu) => {
    //     if (appMenu) {
    //       this.title = this.appMenuStateService.getTitleByUrl(href);
    //       if (!this.title) {
    //         this.title = this.currentTemplate.label;
    //       }
    //     }
    //   }
    // );
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.caseStateService.updatePagination(paginationModel);
    this.loadAllCases();
  }

  ngOnDestroy() {
  }
}
