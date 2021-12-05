import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserClaimsEnum } from 'src/app/common/const';
import { composeCasesTableHeaders } from 'src/app/common/helpers';
import {
  PageSettingsModel,
  EformPermissionsSimpleModel,
  TemplateDto,
  CaseListModel,
  CaseModel,
  TableHeaderElementModel,
} from 'src/app/common/models';
import {
  EFormService,
  CasesService,
  SecurityGroupEformsPermissionsService,
} from 'src/app/common/services';
import { saveAs } from 'file-saver';
import { CasesStateService } from '../store';
import { AppMenuStateService, AuthStateService } from 'src/app/common/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

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
    private appMenuStateService: AppMenuStateService
  ) {}
  @ViewChild('modalRemoveCase', { static: true }) modalRemoveCase;
  currentTemplate: TemplateDto = new TemplateDto();
  eformPermissionsSimpleModel: EformPermissionsSimpleModel = new EformPermissionsSimpleModel();
  caseListModel: CaseListModel = new CaseListModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  title: string;

  tableHeaders: TableHeaderElementModel[];
  appMenuSub$: Subscription;

  ngOnDestroy() {}

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.caseStateService.setTemplateId(+params['id']);
      this.loadTemplateData();
    });
  }

  onLabelInputChanged(label: string) {
    this.caseStateService.updateNameFilter(label);
    this.loadAllCases();
  }

  onDeleteClicked(caseModel: CaseModel) {
    this.modalRemoveCase.show(caseModel, this.currentTemplate.id);
  }

  sortTable(sort: string) {
    this.caseStateService.onSortTable(sort);
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

  changePage(offset: number) {
    this.caseStateService.changePage(offset);
    this.loadAllCases();
  }

  onPageSizeChanged(newPageSize: number) {
    this.caseStateService.updatePageSize(newPageSize);
    this.loadAllCases();
  }

  onCaseDeleted() {
    this.caseStateService.onDelete();
    this.loadAllCases();
  }

  private setTableHeaders() {
    this.tableHeaders = [
      { name: 'Id', elementId: '', sortable: true },
      { name: 'DoneAt', elementId: '', sortable: true },
      this.authStateService.isAdmin
          ? { name: 'CreatedAt', elementId: '', sortable: true }
          : null,
      { name: 'SiteId', elementId: '', sortable: true },
      this.currentTemplate.field1 && this.currentTemplate.field1.label
          ? {
            name: 'FieldValue1',
            elementId: '',
            sortable: true,
            visibleName: this.currentTemplate.field1.label,
          }
          : null,
      this.currentTemplate.field2 && this.currentTemplate.field2.label
          ? {
            name: 'FieldValue2',
            elementId: '',
            sortable: true,
            visibleName: this.currentTemplate.field2.label,
          }
          : null,
      this.currentTemplate.field3 && this.currentTemplate.field3.label
          ? {
            name: 'FieldValue3',
            elementId: '',
            sortable: true,
            visibleName: this.currentTemplate.field3.label,
          }
          : null,
      this.currentTemplate.field4 && this.currentTemplate.field4.label
          ? {
            name: 'FieldValue4',
            elementId: '',
            sortable: true,
            visibleName: this.currentTemplate.field4.label,
          }
          : null,
      this.currentTemplate.field5 && this.currentTemplate.field5.label
          ? {
            name: 'FieldValue5',
            elementId: '',
            sortable: true,
            visibleName: this.currentTemplate.field5.label,
          }
          : null,
      this.currentTemplate.field6 && this.currentTemplate.field6.label
          ? {
            name: 'FieldValue6',
            elementId: '',
            sortable: true,
            visibleName: this.currentTemplate.field6.label,
          }
          : null,
      this.currentTemplate.field7 && this.currentTemplate.field7.label
          ? {
            name: 'FieldValue7',
            elementId: '',
            sortable: true,
            visibleName: this.currentTemplate.field7.label,
          }
          : null,
      this.currentTemplate.field8 && this.currentTemplate.field8.label
          ? {
            name: 'FieldValue8',
            elementId: '',
            sortable: true,
            visibleName: this.currentTemplate.field8.label,
          }
          : null,
      this.currentTemplate.field9 && this.currentTemplate.field9.label
          ? {
            name: 'FieldValue9',
            elementId: '',
            sortable: true,
            visibleName: this.currentTemplate.field9.label,
          }
          : null,
      { name: 'Actions', elementId: '', sortable: false },
    ];
  }

  private setTitle() {
    const href = this.router.url;
    this.appMenuSub$ = this.appMenuStateService.appMenuObservable.subscribe(
      (appMenu) => {
        if (appMenu) {
          this.title = this.appMenuStateService.getTitleByUrl(href);
          if (!this.title) {
            this.title = this.currentTemplate.label;
          }
        }
      }
    );
  }
}
