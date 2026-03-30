import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BackendConfigurationPnCalendarService} from '../../../../services';
import {CalendarTaskModel, RepeatDeleteScope} from '../../../../models/calendar';

export interface TaskDeleteModalData {
  task: CalendarTaskModel;
  hasSeries: boolean;
}

@Component({
  standalone: false,
  selector: 'app-task-delete-modal',
  templateUrl: './task-delete-modal.component.html',
})
export class TaskDeleteModalComponent {
  scope: RepeatDeleteScope = 'this';

  constructor(
    private dialogRef: MatDialogRef<TaskDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDeleteModalData,
    private calendarService: BackendConfigurationPnCalendarService,
  ) {}

  onConfirm() {
    this.calendarService.deleteTask(this.data.task.id, this.scope, this.data.task.taskDate).subscribe(res => {
      if (res && res.success) this.dialogRef.close(true);
    });
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
