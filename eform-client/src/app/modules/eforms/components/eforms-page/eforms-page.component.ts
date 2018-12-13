import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ApplicationPages, UserClaimsEnum} from 'src/app/common/enums';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {TemplateDto} from 'src/app/common/models/dto';
import {SavedTagModel, TemplateListModel, TemplateRequestModel} from 'src/app/common/models/eforms';
import {EformPermissionsSimpleModel} from 'src/app/common/models/security/group-permissions/eform';
import {PageSettingsModel} from 'src/app/common/models/settings';
import {AuthService, UserSettingsService} from 'src/app/common/services/auth';
import {EFormService, EformTagService} from 'src/app/common/services/eform';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';

@Component({
  selector: 'app-eform-page',
  templateUrl: './eforms-page.component.html',
  styleUrls: ['./eforms-page.component.scss']
})
export class EformsPageComponent implements OnInit {

  @ViewChild('modalNewEform') newEformModal;
  @ViewChild('modalCasesColumns') modalCasesColumnsModal;
  @ViewChild('modalParing') modalPairing;
  @ViewChild('modalEditTags') modalEditTags;
  @ViewChild('modalRemoveEform') modalRemoveEform;
  @ViewChild('modalUploadZip') modalUploadZip;

  spinnerStatus = false;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel;
  templateListModel: TemplateListModel = new TemplateListModel();
  eformPermissionsSimpleModel: Array<EformPermissionsSimpleModel> = [];
  availableTags: Array<CommonDictionaryModel> = [];

  mySubject = new Subject();

  get userClaims() { return this.authService.userClaims; }
  get userClaimsEnum() { return UserClaimsEnum; }

  items = [
    'New',
    'Legacy',
    'Test1'
  ];

  constructor(private eFormService: EFormService,
              private eFormTagService: EformTagService,
              private authService: AuthService,
              private securityGroupEformsService: SecurityGroupEformsPermissionsService,
              private userSettingsService: UserSettingsService
  ) {
    this.mySubject.pipe(
      debounceTime(500)
    ). subscribe(val => {
      debugger;
      this.templateRequestModel.nameFilter = val.toString();
      this.loadAllTemplates();
    });
  }

  ngOnInit() {
    this.loadEformsPermissions();
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.userSettingsService.getLocalPageSettings
    ('pagesSettings', ApplicationPages[ApplicationPages.Eforms])
      .settings;
    this.loadAllTags();
  }

  updateLocalPageSettings(localStorageItemName: string) {
    this.userSettingsService.updateLocalPageSettings
    (localStorageItemName, this.localPageSettings, ApplicationPages[ApplicationPages.Eforms]);
    this.getLocalPageSettings();
  }

  loadAllTemplates() {
    this.spinnerStatus = true;
    this.templateRequestModel.sort = this.localPageSettings.sort;
    this.templateRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.eFormService.getAll(this.templateRequestModel).subscribe(operation => {
      this.spinnerStatus = false;
      if (operation && operation.success) {
        this.templateListModel = operation.model;
      }
    });
  }

  loadAllTags() {
    if (this.userClaims.eFormsReadTags) {
      this.spinnerStatus = true;
      this.eFormTagService.getAvailableTags().subscribe((data) => {
        if (data && data.success) {
          this.availableTags = data.model;
          this.loadSelectedUserTags();
        }
      }, (error) => {
        this.spinnerStatus = false;
      });
    }
  }

  saveTag(e: any) {
    const savedTagModel = new SavedTagModel();
    savedTagModel.tagId = e.id;
    savedTagModel.tagName = e.name;
    this.spinnerStatus = true;
    this.eFormTagService.addSavedTag(savedTagModel).subscribe((data) => {
      if (data && data.success) {
        this.templateRequestModel.tagIds.push(e.id);
        this.loadAllTemplates();
      }
    }, (error) => {
      this.spinnerStatus = false;
    });
  }

  removeSavedTag(e: any) {
    this.spinnerStatus = true;
    this.eFormTagService.deleteSavedTag(e.value.id).subscribe(data => {
      if (data && data.success) {
        this.templateRequestModel.tagIds = this.templateRequestModel.tagIds.filter(x => x !== e.id);
        this.loadAllTemplates();
      }
    },(error) => {
      this.spinnerStatus = false;
    });
  }

  loadSelectedUserTags() {
    this.spinnerStatus = true;
    this.eFormTagService.getSavedTags().subscribe((data) => {
      if (data && data.success) {
        this.templateRequestModel.tagIds = data.model.tagList.map(x => x.tagId);
        this.loadAllTemplates();
      }
    }, (error) => {
      this.spinnerStatus = false;
    });
  }

  loadEformsPermissions() {
    this.spinnerStatus = false;
    this.securityGroupEformsService.getEformsSimplePermissions().subscribe((data) => {
      if (data && data.success) {
        this.eformPermissionsSimpleModel = this.securityGroupEformsService.mapEformsSimplePermissions(data.model);
      } this.spinnerStatus = false;
    }, (error) => {
      this.spinnerStatus = false;
    });
  }

  onLabelInputChanged(label: string) {
    this.mySubject.next(label);
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

  openNewEformModal() {
    this.newEformModal.show();
  }

  openEditColumnsModal(templateDto: TemplateDto) {
    this.modalCasesColumnsModal.show(templateDto);
  }

  openEformDeleteModal(templateDto: TemplateDto) {
    this.modalRemoveEform.show(templateDto);
  }

  uploadZipFile(templateDto: TemplateDto) {
    this.modalUploadZip.show(templateDto);
  }

  downloadItem(itemName: string, templateId: number) {
    if (itemName == 'XML') {
      window.open('/api/template-files/download-eform-xml/' + templateId, '_blank');
    } else {
      window.open('/api/template-files/csv/' + templateId, '_blank');
    }
  }

  openPairingModal(templateDto: TemplateDto) {
    this.modalPairing.show(templateDto);
  }

  openEditTagsModal(templateDto: TemplateDto) {
    this.modalEditTags.show(templateDto);
  }

  checkEformPermissions(templateId: number, permissionIndex: number) {
    const foundEform = this.eformPermissionsSimpleModel.find(x => x.templateId === templateId);
    if (foundEform) {
      return foundEform.permissionsSimpleList.find(x => x == UserClaimsEnum[permissionIndex].toString());
    } else {
      return this.userClaims[UserClaimsEnum[permissionIndex].toString()];
    }
  }
}
