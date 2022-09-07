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
    {header: 'Id', field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: 'Name', sortProp: {id: 'Name'}, field: 'name', sortable: true},
    {
      header: 'Email',
      field: 'email',
      sortable: true,
      sortProp: {id: 'Email'}
    },
    {header: 'Tags', field: 'tags'},
    {header: 'Actions', field: 'actions'},
  ]

  constructor(
    private emailRecipientsService: EmailRecipientsService,
    private tagsService: EmailRecipientsTagsService,
    public emailRecipientsStateService: EmailRecipientsStateService,
    private dialog: MatDialog,
    private overlay: Overlay,
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
    this.emailRecipientsStateService.addOrRemoveTagIds(e.value.id);
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
