import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {SharedTagMultipleCreateModel} from 'src/app/common/models';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-shared-tag-multiple-create',
    templateUrl: './shared-tag-multiple-create.component.html',
    styleUrls: ['./shared-tag-multiple-create.component.scss'],
    standalone: false
})
export class SharedTagMultipleCreateComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SharedTagMultipleCreateComponent>>(MatDialogRef);

  public createdTags: EventEmitter<SharedTagMultipleCreateModel> = new EventEmitter<SharedTagMultipleCreateModel>();
  textareaValue: string = '';

  ngOnInit() {}

  /**
   * One tag per line, trimmed, with blank lines dropped.
   *
   * A bare `split('\n')` sends `""` for the trailing newline every textarea
   * ends up with as soon as the user hits Enter after the last name (and for
   * any blank line in between). `PlanningTag.Name` is `[Required]`, and the
   * server-side bulk endpoints wrap their whole create loop in ONE try/catch,
   * so a single invalid name aborts the loop *after* the earlier names were
   * already committed and answers `success = false` — a partial write reported
   * as a total failure. Trimming + dropping blanks is the only sane reading of
   * a line-per-tag textarea, so it is fixed here for every consumer
   * (items-planning plannings, the task wizard, the task list and the
   * backend-configuration files module) rather than defensively per call site.
   */
  get tagNames(): string[] {
    return this.textareaValue
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
  }

  createTags() {
    const tagNames = this.tagNames;
    if (tagNames.length === 0) {
      // Unreachable through the UI (the Create button is disabled), but keeps
      // a programmatic call from posting an empty/whitespace-only batch.
      return;
    }
    this.createdTags.emit({ tagNames });
  }

  cancelCreate() {
    this.dialogRef.close();
  }
}
