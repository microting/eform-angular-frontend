import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject } from '@angular/core';
import {
  CommonDictionaryModel,
  SharedTagCreateModel,
  SharedTagModel,
} from 'src/app/common/models';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {
  SharedTagCreateComponent,
  SharedTagDeleteComponent,
  SharedTagEditComponent,
  SharedTagsComponent
} from 'src/app/common/modules/eform-shared-tags/components';
import { Subscription } from 'rxjs';
import { EmailRecipientsTagsService} from 'src/app/common/services';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';

@AutoUnsubscribe()
@Component({
    selector: 'app-email-recipients-tags',
    templateUrl: './email-recipients-tags.component.html',
    styleUrls: ['./email-recipients-tags.component.scss'],
    standalone: false
})
export class EmailRecipientsTagsComponent implements OnChanges, OnDestroy {
  private tagsService = inject(EmailRecipientsTagsService);
  dialog = inject(MatDialog);
  private overlay = inject(Overlay);

  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() tagsChanged: EventEmitter<void> = new EventEmitter<void>();
  dialogRef: MatDialogRef<SharedTagsComponent>;
  deleteTag$: Subscription;
  createTag$: Subscription;
  updateTag$: Subscription;
  showCreateTagSub$: Subscription;
  showEditTagSub$: Subscription;
  showDeleteTagSub$: Subscription;
  deletedTagSub$: Subscription;
  updatedTagSub$: Subscription;

  show() {
    this.dialogRef = this.dialog.open(SharedTagsComponent, {
      ...dialogConfigHelper(this.overlay, this.availableTags)
    });
    this.showCreateTagSub$ = this.dialogRef.componentInstance.showCreateTag.subscribe(() => {
      const dialogRefCreateTag = this.dialog.open(SharedTagCreateComponent, {
        ...dialogConfigHelper(this.overlay)
      });
      this.updatedTagSub$ = dialogRefCreateTag.componentInstance.createdTag.subscribe(tag => this.onTagCreate(tag, dialogRefCreateTag));
    })
    this.showEditTagSub$ = this.dialogRef.componentInstance.showEditTag.subscribe((x) => {
      const dialogRefUpdateTag = this.dialog.open(SharedTagEditComponent, {
        ...dialogConfigHelper(this.overlay, x)
      });
      this.updatedTagSub$ = dialogRefUpdateTag.componentInstance.updatedTag.subscribe(tag => this.onTagUpdate(tag, dialogRefUpdateTag));
    })
    this.showDeleteTagSub$ = this.dialogRef.componentInstance.showDeleteTag.subscribe((x) => {
      const dialogRefUpdateTag = this.dialog.open(SharedTagDeleteComponent, {
        ...dialogConfigHelper(this.overlay, x)
      });
      this.deletedTagSub$ = dialogRefUpdateTag.componentInstance.deletedTag.subscribe(tag => this.onTagDelete(tag, dialogRefUpdateTag));
    })
  }

  ngOnDestroy(): void {}

  onTagUpdate(model: SharedTagModel, dialogRefUpdateTag: MatDialogRef<SharedTagEditComponent>) {
    this.updateTag$ = this.tagsService
      .updateEmailRecipientTag(model)
      .subscribe((data) => {
        if (data && data.success) {
          dialogRefUpdateTag.close();
          this.tagsChanged.emit();
        }
      });
  }

  onTagCreate(model: SharedTagCreateModel, dialogRefUpdateTag: MatDialogRef<SharedTagCreateComponent>) {
    this.createTag$ = this.tagsService
      .createEmailRecipientTag(model)
      .subscribe((data) => {
        if (data && data.success) {
          dialogRefUpdateTag.close();
          this.tagsChanged.emit();
        }
      });
  }

  onTagDelete(model: SharedTagModel, dialogRefUpdateTag: MatDialogRef<SharedTagDeleteComponent>) {
    this.deleteTag$ = this.tagsService
      .deleteEmailRecipientTag(model.id)
      .subscribe((data) => {
        if (data && data.success) {
          dialogRefUpdateTag.close();
          this.tagsChanged.emit();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes.availableTags.firstChange && changes.availableTags && this.dialogRef){
      this.dialogRef.componentInstance.availableTags = changes.availableTags.currentValue;
    }
  }
}
