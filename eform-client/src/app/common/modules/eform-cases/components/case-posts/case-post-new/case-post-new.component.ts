import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CasePostsService } from 'src/app/common/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {
  CasePostCreateModel,
  CommonDictionaryModel,
  EmailRecipientTagCommonModel,
} from 'src/app/common/models';
import { format } from 'date-fns';
import { arrayToggle } from '@datorama/akita';

@AutoUnsubscribe()
@Component({
  selector: 'app-case-post-new',
  templateUrl: './case-post-new.component.html',
  styleUrls: ['./case-post-new.component.scss'],
})
export class CasePostNewComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('frame') frame;
  @Output() postCreated: EventEmitter<void> = new EventEmitter<void>();
  @Input() availableRecipientsAndTags: EmailRecipientTagCommonModel[] = [];
  @Input() availableRecipients: CommonDictionaryModel[] = [];
  @Input() caseId: number;
  @Input() eformId: number;
  @Input() currentUserFullName: string;
  @Input() pdfReportAvailable: boolean;
  @Input() eFormName: string;
  @Input() doneAt: string;
  postCreateModel: CasePostCreateModel = new CasePostCreateModel();
  selectedTagsAndRecipientsIds: number[] = [];

  private firstChange = true;

  createTag$: Subscription;

  constructor(private casePostsService: CasePostsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.firstChange && this.caseId && this.doneAt && this.eFormName) {
      this.postCreateModel = {
        ...this.postCreateModel,
        subject: `${this.eFormName} - ${format(
          new Date(this.doneAt),
          'yyyy/MM/dd HH:mm:ss'
        )} - ${this.caseId}`,
      };
      this.firstChange = false;
    }
  }

  ngOnInit() {}

  show() {
    this.frame.show();
  }

  createPost() {
    this.createTag$ = this.casePostsService
      .createPost({
        ...this.postCreateModel,
        caseId: this.caseId,
        templateId: this.eformId,
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.postCreated.emit();
          this.postCreateModel = new CasePostCreateModel();
          this.selectedTagsAndRecipientsIds = [];
        }
      });
  }

  ngOnDestroy(): void {}

  saveRemoveRecipientOrTag(model: EmailRecipientTagCommonModel) {
    if (model.isTag) {
      this.postCreateModel.toTagsIds = arrayToggle(
        this.postCreateModel.toTagsIds,
        model.id
      );
    } else {
      this.postCreateModel.toRecipientsIds = arrayToggle(
        this.postCreateModel.toRecipientsIds,
        model.id
      );
    }
  }
}
