import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientsStateService} from '../store';
import {Sort} from '@angular/material/sort';
import {
  CommonDictionaryModel,
  Paged,
  EmailRecipientModel,
  PaginationModel,
} from 'src/app/common/models';
import {
  EmailRecipientDeleteComponent,
  EmailRecipientEditComponent,
  EmailRecipientsNewComponent,
  EmailRecipientsTagsComponent,
} from '../';
import {
  EmailRecipientsService,
  EmailRecipientsTagsService,
} from 'src/app/common/services';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {
  selectEmailRecipientsIsSortDsc,
  selectEmailRecipientsPagination, selectEmailRecipientsSort,
  selectEmailRecipientsTagIds
} from "src/app/state/email-recipients/email-recipiencts.selector";

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipients-page',
  templateUrl: './email-recipients-page.component.html',
  styleUrls: ['./email-recipients-page.component.scss'],
})
export class EmailRecipientsPageComponent implements OnInit, OnDestroy {
  @ViewChild('recipientsTagsModal')
  recipientTagsModal: EmailRecipientsTagsComponent;
  emailRecipientsListModel: Paged<EmailRecipientModel> = new Paged<EmailRecipientModel>();
  availableTags: CommonDictionaryModel[] = [];

  getAllSub$: Subscription;
  getTagsSub$: Subscription;
  emailRecipientDeleteComponentAfterClosedSub$: Subscription;
  emailRecipientEditComponentAfterClosedSub$: Subscription;
  emailRecipientsNewComponentAfterClosedSub$: Subscription;

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Name'), sortProp: {id: 'Name'}, field: 'name', sortable: true},
    {
      header: this.translateService.stream('Email'),
      field: 'email',
      sortable: true,
      sortProp: {id: 'Email'}
    },
    {header: this.translateService.stream('Tags'), field: 'tags'},
    {
      pinned: 'right',
      header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  public selectEmailRecipientsNameFilter$ = this.store.select(selectEmailRecipientsPagination);
  public selectEmailRecipientsSort$ = this.store.select(selectEmailRecipientsSort);
  public selectEmailRecipientsIsSortDsc$ = this.store.select(selectEmailRecipientsIsSortDsc);
  public selectEmailRecipientsPagination$ = this.store.select(selectEmailRecipientsPagination);
  public selectEmailRecipientsTagIds$ = this.store.select(selectEmailRecipientsTagIds);

  constructor(
    private store: Store,
    private emailRecipientsService: EmailRecipientsService,
    private tagsService: EmailRecipientsTagsService,
    public emailRecipientsStateService: EmailRecipientsStateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.getEmailRecipients();
    this.getTags();
  }

  getEmailRecipients() {
    this.getAllSub$ = this.emailRecipientsStateService
      .getEmailRecipients()
      .subscribe((data) => {
        if (data && data.success) {
          this.emailRecipientsListModel = data.model;
        }
      });
  }

  getTags() {
    this.getTagsSub$ = this.tagsService
      .getEmailRecipientsTags()
      .subscribe((data) => {
        if (data && data.success) {
          this.availableTags = data.model;
        }
      });
  }

  onSortTable(sort: Sort) {
    this.emailRecipientsStateService.onSortTable(sort.active);
    this.getEmailRecipients();
  }

  openCreateModal() {
    this.emailRecipientsNewComponentAfterClosedSub$ = this.dialog.open(EmailRecipientsNewComponent,
      {...dialogConfigHelper(this.overlay, this.availableTags), minWidth: 600})
      .afterClosed().subscribe(data => data ? this.onEmailRecipientCreated() : undefined);
  }

  openEditModal(model: EmailRecipientModel) {
    this.emailRecipientEditComponentAfterClosedSub$ = this.dialog.open(EmailRecipientEditComponent,
      dialogConfigHelper(this.overlay, {emailRecipientUpdateModel: model, availableTags: this.availableTags}))
      .afterClosed().subscribe(data => data ? this.getEmailRecipients() : undefined);
  }

  openDeleteModal(model: EmailRecipientModel) {
    this.emailRecipientDeleteComponentAfterClosedSub$ = this.dialog.open(EmailRecipientDeleteComponent,
      dialogConfigHelper(this.overlay, model))
      .afterClosed().subscribe(data => data ? this.onEmailRecipientDeleted() : undefined);
  }

  openTagsModal() {
    this.recipientTagsModal.show();
  }

  removeSavedTag(e: any) {
    this.emailRecipientsStateService.addOrRemoveTagIds(e.id);
    this.getEmailRecipients();
  }

  tagSelected(id: number) {
    this.emailRecipientsStateService.addOrRemoveTagIds(id);
    this.getEmailRecipients();
  }

  onEmailRecipientCreated() {
    this.getEmailRecipients();
    this.getTags();
  }

  onEmailRecipientDeleted() {
    this.emailRecipientsStateService.onDelete();
    this.getEmailRecipients();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.emailRecipientsStateService.updatePagination(paginationModel);
    this.getEmailRecipients();
  }

  ngOnDestroy(): void {
  }
}
