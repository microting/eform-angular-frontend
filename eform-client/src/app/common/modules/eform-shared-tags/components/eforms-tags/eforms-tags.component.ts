import {
  Component,
  EventEmitter, Input, OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,

} from '@angular/core';
import {
  SharedTagCreateComponent,
  SharedTagDeleteComponent,
  SharedTagEditComponent,
  SharedTagsComponent
} from 'src/app/common/modules/eform-shared-tags/components';
import {
  CommonDictionaryModel,
  SharedTagCreateModel,
  SharedTagModel,
} from 'src/app/common/models';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { EformTagService } from 'src/app/common/services';
import {MatDialogRef, MatDialog} from '@angular/material/dialog';

@AutoUnsubscribe()
@Component({
  selector: 'app-eforms-tags',
  templateUrl: './eforms-tags.component.html',
  styleUrls: ['./eforms-tags.component.scss'],
})
export class EformsTagsComponent implements OnDestroy, OnChanges {
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() tagsChanged: EventEmitter<void> = new EventEmitter<void>();
  dialogRef: MatDialogRef<SharedTagsComponent>;
  deleteTag$: Subscription;
  createTag$: Subscription;
  updateTag$: Subscription;

  constructor(
    private eFormTagService: EformTagService,public dialog: MatDialog) {}

  show() {
    this.dialogRef = this.dialog.open(SharedTagsComponent, {
      disableClose: true,
      data: this.availableTags,
      minWidth: 300,
    });
    this.dialogRef.afterClosed().subscribe(x => {
      if (x && x.action) {
        switch (x.action) {
          case 'create': {
            const dialogRefCreateTag = this.dialog.open(SharedTagCreateComponent, {
              disableClose: true,
              minWidth: 300,
            });
            dialogRefCreateTag.afterClosed().subscribe(tag => {
              if (tag) {
                this.onTagCreate(tag);
              }
              this.show();
            });
            break;
          }
          case 'edit': {
            const dialogRefUpdateTag = this.dialog.open(SharedTagEditComponent, {
              disableClose: true,
              minWidth: 300,
              data: x.tag});
            dialogRefUpdateTag.afterClosed().subscribe(tag => {
              if (tag) {
                this.onTagUpdate(tag);
              }
              this.show();
            });
            break;
          }
          case 'delete': {
            const dialogRefUpdateTag = this.dialog.open(SharedTagDeleteComponent, {
              disableClose: true,
              minWidth: 300,
              data: x.tag});
            dialogRefUpdateTag.afterClosed().subscribe(tag => {
              if (tag) {
                this.onTagDelete(tag);
              }
              this.show();
            });
            break;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {}

  onTagUpdate(model: SharedTagModel) {
    this.updateTag$ = this.eFormTagService
      .updateTag(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.tagsChanged.emit();
        }
      });
  }

  onTagCreate(model: SharedTagCreateModel) {
    this.createTag$ = this.eFormTagService
      .createTag(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.tagsChanged.emit();
        }
      });
  }

  onTagDelete(model: SharedTagModel) {
    this.deleteTag$ = this.eFormTagService
      .deleteTag(model.id)
      .subscribe((data) => {
        if (data && data.success) {
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
