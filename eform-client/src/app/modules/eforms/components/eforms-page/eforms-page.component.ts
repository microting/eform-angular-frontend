import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {CodeIcon, CsvIcon, ExcelIcon, FileUploadIcon, UserClaimsEnum, WordIcon} from 'src/app/common/const';
import {
  SavedTagModel,
  TemplateListModel,
  EformPermissionsSimpleModel,
  TemplateDto,
  CommonDictionaryModel, UserClaimsModel, SharedTagModel,
} from 'src/app/common/models';
import {
  SecurityGroupEformsPermissionsService,
  EFormService,
  EformTagService,
} from 'src/app/common/services';
import {saveAs} from 'file-saver';
import {EformsStateService} from '../../store';
import {Sort} from '@angular/material/sort';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {EformsTagsComponent} from 'src/app/common/modules/eform-shared-tags/components';
import {
  EformColumnsModalComponent,
  EformCreateModalComponent,
  EformDuplicateConfirmModalComponent,
  EformEditParingModalComponent,
  EformEditTagsModalComponent,
  EformRemoveEformModalComponent,
  EformsBulkImportModalComponent,
  EformUploadZipModalComponent,
} from '../../components';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import {
  selectCurrentUserClaims,
  selectCurrentUserClaimsEformsCreate, selectCurrentUserClaimsEformsReadTags,
  selectEformAllowManagingEformTags
} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';
import {
  selectEformsIsSortDsc,
  selectEformsNameFilter,
  selectEformsSort,
  selectEformsTagIds
} from 'src/app/state/eform/eform.selector';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-page',
  templateUrl: './eforms-page.component.html',
  styleUrls: ['./eforms-page.component.scss'],
})
export class EformsPageComponent implements OnInit, OnDestroy {
  @ViewChild('modalTags', {static: true}) modalTags: EformsTagsComponent;

  searchSubject = new Subject();
  templateListModel: TemplateListModel = new TemplateListModel();
  eformPermissionsSimpleModel: Array<EformPermissionsSimpleModel> = [];
  availableTags: Array<CommonDictionaryModel> = [];

  eformsBulkImportModalAfterClosedSub$: Subscription;
  downloadCSVFileSub$: Subscription;
  downloadEformXMLSub$: Subscription;
  getEformsSimplePermissionsSub$: Subscription;
  getSavedTagsSub$: Subscription;
  addSavedTagSub$: Subscription;
  deleteSavedTagSub$: Subscription;
  getAvailableTagsSub$: Subscription;
  loadAllTemplatesSub$: Subscription;
  searchSubjectSub$: Subscription;
  eformCreateModalComponentAfterClosedSub$: Subscription;
  eformDuplicateConfirmModalComponentAfterClosedSub$: Subscription;
  eformEditTagsModalComponentAfterClosedSub$: Subscription;
  eformUploadZipModalComponentAfterClosedSub$: Subscription;
  eformColumnsModalComponentAfterClosedSub$: Subscription;
  eformEditParingModalComponentAfterClosedSub$: Subscription;
  eformRemoveEformModalComponentAfterClosedSub$: Subscription;
  private selectCurrentUserClaims$ = this.store.select(selectCurrentUserClaims);
  public selectEformAllowManagingEformTags$ = this.store.select(selectEformAllowManagingEformTags)
  public selectCurrentUserClaimsEformsCreate$ = this.store.select(selectCurrentUserClaimsEformsCreate);
  public selectCurrentUserClaimsEformsReadTags$ = this.store.select(selectCurrentUserClaimsEformsReadTags);
  public selectEformsTagIds$ = this.store.select(selectEformsTagIds);
  public selectEformsNameFilter$ = this.store.select(selectEformsNameFilter);
  public selectEformsSort$ = this.store.select(selectEformsSort);
  public selectEformsIsSortDsc$ = this.store.select(selectEformsIsSortDsc);

  userClaims: UserClaimsModel;

  get userClaimsEnum() {
    return UserClaimsEnum;
  }

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true, type: 'number', class: 'eform-id-header'},
    {header: this.translateService.stream('Date'), sortProp: {id: 'CreatedAt'}, field: 'createdAt', sortable: true, class: 'eform-created-at-header'},
    {
      header: this.translateService.stream('eForm'),
      field: 'label',
      sortable: true,
      sortProp: {id: 'Text'},
      class: 'eform-name-header',
    },
    {
      header: this.translateService.stream('Description'),
      field: 'description',
      sortProp: {id: 'Description'},
      sortable: true,
    },
    {header: this.translateService.stream('Tags'), field: 'tags'},
    {header: this.translateService.stream('QuickSyncEnabled'), field: 'quickSyncEnabled'},
    {header: this.translateService.stream('Pairing'), field: 'pairingUpdate'},
    {
      pinned: 'right',
      header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  constructor(
    private store: Store,
    private eFormService: EFormService,
    private eFormTagService: EformTagService,
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    public eformsStateService: EformsStateService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
  ) {
    iconRegistry.addSvgIconLiteral('file-word', sanitizer.bypassSecurityTrustHtml(WordIcon));
    iconRegistry.addSvgIconLiteral('file-code', sanitizer.bypassSecurityTrustHtml(CodeIcon));
    iconRegistry.addSvgIconLiteral('file-csv', sanitizer.bypassSecurityTrustHtml(CsvIcon));
    iconRegistry.addSvgIconLiteral('file-upload', sanitizer.bypassSecurityTrustHtml(FileUploadIcon));
    iconRegistry.addSvgIconLiteral('file-excel', sanitizer.bypassSecurityTrustHtml(ExcelIcon));
    this.searchSubjectSub$ = this.searchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.eformsStateService.updateNameFilter(val);
      this.loadAllTags();
    });
    this.selectCurrentUserClaims$.subscribe((x) => {
      this.userClaims = x;
    });
  }

  ngOnInit() {
    this.loadEformsPermissions();
  }

  ngOnDestroy() {
  }

  loadAllTemplates() {
    this.loadAllTemplatesSub$ = this.eformsStateService.loadAllTemplates()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.templateListModel = operation.model;
        }
      });
  }

  loadAllTags() {
    // load tags after call load templates (not know why)
    //if (this.userClaims.eformsReadTags) {
      //debugger;
      this.getAvailableTagsSub$ = this.eFormTagService.getAvailableTags()
        .subscribe((data) => {
          if (data && data.success) {
            this.availableTags = data.model;
            this.loadSelectedUserTags();
          }
        });
    // } else {
    //   debugger;
    //   this.loadAllTemplates();
    // }
  }

  saveTag(e: CommonDictionaryModel) {
    const savedTagModel = new SavedTagModel();
    savedTagModel.tagId = e.id;
    savedTagModel.tagName = e.name;
    this.addSavedTagSub$ = this.eFormTagService.addSavedTag(savedTagModel).subscribe((data) => {
      if (data && data.success) {
        this.eformsStateService.addOrRemoveTagIds(e.id);
        this.loadAllTemplates();
      }
    });
  }

  removeSavedTag(e: CommonDictionaryModel) {
    this.deleteSavedTagSub$ = this.eFormTagService.deleteSavedTag(e.id).subscribe((data) => {
      if (data && data.success) {
        this.eformsStateService.addOrRemoveTagIds(e.id);
        this.loadAllTemplates();
      }
    });
  }

  loadSelectedUserTags() {
    this.getSavedTagsSub$ = this.eFormTagService.getSavedTags().subscribe((data) => {
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
    this.getEformsSimplePermissionsSub$ = this.securityGroupEformsService
      .getEformsSimplePermissions()
      .subscribe((data) => {
        if (data && data.success) {
          this.loadAllTags();
          this.eformPermissionsSimpleModel = this.securityGroupEformsService.mapEformsSimplePermissions(
            data.model
          );
        }
      });
  }

  onLabelInputChanged(label: string) {
    this.searchSubject.next(label);
  }

  sortTable(sort: Sort) {
    this.eformsStateService.onSortTable(sort.active);
    this.loadAllTemplates();
  }

  openNewEformModal() {
    this.eformCreateModalComponentAfterClosedSub$ = this.dialog.open(EformCreateModalComponent, {
      ...dialogConfigHelper(this.overlay, this.availableTags),
      minWidth: 400,
    }).afterClosed().subscribe(data => data ? this.loadAllTags() : undefined);
  }

  openEditColumnsModal(templateDto: TemplateDto) {
    this.eformColumnsModalComponentAfterClosedSub$ = this.dialog.open(EformColumnsModalComponent, {
      ...dialogConfigHelper(this.overlay, templateDto), minWidth: 800,
    }).afterClosed().subscribe(data => data ? undefined : undefined);
  }

  openEformDeleteModal(templateDto: TemplateDto) {
    this.eformRemoveEformModalComponentAfterClosedSub$ = this.dialog.open(EformRemoveEformModalComponent, {
      ...dialogConfigHelper(this.overlay, templateDto),
    }).afterClosed().subscribe(data => data ? this.loadAllTemplates() : undefined);
  }

  uploadZipFile(templateDto: TemplateDto) {
    this.eformUploadZipModalComponentAfterClosedSub$ = this.dialog.open(EformUploadZipModalComponent, {
      ...dialogConfigHelper(this.overlay, templateDto), minWidth: 400,
    }).afterClosed().subscribe(data => data ? undefined : undefined);
  }

  downloadItem(itemName: string, templateId: number) {
    if (itemName === 'XML') {
      this.downloadEformXMLSub$ = this.eFormService.downloadEformXML(templateId).subscribe((data) => {
        const blob = new Blob([data]);
        saveAs(blob, `eForm_${templateId}.xml`);
      });
    } else {
      this.downloadCSVFileSub$ = this.eFormService.downloadCSVFile(templateId).subscribe((data) => {
        const blob = new Blob([data]);
        saveAs(blob, `eForm_${templateId}.csv`);
      });
    }
  }

  openPairingModal(templateDto: TemplateDto) {
    this.eformEditParingModalComponentAfterClosedSub$ = this.dialog.open(EformEditParingModalComponent, {
      ...dialogConfigHelper(this.overlay, templateDto), minWidth: 600,
    }).afterClosed().subscribe(data => data ? this.loadAllTemplates() : undefined);
  }

  openEditTagsModal(templateDto: TemplateDto) {
    this.eformEditTagsModalComponentAfterClosedSub$ = this.dialog.open(EformEditTagsModalComponent, {
      ...dialogConfigHelper(this.overlay, {availableTags: this.availableTags, selectedTemplate: templateDto}),
      minWidth: 400,
    }).afterClosed().subscribe(data => data ? this.loadAllTemplates() : undefined);
  }

  openEformsImportModal() {
    this.eformsBulkImportModalAfterClosedSub$ = this.dialog.open(EformsBulkImportModalComponent, {
      ...dialogConfigHelper(this.overlay, this.availableTags),
      minWidth: 400,
    }).afterClosed().subscribe(data => data ? this.loadAllTags() : undefined);
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
    this.eformDuplicateConfirmModalComponentAfterClosedSub$ = this.dialog.open(EformDuplicateConfirmModalComponent, {
      ...dialogConfigHelper(this.overlay, templateDto),
    }).afterClosed().subscribe(data => data ? this.loadAllTemplates() : undefined);
  }

  getTags(template: TemplateDto): SharedTagModel[] {
    return template.tags.map(x => ({id: x.key, name: x.value} as SharedTagModel));
  }
}
