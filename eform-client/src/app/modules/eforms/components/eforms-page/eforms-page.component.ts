import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserClaimsEnum } from 'src/app/common/const';
import {
  CommonDictionaryModel,
  TableHeaderElementModel,
} from 'src/app/common/models/common';
import { TemplateDto } from 'src/app/common/models/dto';
import { SavedTagModel, TemplateListModel } from 'src/app/common/models/eforms';
import { EformPermissionsSimpleModel } from 'src/app/common/models/security/group-permissions/eform';
import { AuthService } from 'src/app/common/services/auth';
import { EFormService, EformTagService } from 'src/app/common/services/eform';
import { SecurityGroupEformsPermissionsService } from 'src/app/common/services/security';
import { saveAs } from 'file-saver';
import { EformsStateService } from 'src/app/modules/eforms/state/eforms-state.service';
import { updateTableSorting } from 'src/app/common/helpers';

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
  @ViewChild('modalExcel', { static: true }) modalExcel;
  @ViewChild('modalEformsImport', { static: true }) modalEformsImport;

  searchSubject = new Subject();
  templateListModel: TemplateListModel = new TemplateListModel();
  eformPermissionsSimpleModel: Array<EformPermissionsSimpleModel> = [];
  availableTags: Array<CommonDictionaryModel> = [];

  get userClaims() {
    return this.authService.userClaims;
  }
  get userClaimsEnum() {
    return UserClaimsEnum;
  }
  get userRole() {
    return this.authService.currentRole;
  }

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idSort', sortable: true },
    { name: 'CreatedAt', elementId: 'createdAtSort', sortable: true },
    {
      name: 'Label',
      elementId: 'nameEFormSort',
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
    public eformsStateService: EformsStateService
  ) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.eformsStateService.updateNameFilter(val.toString());
      this.loadAllTags();
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
    this.loadAllTags();
  }

  loadAllTemplates() {
    this.eformsStateService.loadAllTemplates().subscribe((operation) => {
      if (operation && operation.success) {
        this.templateListModel = operation.model;
      }
    });
  }

  loadAllTags() {
    if (this.userClaims.eformsReadTags) {
      this.eFormTagService.getAvailableTags().subscribe(
        (data) => {
          if (data && data.success) {
            this.availableTags = data.model;
            this.loadSelectedUserTags();
          }
        },
        (error) => {}
      );
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
        this.eformsStateService.addTagIds(e.id);
        this.loadAllTemplates();
      }
    });
  }

  removeSavedTag(e: any) {
    this.eFormTagService.deleteSavedTag(e.value.id).subscribe(
      (data) => {
        if (data && data.success) {
          this.eformsStateService.removeTagIds(e.value.id);
          this.loadAllTemplates();
        }
      },
      (error) => {}
    );
  }

  loadSelectedUserTags() {
    this.eFormTagService.getSavedTags().subscribe(
      (data) => {
        if (data && data.success) {
          if (data.model.tagList.length > 0) {
            this.eformsStateService.updateTagIds(
              data.model.tagList.map((x) => x.tagId)
            );
          }
          this.loadAllTemplates();
        }
      },
      (error) => {}
    );
  }

  loadEformsPermissions() {
    this.securityGroupEformsService.getEformsSimplePermissions().subscribe(
      (data) => {
        if (data && data.success) {
          this.eformPermissionsSimpleModel = this.securityGroupEformsService.mapEformsSimplePermissions(
            data.model
          );
        }
      },
      (error) => {}
    );
  }

  onLabelInputChanged(label: string) {
    this.searchSubject.next(label);
  }

  sortTable(sort: string) {
    const localPageSettings = updateTableSorting(sort, {
      sort: this.eformsStateService.sort,
      isSortDsc: this.eformsStateService.isSortDsc,
      pageSize: 0,
      additional: [],
    });
    this.eformsStateService.updateIsSortDsc(localPageSettings.isSortDsc);
    this.eformsStateService.updateSort(localPageSettings.sort);
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

  openDownloadExcelModal(templateDto: TemplateDto) {
    this.modalExcel.show(templateDto);
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
}
