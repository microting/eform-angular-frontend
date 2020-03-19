import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from '../../../../../common/models/settings';
import {Subscription} from 'rxjs';
import {UserSettingsService} from '../../../../../common/services/auth';
import {ApplicationPages} from '../../../../../common/const';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {CasePostNewComponent, CasePostViewComponent} from '../..';
import {CasePostsListModel, CasePostsRequestModel} from '../../../../../common/models/cases';
import {CasePostsService} from '../../../../../common/services/cases';
import {EmailRecipientsService} from '../../../../../common/services/email-recipients';
import {EmailRecipientTagCommonModel} from '../../../../../common/models/email-recipients';
import {ActivatedRoute} from '@angular/router';
import {CommonDictionaryModel} from '../../../../../common/models/common';

@AutoUnsubscribe()
@Component({
  selector: 'app-case-posts-page',
  templateUrl: './case-posts-page.component.html',
  styleUrls: ['./case-posts-page.component.scss']
})
export class CasePostsPageComponent implements OnInit, OnDestroy {
  @ViewChild('newPostModal') newPostModal: CasePostNewComponent;
  @ViewChild('viewPostModal') viewPostModal: CasePostViewComponent;
  casePostsListModel: CasePostsListModel = new CasePostsListModel();
  casePostsRequestModel: CasePostsRequestModel = new CasePostsRequestModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  spinnerStatus = false;
  availableRecipientsAndTags: EmailRecipientTagCommonModel[] = [];
  availableRecipients: CommonDictionaryModel[] = [];
  getAllSub$: Subscription;
  getTagsSub$: Subscription;
  getRecipientsSub$: Subscription;
  selectedEformId: number;
  selectedCaseId: number;


  constructor(private userSettingsService: UserSettingsService,
              private casePostsService: CasePostsService,
              private emailRecipientsService: EmailRecipientsService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.selectedEformId = +params['templateId'];
      this.selectedCaseId = +params['id'];
    });

    this.getLocalPageSettings();
    this.getRecipientsAndTags();
    this.getRecipients();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.userSettingsService.getLocalPageSettings
    ('pagesSettings', ApplicationPages[ApplicationPages.CasePosts])
      .settings;
    this.getCasePosts();
  }

  updateLocalPageSettings() {
    this.userSettingsService.updateLocalPageSettings
    ('pagesSettings', this.localPageSettings, ApplicationPages[ApplicationPages.CasePosts]);
    this.getLocalPageSettings();
  }


  getCasePosts() {
    this.spinnerStatus = true;
    this.casePostsRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.casePostsRequestModel.sort = this.localPageSettings.sort;
    this.casePostsRequestModel.pageSize = this.localPageSettings.pageSize;

    this.getAllSub$ = this.casePostsService.getAllPosts({
      ...this.casePostsRequestModel,
      caseId: this.selectedCaseId,
      templateId: this.selectedEformId
    }).subscribe((data) => {
      if (data && data.success) {
        this.casePostsListModel = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  getRecipientsAndTags() {
    this.spinnerStatus = true;
    this.getTagsSub$ = this.emailRecipientsService.getEmailRecipientsAndTags().subscribe((data) => {
      if (data && data.success) {
        this.availableRecipientsAndTags = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  getRecipients() {
    this.spinnerStatus = true;
    this.getRecipientsSub$ = this.emailRecipientsService.getSimpleEmailRecipients().subscribe((data) => {
      if (data && data.success) {
        this.availableRecipients = data.model;
      }
      this.spinnerStatus = false;
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
      this.casePostsRequestModel.offset = e;
      this.getCasePosts();
    }
  }

  getSortIcon(sort: string): string {
    if (this.casePostsRequestModel.sort === sort) {
      return this.casePostsRequestModel.isSortDsc ? 'expand_more' : 'expand_less';
    } else {
      return 'unfold_more';
    }
  }

  openCreateModal() {
    this.newPostModal.show();
  }

  openViewModal(id: number) {
    this.viewPostModal.show(id);
  }

  ngOnDestroy(): void {
  }
}
