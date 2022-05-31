import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientsStateService} from '../store';
import {Sort} from '@angular/material/sort';
import {
  CommonDictionaryModel,
  Paged,
  TableHeaderElementModel,
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

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipients-page',
  templateUrl: './email-recipients-page.component.html',
  styleUrls: ['./email-recipients-page.component.scss'],
})
export class EmailRecipientsPageComponent implements OnInit, OnDestroy {
  @ViewChild('newRecipientsModal')
  newRecipientsModal: EmailRecipientsNewComponent;
  @ViewChild('editRecipientModal')
  editRecipientModal: EmailRecipientEditComponent;
  @ViewChild('deleteRecipientModal')
  deleteRecipientModal: EmailRecipientDeleteComponent;
  @ViewChild('recipientsTagsModal')
  recipientTagsModal: EmailRecipientsTagsComponent;
  emailRecipientsListModel: Paged<EmailRecipientModel> = new Paged<EmailRecipientModel>();
  availableTags: CommonDictionaryModel[] = [];
  getAllSub$: Subscription;
  getTagsSub$: Subscription;

  tableHeaders: TableHeaderElementModel[] = [
    {name: 'Id', elementId: 'idTableHeader', sortable: true},
    {
      name: 'Name',
      elementId: 'emailRecipientNameTableHeader',
      sortable: true,
    },
    {
      name: 'Email',
      elementId: 'emailRecipientEmailTableHeader',
      sortable: true,
    },
    {name: 'Tags', elementId: '', sortable: false},
    {name: 'Actions', elementId: '', sortable: false},
  ];

  constructor(
    private emailRecipientsService: EmailRecipientsService,
    private tagsService: EmailRecipientsTagsService,
    public emailRecipientsStateService: EmailRecipientsStateService
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
    this.newRecipientsModal.show();
  }

  openEditModal(model: EmailRecipientModel) {
    this.editRecipientModal.show(model);
  }

  openDeleteModal(model: EmailRecipientModel) {
    this.deleteRecipientModal.show(model);
  }

  openTagsModal() {
    this.recipientTagsModal.show();
  }

  removeSavedTag(e: any) {
    this.emailRecipientsStateService.addOrRemoveTagIds(e.value.id);
    this.getEmailRecipients();
  }

  ngOnDestroy(): void {
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
}
