import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {CasePostsService} from '../../../../../common/services/cases';
import {CasePostCreateModel} from '../../../../../common/models/cases';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientTagCommonModel} from '../../../../../common/models/email-recipients';
import {CommonDictionaryModel} from '../../../../../common/models/common';

@AutoUnsubscribe()
@Component({
  selector: 'app-case-post-new',
  templateUrl: './case-post-new.component.html',
  styleUrls: ['./case-post-new.component.scss']
})
export class CasePostNewComponent implements OnInit, OnDestroy {
  @ViewChild('frame') frame;
  @Output() postCreated: EventEmitter<void> = new EventEmitter<void>();
  @Input() availableRecipientsAndTags: EmailRecipientTagCommonModel[] = [];
  @Input() availableRecipients: CommonDictionaryModel[] = [];
  @Input() caseId: number;
  @Input() eformId: number;
  @Input() currentUserFullName: string;
  @Input() pdfReportAvailable: boolean;
  postCreateModel: CasePostCreateModel = new CasePostCreateModel;
  selectedTagsAndRecipientsIds: number[] = [];
  createTag$: Subscription;


  constructor(private casePostsService: CasePostsService) {
  }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  createPost() {
    this.createTag$ = this.casePostsService.createPost({
      ...this.postCreateModel,
      caseId: this.caseId,
      templateId: this.eformId
    }).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.postCreated.emit();
        this.postCreateModel = new CasePostCreateModel();
        this.selectedTagsAndRecipientsIds = [];
      }
    });
  }

  ngOnDestroy(): void {
  }

  saveRecipientOrTag(model: any) {
    if (model.isTag) {
      this.postCreateModel.toTagsIds.push(model.id);
    } else {
      this.postCreateModel.toRecipientsIds.push(model.id);
    }
  }

  removeRecipientOrTag(model: any) {
    if (model.isTag) {
      this.postCreateModel.toTagsIds = this.postCreateModel.toTagsIds.filter(x => x !== model.id);
    } else {
      this.postCreateModel.toRecipientsIds = this.postCreateModel.toRecipientsIds.filter(x => x !== model.id);
    }
  }
}
