import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserClaimsEnum } from 'src/app/common/const';
import {
  SavedTagModel,
  TemplateListModel,
  EformPermissionsSimpleModel,
  TemplateDto,
  CommonDictionaryModel,
  TableHeaderElementModel,
} from 'src/app/common/models';
import {
  SecurityGroupEformsPermissionsService,
  EFormService,
  EformTagService,
  AuthService,
} from 'src/app/common/services';
import { saveAs } from 'file-saver';
import { EformsStateService } from '../../store';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-eform-page',
  templateUrl: './eforms-page.component.html',
  styleUrls: ['./eforms-page.component.scss'],
})
export class EformsPageComponent implements OnInit, OnDestroy {
  @ViewChild('modalNewEform', { static: true }) newEformModal;
  @ViewChild('modalCasesColumns', { static: true }) modalCasesColumnsModal;
  @ViewChild('modalParing', { static: true }) modalPairing;
  @ViewChild('modalEditTags', { static: true }) modalEditTags;
  @ViewChild('modalRemoveEform', { static: true }) modalRemoveEform;
  @ViewChild('modalUploadZip', { static: true }) modalUploadZip;
  @ViewChild('modalEformsImport', { static: true }) modalEformsImport;
  @ViewChild('modalTags', { static: true }) modalTags;
  @ViewChild('duplicateConfirm', { static: true }) duplicateConfirm;

  searchSubject = new Subject();
  templateListModel: TemplateListModel = new TemplateListModel();
  eformPermissionsSimpleModel: Array<EformPermissionsSimpleModel> = [];
  availableTags: Array<CommonDictionaryModel> = [];

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  get userClaimsEnum() {
    return UserClaimsEnum;
  }

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idSort', sortable: true },
    { name: 'CreatedAt', elementId: 'createdAtSort', sortable: true },
    {
      name: 'Text',
      visibleName: 'Label',
      elementId: 'nameEFormSort',
      sortable: true,
    },
    {
      name: 'Description',
      visibleName: 'Description',
      elementId: 'descriptionEFormSort',
      sortable: true,
    },
    { name: 'Tags', elementId: 'tagsEForm', sortable: false },
    { name: 'Pairing', elementId: 'pairingEForm', sortable: false },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private eFormService: EFormService,
    private eFormTagService: EformTagService,
    private authService: AuthService,
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    public eformsStateService: EformsStateService,
    public authStateService: AuthStateService
  ) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.eformsStateService.updateNameFilter(val);
      this.loadAllTags();
    });
  }

  ngOnInit() {
    this.loadEformsPermissions();
    this.loadAllTags();
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }

  loadAllTemplates() {
    this.eformsStateService.loadAllTemplates().subscribe((operation) => {
      if (operation && operation.success) {
        this.templateListModel = operation.model;
      }
    });
  }

  loadAllTags() {
    // load tags after call load templates (not know why)
    if (this.userClaims.eformsReadTags) {
      this.eFormTagService.getAvailableTags().subscribe((data) => {
        if (data && data.success) {
          this.availableTags = data.model;
          this.loadSelectedUserTags();
        }
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
        this.eformsStateService.addOrRemoveTagIds(e.id);
        this.loadAllTemplates();
      }
    });
  }

  removeSavedTag(e: any) {
    this.eFormTagService.deleteSavedTag(e.value.id).subscribe((data) => {
      if (data && data.success) {
        this.eformsStateService.addOrRemoveTagIds(e.value.id);
        this.loadAllTemplates();
      }
    });
  }

  loadSelectedUserTags() {
    this.eFormTagService.getSavedTags().subscribe((data) => {
      if (data && data.success) {
        if (data.model.tagList.length > 0) {
          this.eformsStateService.updateTagIds(
            data.model.tagList.map((x) => x.tagId)
          );
        }
        this.loadAllTemplates();
      }
    });
  }

  loadEformsPermissions() {
    this.securityGroupEformsService
      .getEformsSimplePermissions()
      .subscribe((data) => {
        if (data && data.success) {
          this.eformPermissionsSimpleModel = this.securityGroupEformsService.mapEformsSimplePermissions(
            data.model
          );
        }
      });
  }

  onLabelInputChanged(label: string) {
    this.searchSubject.next(label);
  }

  sortTable(sort: string) {
    this.eformsStateService.onSortTable(sort);
    this.loadAllTemplates();
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
      this.eFormService.downloadEformXML(templateId).subscribe((data) => {
        const blob = new Blob([data]);
        saveAs(blob, `eForm_${templateId}.xml`);
      });
    } else {
      this.eFormService.downloadCSVFile(templateId).subscribe((data) => {
        const blob = new Blob([data]);
        saveAs(blob, `eForm_${templateId}.csv`);
      });
    }
  }

  openPairingModal(templateDto: TemplateDto) {
    this.modalPairing.show(templateDto);
  }

  openEditTagsModal(templateDto: TemplateDto) {
    this.modalEditTags.show(templateDto);
  }

  openEformsImportModal() {
    this.modalEformsImport.show();
  }

  checkEformPermissions(templateId: number, permissionIndex: number) {
    const foundEform = this.eformPermissionsSimpleModel.find(
      (x) => x.templateId === templateId
    );
    if (foundEform) {
      return foundEform.permissionsSimpleList.find(
        (x) => x === UserClaimsEnum[permissionIndex].toString()
      );
    } else {
      return this.userClaims[UserClaimsEnum[permissionIndex].toString()];
    }
  }

  openTagsModal() {
    this.modalTags.show();
  }

  openDuplicateConfirmModal(templateDto: TemplateDto) {
    this.duplicateConfirm.show(templateDto);
  }
}
