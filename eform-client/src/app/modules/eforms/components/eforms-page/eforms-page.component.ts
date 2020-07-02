import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ApplicationPages, UserClaimsEnum} from 'src/app/common/const';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {TemplateDto} from 'src/app/common/models/dto';
import {SavedTagModel, TemplateListModel, TemplateRequestModel} from 'src/app/common/models/eforms';
import {EformPermissionsSimpleModel} from 'src/app/common/models/security/group-permissions/eform';
import {PageSettingsModel} from 'src/app/common/models/settings';
import {AuthService, UserSettingsService} from 'src/app/common/services/auth';
import {EFormService, EformTagService} from 'src/app/common/services/eform';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-eform-page',
  templateUrl: './eforms-page.component.html',
  styleUrls: ['./eforms-page.component.scss']
})
export class EformsPageComponent implements OnInit, OnDestroy {

  @ViewChild('modalNewEform', { static: true }) newEformModal;
  @ViewChild('modalCasesColumns', { static: true }) modalCasesColumnsModal;
  @ViewChild('modalParing', { static: true }) modalPairing;
  @ViewChild('modalEditTags', { static: true }) modalEditTags;
  @ViewChild('modalRemoveEform', { static: true }) modalRemoveEform;
  @ViewChild('modalUploadZip', { static: true }) modalUploadZip;
  @ViewChild('modalExcel', { static: true }) modalExcel;

  searchSubject = new Subject();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel;
  templateListModel: TemplateListModel = new TemplateListModel();
  eformPermissionsSimpleModel: Array<EformPermissionsSimpleModel> = [];
  availableTags: Array<CommonDictionaryModel> = [];

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
    this.searchSubject.pipe(
      debounceTime(500)
    ). subscribe(val => {
      this.templateRequestModel.nameFilter = val.toString();
      this.loadAllTemplates();
    });
  }

  ngOnInit() {
    this.loadEformsPermissions();
    this.getLocalPageSettings();
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
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
    this.templateRequestModel.sort = this.localPageSettings.sort;
    this.templateRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.eFormService.getAll(this.templateRequestModel).subscribe(operation => {
      if (operation && operation.success) {
        this.templateListModel = operation.model;
      }
    });
  }

  loadAllTags() {
    if (this.userClaims.eformsReadTags) {
      this.eFormTagService.getAvailableTags().subscribe((data) => {
        if (data && data.success) {
          this.availableTags = data.model;
          this.loadSelectedUserTags();
        }
      }, (error) => {
      });
    } else {
      this.loadAllTemplates();
    }
  }

  saveTag(e: any) {
    const savedTagModel = new SavedTagModel();
    savedTagModel.tagId = e.id;
    savedTagModel.tagName = e.name;
    this.eFormTagService.addSavedTag(savedTagModel).subscribe((data) => {
      if (data && data.success) {
        this.templateRequestModel.tagIds.push(e.id);
        this.loadAllTemplates();
      }
    }, (error) => {
    });
  }

  removeSavedTag(e: any) {
    this.eFormTagService.deleteSavedTag(e.value.id).subscribe(data => {
      if (data && data.success) {
        this.templateRequestModel.tagIds = this.templateRequestModel.tagIds.filter(x => x !== e.id);
        this.loadAllTemplates();
      }
    }, (error) => {
    });
  }

  loadSelectedUserTags() {
    this.eFormTagService.getSavedTags().subscribe((data) => {
      if (data && data.success) {
        this.templateRequestModel.tagIds = data.model.tagList.map(x => x.tagId);
        this.loadAllTemplates();
      }
    }, (error) => {
    });
  }

  loadEformsPermissions() {
    this.securityGroupEformsService.getEformsSimplePermissions().subscribe((data) => {
      if (data && data.success) {
        this.eformPermissionsSimpleModel = this.securityGroupEformsService.mapEformsSimplePermissions(data.model);
      }
    }, (error) => {
    });
  }

  onLabelInputChanged(label: string) {
    this.searchSubject.next(label);
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
    if (itemName === 'XML') {
      this.eFormService.downloadEformXML(templateId).subscribe(data => {
        const blob = new Blob([data]);
        saveAs(blob, `template_${templateId}.csv`);
      });
    } else {
      this.eFormService.downloadCSVFile(templateId).subscribe(data => {
        const blob = new Blob([data]);
        saveAs(blob, `template_${templateId}.csv`);
      });
    }
  }

  openPairingModal(templateDto: TemplateDto) {
    this.modalPairing.show(templateDto);
  }

  openEditTagsModal(templateDto: TemplateDto) {
    this.modalEditTags.show(templateDto);
  }

  openDownloadExcelModal(templateDto: TemplateDto) {
    this.modalExcel.show(templateDto);
  }

  checkEformPermissions(templateId: number, permissionIndex: number) {
    const foundEform = this.eformPermissionsSimpleModel.find(x => x.templateId === templateId);
    if (foundEform) {
      return foundEform.permissionsSimpleList.find(x => x === UserClaimsEnum[permissionIndex].toString());
    } else {
      return this.userClaims[UserClaimsEnum[permissionIndex].toString()];
    }
  }
}
