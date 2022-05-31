import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { CasePostNewComponent, CasePostViewComponent } from '../..';
import {
  CasePostsService,
  UserSettingsService,
  EmailRecipientsService,
} from 'src/app/common/services';
import {
  EmailRecipientTagCommonModel,
  CasePostsListModel,
  CommonDictionaryModel,
  TableHeaderElementModel,
  PaginationModel,
} from 'src/app/common/models';
import { ActivatedRoute } from '@angular/router';
import { CasePostsStateService } from '../store';
import { AuthStateService } from 'src/app/common/store';
import {Sort} from '@angular/material/sort';

@AutoUnsubscribe()
@Component({
  selector: 'app-case-posts-page',
  templateUrl: './case-posts-page.component.html',
  styleUrls: ['./case-posts-page.component.scss'],
})
export class CasePostsPageComponent implements OnInit, OnDestroy {
  @ViewChild('newPostModal') newPostModal: CasePostNewComponent;
  @ViewChild('viewPostModal') viewPostModal: CasePostViewComponent;
  casePostsListModel: CasePostsListModel = new CasePostsListModel();
  availableRecipientsAndTags: EmailRecipientTagCommonModel[] = [];
  availableRecipients: CommonDictionaryModel[] = [];
  getAllSub$: Subscription;
  getTagsSub$: Subscription;
  getRecipientsSub$: Subscription;
  activatedRoute$: Subscription;
  selectedEformId: number;
  selectedCaseId: number;

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'Date', elementId: 'casePostDateTableHeader', sortable: true },
    { name: 'Post created by', elementId: '', sortable: false },
    { name: 'Post sent to', elementId: '', sortable: false },
    { name: 'Subject', elementId: '', sortable: false },
    { name: 'Text', elementId: '', sortable: false },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private userSettingsService: UserSettingsService,
    private casePostsService: CasePostsService,
    private emailRecipientsService: EmailRecipientsService,
    private activatedRoute: ActivatedRoute,
    public casePostsStateService: CasePostsStateService,
    public authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.activatedRoute$ = this.activatedRoute.params.subscribe((params) => {
      const templateId = +params['templateId'];
      const caseId = +params['id'];
      this.casePostsStateService.setTemplateId(templateId);
      this.selectedEformId = templateId;
      this.casePostsStateService.setCaseId(caseId);
      this.selectedCaseId = caseId;
      const postAction = params['postAction'];

      if (postAction === 'new') {
        setTimeout(() => {
          this.newPostModal.show();
        }, 1000);
      }
    });

    this.getCasePosts();
    this.getRecipientsAndTags();
    this.getRecipients();
  }

  getCasePosts() {
    this.getAllSub$ = this.casePostsStateService
      .getAllPosts()
      .subscribe((data) => {
        if (data && data.success) {
          this.casePostsListModel = data.model;
        }
      });
  }

  getRecipientsAndTags() {
    this.getTagsSub$ = this.emailRecipientsService
      .getEmailRecipientsAndTags()
      .subscribe((data) => {
        if (data && data.success) {
          this.availableRecipientsAndTags = data.model;
        }
      });
  }

  getRecipients() {
    this.getRecipientsSub$ = this.emailRecipientsService
      .getSimpleEmailRecipients()
      .subscribe((data) => {
        if (data && data.success) {
          this.availableRecipients = data.model;
        }
      });
  }

  sortTable(sort: Sort) {
    this.casePostsStateService.onSortTable(sort.active);
    this.getCasePosts();
  }

  openCreateModal() {
    this.newPostModal.show();
  }

  openViewModal(id: number) {
    this.viewPostModal.show(id);
  }

  ngOnDestroy(): void {}

  onPaginationChanged(paginationModel: PaginationModel) {
    this.casePostsStateService.updatePagination(paginationModel);
    this.getCasePosts();
  }
}
