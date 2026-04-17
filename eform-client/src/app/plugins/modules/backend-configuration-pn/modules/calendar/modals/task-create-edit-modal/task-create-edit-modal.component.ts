import {Component, EventEmitter, Inject, OnInit, Optional, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {CommonDictionaryModel} from 'src/app/common/models';
import {EformVisualEditorModel} from 'src/app/common/models/eforms/visual-editor/eform-visual-editor.model';
import {EformVisualEditorFieldModel} from 'src/app/common/models/eforms/visual-editor/eform-visual-editor-field.model';
import {EformVisualEditorTranslationWithDefaultValue} from 'src/app/common/models/eforms/visual-editor/eform-visual-editor-translation-with-default-value';
import {EformVisualEditorService} from 'src/app/common/services';
import {EformFieldTypesEnum} from 'src/app/common/const/eform-field-types';
import {Store} from '@ngrx/store';
import {selectCurrentUserLanguageId} from 'src/app/state/auth/auth.selector';
import {BackendConfigurationPnCalendarService, BackendConfigurationPnPropertiesService} from '../../../../services';
import {CALENDAR_COLORS, CalendarBoardModel, CalendarTaskModel, RepeatEditScope} from '../../../../models/calendar';
import {CalendarRepeatService, RepeatSelectOption} from '../../services/calendar-repeat.service';
import {computeCopyDate} from '../../services/calendar-copy-date.helper';
import {getCurrentLocale} from '../../services/calendar-locale.helper';
import {CustomRepeatModalComponent} from '../custom-repeat-modal/custom-repeat-modal.component';
import {RepeatScopeModalComponent} from '../repeat-scope-modal/repeat-scope-modal.component';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';

export interface TaskCreateEditModalData {
  task: CalendarTaskModel | null;
  date: string;
  startHour: number;
  boards: CalendarBoardModel[];
  employees: CommonDictionaryModel[];
  tags: string[];
  propertyId: number;
  properties: CommonDictionaryModel[];
  eforms: {id: number; label: string}[];
  folderId: number | null;
  planningTags: {id: number; name: string}[];
  sourceTask?: CalendarTaskModel | null;  // present in copy mode
}

@Component({
  standalone: false,
  selector: 'app-task-create-edit-modal',
  templateUrl: './task-create-edit-modal.component.html',
  styleUrls: ['./task-create-edit-modal.component.scss'],
})
export class TaskCreateEditModalComponent implements OnInit {
  @Output() popoverClose = new EventEmitter<boolean | null>();
  @Output() timeChanged = new EventEmitter<{startHour: number; endHour: number}>();
  usePopoverMode = false;

  isEditMode = false;
  isReadonly = false;
  repeatOptions: RepeatSelectOption[] = [];
  timeSlots: string[] = [];
  showDriveInput = false;
  filteredBoards: CalendarBoardModel[] = [];
  minDate = new Date();
  selectedTemplate: EformVisualEditorModel | null = null;
  isLoadingTemplate = false;
  showEformDetails = false;
  filteredEmployees: CommonDictionaryModel[] = [];
  private currentLanguageId = 1;  // default to English

  // Individual form controls
  titleControl = new FormControl('', Validators.required);
  dateControl = new FormControl<Date | null>(null);
  startTimeControl = new FormControl('09:00');
  endTimeControl = new FormControl('10:00');
  repeatControl = new FormControl('none');
  assigneeControl = new FormControl<number[]>([]);
  tagsControl = new FormControl<string[]>([]);
  descriptionControl = new FormControl('');
  driveLinkControl = new FormControl('');
  propertyControl = new FormControl<number | null>(null);
  boardControl = new FormControl<number | null>(null);
  eformControl = new FormControl<number | null>(null);
  planningTagControl = new FormControl<number | null>(null);

  constructor(
    @Optional() private dialogRef: MatDialogRef<TaskCreateEditModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: TaskCreateEditModalData,
    private calendarService: BackendConfigurationPnCalendarService,
    private repeatService: CalendarRepeatService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private translate: TranslateService,
    private eformVisualEditorService: EformVisualEditorService,
    private propertiesService: BackendConfigurationPnPropertiesService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.store.select(selectCurrentUserLanguageId).pipe(take(1)).subscribe(langId => {
      this.currentLanguageId = langId ?? 1;
    });

    this.isEditMode = !!this.data.task;
    this.timeSlots = this.generateTimeSlots();
    this.filteredBoards = this.data.boards;

    const task = this.data.task;
    const sourceTask = this.data.sourceTask;
    const isCopyMode = !task && !!sourceTask;
    let defaultDate = task ? task.taskDate : this.data.date;
    if (isCopyMode) {
      // Adjust past source dates forward to today (or tomorrow if today's
      // start time has already passed).
      defaultDate = computeCopyDate(sourceTask!.taskDate, sourceTask!.startHour);
    }
    const baseDate = new Date(defaultDate);
    this.repeatOptions = this.repeatService.buildRepeatSelectOptions(baseDate);

    // Initialize controls
    this.dateControl.setValue(new Date(defaultDate));

    if (task) {
      this.titleControl.setValue(task.title);
      this.startTimeControl.setValue(this.hourToTimeStr(task.startHour));
      this.endTimeControl.setValue(this.hourToTimeStr(task.startHour + task.duration));
      this.repeatControl.setValue(task.repeatRule ?? 'none');
      this.assigneeControl.setValue(task.assigneeIds ?? []);
      this.tagsControl.setValue(task.tags ?? []);
      this.descriptionControl.setValue(task.descriptionHtml ?? '');
      this.driveLinkControl.setValue(task.driveLink ?? '');
      this.showDriveInput = !!task.driveLink;
      this.boardControl.setValue(task.boardId ?? null);
      this.propertyControl.setValue(task.propertyId ?? this.data.propertyId);
      this.eformControl.setValue(task['eformId'] ?? null);
      this.planningTagControl.setValue(task['itemPlanningTagId'] ?? null);
    } else if (isCopyMode) {
      const copyPrefix = this.translate.instant('Copy of');
      this.titleControl.setValue(`${copyPrefix} ${sourceTask.title}`);
      this.startTimeControl.setValue(this.hourToTimeStr(sourceTask.startHour));
      this.endTimeControl.setValue(this.hourToTimeStr(sourceTask.startHour + sourceTask.duration));
      this.repeatControl.setValue(sourceTask.repeatRule ?? 'none');
      this.assigneeControl.setValue(sourceTask.assigneeIds ?? []);
      this.tagsControl.setValue(sourceTask.tags ?? []);
      this.descriptionControl.setValue(sourceTask.descriptionHtml ?? '');
      this.driveLinkControl.setValue(sourceTask.driveLink ?? '');
      this.showDriveInput = !!sourceTask.driveLink;
      this.boardControl.setValue(sourceTask.boardId ?? null);
      this.propertyControl.setValue(sourceTask.propertyId ?? this.data.propertyId);
      this.eformControl.setValue(sourceTask['eformId'] ?? null);
      this.planningTagControl.setValue(sourceTask['itemPlanningTagId'] ?? null);
    } else {
      const startHour = this.data.startHour ?? 9;
      this.startTimeControl.setValue(this.hourToTimeStr(startHour));
      this.endTimeControl.setValue(this.hourToTimeStr(startHour + 1));
      this.propertyControl.setValue(this.data.propertyId);
      const defaultBoard = this.data.boards.length > 0
        ? this.data.boards.reduce((min, b) => b.id < min.id ? b : min)
        : null;
      this.boardControl.setValue(defaultBoard?.id ?? null);
      const kvittering = this.data.eforms?.find(e => e.label === 'Kvittering');
      this.eformControl.setValue(kvittering?.id ?? this.data.eforms?.[0]?.id ?? null);
    }

    // Disable all controls for past tasks
    if (this.isEditMode && this.dateControl.value) {
      const taskDate = this.dateControl.value;
      const endTime = this.endTimeControl.value || '00:00';
      if (this.isInPast(taskDate, endTime)) {
        this.isReadonly = true;
        this.titleControl.disable();
        this.dateControl.disable();
        this.startTimeControl.disable();
        this.endTimeControl.disable();
        this.repeatControl.disable();
        this.assigneeControl.disable();
        this.tagsControl.disable();
        this.descriptionControl.disable();
        this.driveLinkControl.disable();
        this.propertyControl.disable();
        this.boardControl.disable();
        this.eformControl.disable();
        this.planningTagControl.disable();
      }
    }

    // When start time changes, auto-adjust end time to maintain duration
    let prevStartH = this.timeStrToHour(this.startTimeControl.value!);
    this.startTimeControl.valueChanges.subscribe(newStart => {
      if (!newStart) return;
      const newStartH = this.timeStrToHour(newStart);
      const endH = this.timeStrToHour(this.endTimeControl.value!);
      const dur = endH - prevStartH;
      const newEnd = Math.min(newStartH + Math.max(dur, 0.25), 24);
      this.endTimeControl.setValue(this.hourToTimeStr(newEnd), {emitEvent: false});
      prevStartH = newStartH;
    });

    // Emit time changes for selection indicator sizing
    this.startTimeControl.valueChanges.subscribe(() => this.emitTimeChanged());
    this.endTimeControl.valueChanges.subscribe(() => this.emitTimeChanged());

    // When repeat changes, handle custom modal
    this.repeatControl.valueChanges.subscribe(value => {
      if (value === 'custom') {
        this.onRepeatChange();
      }
    });

    // When property changes, reload boards, reload filtered employees, clear stale assignee selections
    this.propertyControl.valueChanges.subscribe(propertyId => {
      if (propertyId) {
        this.calendarService.getBoards(propertyId).subscribe(res => {
          if (res && res.success) {
            this.filteredBoards = res.model;
            if (this.filteredBoards.length > 0 && !this.filteredBoards.find(b => b.id === this.boardControl.value)) {
              this.boardControl.setValue(this.filteredBoards[0].id);
            }
          }
        });
      }
      this.loadEmployeesForProperty(propertyId);
      this.assigneeControl.setValue([]);
    });

    // Load eForm template details when selection changes
    // Use switchMap so rapid eForm switches cancel any in-flight getSingle()
    // and we never overwrite the current selection with a stale response.
    this.eformControl.valueChanges.pipe(
      switchMap(id => {
        if (!id) {
          this.selectedTemplate = null;
          return of(null);
        }
        this.isLoadingTemplate = true;
        return this.eformVisualEditorService.getVisualEditorTemplate(id);
      })
    ).subscribe(res => {
      if (res && res.success && res.model) {
        this.selectedTemplate = res.model;
      }
      this.isLoadingTemplate = false;
    });

    // When date changes, rebuild repeat options and regenerate time slots
    this.dateControl.valueChanges.subscribe(date => {
      if (date) {
        this.repeatOptions = this.repeatService.buildRepeatSelectOptions(date);
        this.timeSlots = this.generateTimeSlots();
      }
    });

    // Emit initial time values
    this.emitTimeChanged();

    // Initial data loads
    this.loadEmployeesForProperty(this.propertyControl.value);
    this.loadTemplate(this.eformControl.value);
  }

  loadTemplate(id: number | null) {
    if (!id) {
      this.selectedTemplate = null;
      return;
    }
    this.isLoadingTemplate = true;
    this.eformVisualEditorService.getVisualEditorTemplate(id).subscribe({
      next: res => {
        if (res && res.success && res.model) {
          this.selectedTemplate = res.model;
        }
        this.isLoadingTemplate = false;
      },
      error: () => {
        this.selectedTemplate = null;
        this.isLoadingTemplate = false;
      },
    });
  }

  loadEmployeesForProperty(propertyId: number | null) {
    if (!propertyId) {
      this.filteredEmployees = [];
      return;
    }
    this.propertiesService.getLinkedSites(propertyId, false).subscribe(res => {
      if (res && res.success && res.model) {
        this.filteredEmployees = res.model;
      }
    });
  }

  getTemplateFields(): { type: string; label: string; mandatory: boolean }[] {
    const out: { type: string; label: string; mandatory: boolean }[] = [];
    if (!this.selectedTemplate) return out;
    this.collectFromFields(this.selectedTemplate.fields, out);
    for (const cl of (this.selectedTemplate.checkLists ?? [])) {
      this.collectFromChecklist(cl, out);
    }
    return out;
  }

  private collectFromChecklist(model: EformVisualEditorModel, out: { type: string; label: string; mandatory: boolean }[]): void {
    this.collectFromFields(model.fields, out);
    for (const cl of (model.checkLists ?? [])) {
      this.collectFromChecklist(cl, out);
    }
  }

  private collectFromFields(fields: EformVisualEditorFieldModel[] | null | undefined, out: { type: string; label: string; mandatory: boolean }[]): void {
    for (const f of (fields ?? [])) {
      // SaveButton fields are UI-only submit controls, not user-facing data
      // entry — skip them in the preview.
      if (f.fieldType !== EformFieldTypesEnum.SaveButton) {
        out.push({
          type: this.fieldTypeLabel(f.fieldType),
          label: this.translatedName(f.translations),
          mandatory: !!f.mandatory,
        });
      }
      if (f.fields && f.fields.length > 0) {
        this.collectFromFields(f.fields, out);
      }
    }
  }

  private fieldTypeLabel(t: number): string {
    const name = EformFieldTypesEnum[t];
    if (!name) return '';
    // Translate the raw enum name (e.g. "Picture", "Text"). If no translation
    // exists the pipe falls back to the English name which is still readable.
    return this.translate.instant(name);
  }

  private translatedName(translations: EformVisualEditorTranslationWithDefaultValue[]): string {
    if (!translations || translations.length === 0) return '';
    const match = translations.find(tr => tr.languageId === this.currentLanguageId && !!tr.name);
    if (match) return match.name;
    // Fallback: first non-empty name in any language
    const fallback = translations.find(tr => !!tr.name);
    return fallback ? fallback.name : '';
  }

  toggleEformDetails() {
    this.showEformDetails = !this.showEformDetails;
  }

  get formattedDate(): string {
    const d = this.dateControl.value;
    if (!d) return '';
    return d.toLocaleDateString(getCurrentLocale(this.translate), {weekday: 'long', day: 'numeric', month: 'long'});
  }

  private generateTimeSlots(): string[] {
    const slots: string[] = [];
    const now = new Date();
    const selectedDate = this.dateControl.value;
    const isToday = selectedDate ? selectedDate.toDateString() === now.toDateString() : false;
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (isToday && (h < now.getHours() || (h === now.getHours() && m < now.getMinutes()))) {
          continue;
        }
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  }

  private hourToTimeStr(hour: number): string {
    const h = Math.floor(Math.min(hour, 23.75));
    const m = Math.round((hour % 1) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  private timeStrToHour(time: string): number {
    const parts = time.split(':');
    if (parts.length !== 2) return 0;
    return parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
  }

  autoGrowTextarea(event: Event) {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  private emitTimeChanged() {
    const startH = this.timeStrToHour(this.startTimeControl.value!);
    const endH = this.timeStrToHour(this.endTimeControl.value!);
    this.timeChanged.emit({startHour: startH, endHour: endH});
  }

  private onRepeatChange() {
    const ref = this.dialog.open(
      CustomRepeatModalComponent,
      dialogConfigHelper(this.overlay, {date: this.dateControl.value ?? new Date()})
    );
    ref.afterClosed().subscribe(meta => {
      if (!meta) {
        this.repeatControl.setValue('none', {emitEvent: false});
      }
    });
  }

  private isInPast(date: Date, timeStr: string): boolean {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const taskDate = new Date(date);
    taskDate.setHours(hours, minutes, 0, 0);
    return taskDate < new Date();
  }

  onSave() {
    if (this.titleControl.invalid) return;
    // Only block past-date save in edit mode. Copy mode may open with a past
    // date seeded from the source event; the user is expected to pick a new
    // date before saving, and we surface that via the standard datepicker
    // min-date validator rather than silently returning.
    if (this.isEditMode && this.isInPast(this.dateControl.value!, this.startTimeControl.value!)) {
      return;
    }

    const startHour = this.timeStrToHour(this.startTimeControl.value!);
    const endHour = this.timeStrToHour(this.endTimeControl.value!);
    const duration = Math.max(endHour - startHour, 0.25);
    const taskDate = this.dateControl.value!;
    const dateStr = `${taskDate.getFullYear()}-${(taskDate.getMonth() + 1).toString().padStart(2, '0')}-${taskDate.getDate().toString().padStart(2, '0')}`;

    const repeatRuleMap: Record<string, number> = {
      'none': 0,
      'daily': 1,
      'weekly': 2, 'weeklyOne': 2, 'weeklyAll': 2,
      'monthly': 3, 'monthlyDom': 3,
      'yearly': 4, 'yearlyOne': 4,
      'weekdays': 5,
      'custom': 6,
    };
    const repeatRuleValue = this.repeatControl.value ?? 'none';

    const payload: any = {
      // Backend CalendarTaskCreateRequestModel fields
      translates: [{name: this.titleControl.value, languageId: 1}],
      startDate: taskDate,
      startHour,
      duration,
      sites: this.assigneeControl.value ?? [],
      tagIds: (this.tagsControl.value ?? []).map((t: any) => typeof t === 'number' ? t : 0).filter((id: number) => id > 0),
      boardId: this.boardControl.value,
      color: this.filteredBoards.find(b => b.id === this.boardControl.value)?.color ?? CALENDAR_COLORS[0],
      descriptionHtml: this.descriptionControl.value ?? '',
      repeatType: repeatRuleMap[repeatRuleValue] ?? 0,
      repeatEvery: 1,
      driveLink: this.driveLinkControl.value ?? '',
      propertyId: this.propertyControl.value ?? this.data.propertyId,
      status: 1,
      complianceEnabled: true,
      folderId: this.data.folderId,
      eformId: this.eformControl.value,
      itemPlanningTagId: this.planningTagControl.value,

      // Keep these for local/UI use and backward compat
      title: this.titleControl.value,
      taskDate: dateStr,
      startText: this.startTimeControl.value,
      endText: this.endTimeControl.value,
      assigneeIds: this.assigneeControl.value ?? [],
      tags: this.tagsControl.value ?? [],
      repeatRule: repeatRuleValue,
      id: this.data.task?.id,
      repeatSeriesId: this.data.task?.repeatSeriesId,
    };

    const doSave = (scope?: string) => {
      const obs = this.isEditMode
        ? this.calendarService.updateTask(payload, (scope ?? 'this') as RepeatEditScope)
        : this.calendarService.createTask(payload);

      obs.subscribe(res => {
        if (res && res.success) this.close(true);
      });
    };

    if (this.isEditMode && this.data.task?.repeatSeriesId) {
      const ref = this.dialog.open(
        RepeatScopeModalComponent,
        dialogConfigHelper(this.overlay, {mode: 'edit'})
      );
      ref.afterClosed().subscribe(scope => {
        if (scope) doSave(scope);
      });
    } else {
      doSave();
    }
  }

  onCancel() {
    this.close(null);
  }

  private close(result: boolean | null) {
    if (this.usePopoverMode) {
      this.popoverClose.emit(result);
    } else {
      this.dialogRef.close(result);
    }
  }
}
