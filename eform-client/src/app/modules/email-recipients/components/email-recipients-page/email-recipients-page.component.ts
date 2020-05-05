import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from '../../../../common/models/settings';
import {Subscription} from 'rxjs';
import {CommonDictionaryModel} from '../../../../common/models/common';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {
  EmailRecipientDeleteComponent,
  EmailRecipientEditComponent,
  EmailRecipientsNewComponent,
  EmailRecipientsTagsComponent
} from '../index';
import {UserSettingsService} from '../../../../common/services/auth';
import {ApplicationPages} from '../../../../common/const';
import {EmailRecipientsService, EmailRecipientsTagsService} from '../../../../common/services/email-recipients';
import {EmailRecipientModel, EmailRecipientsListModel, EmailRecipientsRequestModel} from '../../../../common/models/email-recipients';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipients-page',
  templateUrl: './email-recipients-page.component.html',
  styleUrls: ['./email-recipients-page.component.scss']
})
export class EmailRecipientsPageComponent implements OnInit, OnDestroy {
  @ViewChild('newRecipientsModal') newRecipientsModal: EmailRecipientsNewComponent;
  @ViewChild('editRecipientModal') editRecipientModal: EmailRecipientEditComponent;
  @ViewChild('deleteRecipientModal') deleteRecipientModal: EmailRecipientDeleteComponent;
  @ViewChild('recipientsTagsModal') recipientTagsModal: EmailRecipientsTagsComponent;
  emailRecipientsListModel: EmailRecipientsListModel = new EmailRecipientsListModel();
  emailRecipientsRequestModel: EmailRecipientsRequestModel = new EmailRecipientsRequestModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  availableTags: CommonDictionaryModel[] = [];
  getAllSub$: Subscription;
  getTagsSub$: Subscription;


  constructor(private userSettingsService: UserSettingsService,
              private emailRecipientsService: EmailRecipientsService,
              private tagsService: EmailRecipientsTagsService) {
  }

  ngOnInit(): void {
    this.getLocalPageSettings();
    this.getTags();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.userSettingsService.getLocalPageSettings
    ('pagesSettings', ApplicationPages[ApplicationPages.EmailRecipients])
      .settings;
    this.getEmailRecipients();
  }

  updateLocalPageSettings() {
    this.userSettingsService.updateLocalPageSettings
    ('pagesSettings', this.localPageSettings, ApplicationPages[ApplicationPages.EmailRecipients]);
    this.getLocalPageSettings();
  }


  getEmailRecipients() {
    this.emailRecipientsRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.emailRecipientsRequestModel.sort = this.localPageSettings.sort;
    this.emailRecipientsRequestModel.pageSize = this.localPageSettings.pageSize;

    this.getAllSub$ = this.emailRecipientsService.getEmailRecipients(this.emailRecipientsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.emailRecipientsListModel = data.model;
      }
    });
  }

  getTags() {
    this.getTagsSub$ = this.tagsService.getEmailRecipientsTags().subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
    });
  }


  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.emailRecipientsRequestModel.offset = e;
      this.getEmailRecipients();
    }
  }

  getSortIcon(sort: string): string {
    if (this.emailRecipientsRequestModel.sort === sort) {
      return this.emailRecipientsRequestModel.isSortDsc ? 'expand_more' : 'expand_less';
    } else {
      return 'unfold_more';
    }
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

  saveTag(e: any) {
    this.emailRecipientsRequestModel.tagIds.push(e.id);
    this.getEmailRecipients();
  }

  removeSavedTag(e: any) {
    this.emailRecipientsRequestModel.tagIds = this.emailRecipientsRequestModel.tagIds.filter(x => x !== e.id);
    this.getEmailRecipients();
  }

  ngOnDestroy(): void {
  }

  tagSelected(id: number) {
    if (!this.emailRecipientsRequestModel.tagIds.find(x => x === id)) {
      this.emailRecipientsRequestModel.tagIds = [...this.emailRecipientsRequestModel.tagIds, id];
      this.getEmailRecipients();
    }
  }

  onEmailRecipientCreated() {
    this.getEmailRecipients();
    this.getTags();
  }
}
