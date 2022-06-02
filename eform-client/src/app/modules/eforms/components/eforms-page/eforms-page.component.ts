import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {UserClaimsEnum} from 'src/app/common/const';
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
import {saveAs} from 'file-saver';
import {EformsStateService} from '../../store';
import {AuthStateService} from 'src/app/common/store';
import {Sort} from '@angular/material/sort';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {EformsTagsComponent} from 'src/app/common/modules/eform-shared-tags/components';
import {
  EformColumnsModalComponent,
  EformCreateModalComponent,
  EformDuplicateConfirmModalComponent, EformEditParingModalComponent, EformEditTagsModalComponent, EformRemoveEformModalComponent,
  EformsBulkImportModalComponent, EformUploadZipModalComponent
} from 'src/app/modules/eforms/components';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MtxGridColumn} from '@ng-matero/extensions/grid';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-page',
  templateUrl: './eforms-page.component.html',
  styleUrls: ['./eforms-page.component.scss'],
})
export class EformsPageComponent implements OnInit, OnDestroy {
  @ViewChild('modalCasesColumns', {static: true}) modalCasesColumnsModal;
  @ViewChild('modalParing', {static: true}) modalPairing;
  @ViewChild('modalRemoveEform', {static: true}) modalRemoveEform;
  @ViewChild('modalUploadZip', {static: true}) modalUploadZip;
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

  wordIcon = '<svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-word" ' +
    'class="svg-inline--fa fa-file-word fa-fw fa-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">' +
    '<path fill="currentColor" d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 ' +
    '48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM281.5 240h23.37c7.717 0 13.43 7.18 11.69 14.7l-42.46 ' +
    '184C272.9 444.1 268 448 262.5 448h-29.26c-5.426 0-10.18-3.641-11.59-8.883L192 329.1l-29.61 109.1C160.1 444.4 156.2 448 ' +
    '150.8 448H121.5c-5.588 0-10.44-3.859-11.69-9.305l-42.46-184C65.66 247.2 71.37 240 79.08 240h23.37c5.588 0 10.44 3.859 ' +
    '11.69 9.301L137.8 352L165.6 248.9C167 243.6 171.8 240 177.2 240h29.61c5.426 0 10.18 3.641 11.59 8.883L246.2 ' +
    '352l23.7-102.7C271.1 243.9 275.1 240 281.5 240zM256 0v128h128L256 0z"></path></svg>';
  codeIcon = '<svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-code" ' +
    'class="svg-inline--fa fa-file-code fa-fw fa-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">' +
    '<path fill="currentColor" d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 ' +
    '0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM154.1 353.8c7.812 7.812 7.812 20.5 0 28.31C150.2 ' +
    '386.1 145.1 388 140 388s-10.23-1.938-14.14-5.844l-48-48c-7.812-7.812-7.812-20.5 0-28.31l48-48c7.812-7.812 ' +
    '20.47-7.812 28.28 0s7.812 20.5 0 28.31L120.3 320L154.1 353.8zM306.1 305.8c7.812 7.812 7.812 20.5 0 28.31l-48 ' +
    '48C254.2 386.1 249.1 388 244 388s-10.23-1.938-14.14-5.844c-7.812-7.812-7.812-20.5 0-28.31L263.7 ' +
    '320l-33.86-33.84c-7.812-7.812-7.812-20.5 0-28.31s20.47-7.812 28.28 0L306.1 305.8zM256 0v128h128L256 0z"></path></svg>';
  csvIcon = '<svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-csv" class="svg-inline--fa ' +
    'fa-file-csv fa-fw fa-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M224 0V128C224 ' +
    '145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64C0 28.65 28.65 0 64 0H224zM80 224C57.91 ' +
    '224 40 241.9 40 264V344C40 366.1 57.91 384 80 384H96C118.1 384 136 366.1 136 344V336C136 327.2 128.8 320 120 320C111.2 320 104 ' +
    '327.2 104 336V344C104 348.4 100.4 352 96 352H80C75.58 352 72 348.4 72 344V264C72 259.6 75.58 256 80 256H96C100.4 256 104 259.6 ' +
    '104 264V272C104 280.8 111.2 288 120 288C128.8 288 136 280.8 136 272V264C136 241.9 118.1 224 96 224H80zM175.4 310.6L200.8 ' +
    '325.1C205.2 327.7 208 332.5 208 337.6C208 345.6 201.6 352 193.6 352H168C159.2 352 152 359.2 152 368C152 376.8 159.2 384 168 ' +
    '384H193.6C219.2 384 240 363.2 240 337.6C240 320.1 231.1 305.6 216.6 297.4L191.2 282.9C186.8 280.3 184 275.5 184 270.4C184 262.4 ' +
    '190.4 256 198.4 256H216C224.8 256 232 248.8 232 240C232 231.2 224.8 224 216 224H198.4C172.8 224 152 244.8 152 270.4C152 287 ' +
    '160.9 302.4 175.4 310.6zM280 240C280 231.2 272.8 224 264 224C255.2 224 248 231.2 248 240V271.6C248 306.3 258.3 340.3 277.6 ' +
    '369.2L282.7 376.9C285.7 381.3 290.6 384 296 384C301.4 384 306.3 381.3 309.3 376.9L314.4 369.2C333.7 340.3 344 306.3 344 271.6V240C344 ' +
    '231.2 336.8 224 328 224C319.2 224 312 231.2 312 240V271.6C312 294.6 306.5 317.2 296 337.5C285.5 317.2 280 294.6 ' +
    '280 271.6V240zM256 0L384 128H256V0z"></path></svg>';
  fileUpload = '<svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-arrow-up" class="svg-inline--fa ' +
    'fa-file-arrow-up fa-fw fa-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M256 ' +
    '0v128h128L256 0zM224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 ' +
    '160 224 145.7 224 128zM288.1 344.1C284.3 349.7 278.2 352 272 352s-12.28-2.344-16.97-7.031L216 305.9V408c0 13.25-10.75 24-24 ' +
    '24s-24-10.75-24-24V305.9l-39.03 39.03c-9.375 9.375-24.56 9.375-33.94 0s-9.375-24.56 0-33.94l80-80c9.375-9.375 24.56-9.375 33.94 ' +
    '0l80 80C298.3 320.4 298.3 335.6 288.1 344.1z"></path></svg>';
  excelIcon = '<svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-excel" class="svg-inline--fa ' +
    'fa-file-excel fa-fw fa-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M224 128L224 ' +
    '0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM272.1 ' +
    '264.4L224 344l48.99 79.61C279.6 434.3 271.9 448 259.4 448h-26.43c-5.557 0-10.71-2.883-13.63-7.617L192 396l-27.31 44.38C161.8 445.1 ' +
    '156.6 448 151.1 448H124.6c-12.52 0-20.19-13.73-13.63-24.39L160 344L111 264.4C104.4 253.7 112.1 240 124.6 240h26.43c5.557 0 10.71 ' +
    '2.883 13.63 7.613L192 292l27.31-44.39C222.2 242.9 227.4 240 232.9 240h26.43C271.9 240 279.6 253.7 272.1 ' +
    '264.4zM256 0v128h128L256 0z"></path></svg>';

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  get userClaimsEnum() {
    return UserClaimsEnum;
  }

  tableHeaders: MtxGridColumn[] = [
    {header: 'Id', field: 'id', sortProp: {id: 'Id'}, sortable: true, type: 'number'},
    {header: 'CreatedAt', sortProp: {id: 'CreatedAt'}, field: 'createdAt', sortable: true},
    {
      header: 'Label',
      field: 'label',
      sortable: true,
      sortProp: {id: 'Text'},
    },
    {
      header: 'Description',
      field: 'description',
      sortProp: {id: 'Description'},
      sortable: true,
    },
    {header: 'Tags', field: 'tags'},
    {header: 'Pairing', field: 'pairingUpdate'},
    {header: 'Actions', field: 'actions'},
  ];

  constructor(
    private eFormService: EFormService,
    private eFormTagService: EformTagService,
    private authService: AuthService,
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    public eformsStateService: EformsStateService,
    public authStateService: AuthStateService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private overlay: Overlay
  ) {
    iconRegistry.addSvgIconLiteral('file-word', sanitizer.bypassSecurityTrustHtml(this.wordIcon));
    iconRegistry.addSvgIconLiteral('file-code', sanitizer.bypassSecurityTrustHtml(this.codeIcon));
    iconRegistry.addSvgIconLiteral('file-csv', sanitizer.bypassSecurityTrustHtml(this.csvIcon));
    iconRegistry.addSvgIconLiteral('file-upload', sanitizer.bypassSecurityTrustHtml(this.fileUpload));
    iconRegistry.addSvgIconLiteral('file-excel', sanitizer.bypassSecurityTrustHtml(this.excelIcon));
    this.searchSubjectSub$ = this.searchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
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
    this.loadAllTemplatesSub$ = this.eformsStateService.loadAllTemplates()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.templateListModel = operation.model;
        }
      });
  }

  loadAllTags() {
    // load tags after call load templates (not know why)
    if (this.userClaims.eformsReadTags) {
      this.getAvailableTagsSub$ = this.eFormTagService.getAvailableTags()
        .subscribe((data) => {
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
    this.addSavedTagSub$ = this.eFormTagService.addSavedTag(savedTagModel).subscribe((data) => {
      if (data && data.success) {
        this.eformsStateService.addOrRemoveTagIds(e.id);
        this.loadAllTemplates();
      }
    });
  }

  removeSavedTag(e: any) {
    this.deleteSavedTagSub$ = this.eFormTagService.deleteSavedTag(e.value.id).subscribe((data) => {
      if (data && data.success) {
        this.eformsStateService.addOrRemoveTagIds(e.value.id);
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
      ...dialogConfigHelper(this.overlay, templateDto), minWidth: 400,
    }).afterClosed().subscribe(data => data ? undefined : undefined);
  }

  openEformDeleteModal(templateDto: TemplateDto) {
    this.eformRemoveEformModalComponentAfterClosedSub$ = this.dialog.open(EformRemoveEformModalComponent, {
      ...dialogConfigHelper(this.overlay, templateDto),
    }).afterClosed().subscribe(data => data ? this.loadAllTemplates() : undefined);
  }

  uploadZipFile(templateDto: TemplateDto) {
    this.eformUploadZipModalComponentAfterClosedSub$ = this.dialog.open(EformUploadZipModalComponent, {
      ...dialogConfigHelper(this.overlay, {availableTags: this.availableTags, selectedTemplate: templateDto}), minWidth: 400,
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
}
