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

  // get userRole(): string {
  //   return this.authStateService.currentRole;
  // }

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
  ) {
    this.activateRoute.params.subscribe((params) => {
      this.caseStateService.setTemplateId(+params['id']);
    });
  }
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
    this.loadTemplateData();
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
