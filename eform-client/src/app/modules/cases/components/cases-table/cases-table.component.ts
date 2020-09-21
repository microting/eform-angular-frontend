import {ActivatedRoute} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationPages, UserClaimsEnum} from 'src/app/common/const';
import {CaseListModel, CaseModel, CasesRequestModel} from 'src/app/common/models/cases';
import {TemplateDto} from 'src/app/common/models/dto';
import {EformPermissionsSimpleModel} from 'src/app/common/models/security/group-permissions/eform';
import {PageSettingsModel} from 'src/app/common/models/settings';
import {AuthService, UserSettingsService} from 'src/app/common/services/auth';
import {CasesService} from 'src/app/common/services/cases';
import {EFormService} from 'src/app/common/services/eform';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-cases-table',
  templateUrl: './cases-table.component.html'
})
export class CasesTableComponent implements OnInit {
  @ViewChild('modalRemoveCase', { static: true }) modalRemoveCase;
  currentTemplate: TemplateDto = new TemplateDto;
  eformPermissionsSimpleModel: EformPermissionsSimpleModel = new EformPermissionsSimpleModel();
  casesRequestModel: CasesRequestModel = new CasesRequestModel();
  caseListModel: CaseListModel = new CaseListModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  id: number;

  get userClaims() { return this.authService.userClaims; }
  get userRole() { return this.authService.currentRole; }
  get userClaimsEnum() { return UserClaimsEnum; }

  constructor(private activateRoute: ActivatedRoute,
              private casesService: CasesService,
              private eFormService: EFormService,
              private authService: AuthService,
              private securityGroupEformsService: SecurityGroupEformsPermissionsService,
              public userSettingsService: UserSettingsService) {
    this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

  ngOnInit() {
    this.loadTemplateData();
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.userSettingsService.getLocalPageSettings
    ('pagesSettings', ApplicationPages[ApplicationPages.Cases])
      .settings;
    this.loadAllCases();
  }

  updateLocalPageSettings(localStorageItemName: string) {
    this.userSettingsService.updateLocalPageSettings
    (localStorageItemName, this.localPageSettings, ApplicationPages[ApplicationPages.Cases]);
    this.getLocalPageSettings();
  }

  onLabelInputChanged(label: string) {
    this.casesRequestModel.nameFilter = label;
    this.loadAllCases();
  }

  onDeleteClicked(caseModel: CaseModel) {
    this.modalRemoveCase.show(caseModel, this.currentTemplate.id);
  }

  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings('pagesSettings');
  }

  loadAllCases() {
    this.casesRequestModel.templateId = this.id;
    this.casesRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.casesRequestModel.sort = this.localPageSettings.sort;
    this.casesRequestModel.pageSize = this.localPageSettings.pageSize;
    this.casesService.getCases(this.casesRequestModel).subscribe(operation => {
      if (operation && operation.success) {
        this.caseListModel = operation.model;
      }
    });
  }

  loadTemplateData() {
    this.eFormService.getSingle(this.id).subscribe(operation => {
      if (operation && operation.success) {
        this.currentTemplate = operation.model;
        this.loadEformPermissions(this.currentTemplate.id);
      }
    });
  }

  downloadFile(caseId: number, fileType: string) {
    this.eFormService.downloadEformPDF(this.currentTemplate.id, caseId, fileType).subscribe(data => {
      const blob = new Blob([data]);
      saveAs(blob, `template_${this.currentTemplate.id}.${fileType}`);
    });
  }

  loadEformPermissions(templateId: number) {
    if (this.securityGroupEformsService.mappedPermissions.length) {
      this.eformPermissionsSimpleModel = this.securityGroupEformsService.mappedPermissions.find(x => x.templateId === templateId);
    } else {
      this.securityGroupEformsService.getEformsSimplePermissions().subscribe((data => {
        if (data && data.success) {
          const foundTemplates = this.securityGroupEformsService.mapEformsSimplePermissions(data.model);
          if (foundTemplates.length) {
            this.eformPermissionsSimpleModel = foundTemplates.find(x => x.templateId === templateId);
          }
        }
      }));
    }
  }

  checkEformPermissions(permissionIndex: number) {
    if (this.eformPermissionsSimpleModel.templateId) {
      return this.eformPermissionsSimpleModel.permissionsSimpleList.find(x => x === UserClaimsEnum[permissionIndex].toString());
    } else {
      return this.userClaims[UserClaimsEnum[permissionIndex].toString()];
    }
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.casesRequestModel.offset = e;
      if (e === 0) {
        this.casesRequestModel.pageIndex = 0;
      } else {
        this.casesRequestModel.pageIndex
          = Math.floor(e / this.casesRequestModel.pageSize);
      }
      this.loadAllCases();
    }
  }
}
