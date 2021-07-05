import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UUID } from 'angular2-uuid';
import {
  EformVisualEditorFieldModel,
  EformVisualEditorModel,
} from 'src/app/common/models';
import { EformVisualEditorService } from 'src/app/common/services';

@Component({
  selector: 'app-visual-editor-field',
  templateUrl: './visual-editor-field.component.html',
  styleUrls: ['./visual-editor-field.component.scss'],
})
export class VisualEditorFieldComponent implements OnInit, OnDestroy {
  // @Input() checklist: EformVisualEditorModel;
  @Input() field: EformVisualEditorFieldModel;
  @Input() visualEditorTemplateModel: EformVisualEditorModel;
  @Input() elementIndex: number;
  @Input() checklistRecursionIndex: number[] = [0];
  @Input() fieldRecursionIndex: number[] = [0];
  // @Input() elementRecursionIndex: number[] = [0];
  // @Output() addNewChecklist: EventEmitter<any> = new EventEmitter<any>();
  @Output() addNewField: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  fieldPositionChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteField: EventEmitter<{
    fieldIndex: number;
    field: EformVisualEditorFieldModel
  }> = new EventEmitter();
  @Output() updateField: EventEmitter<{
    fieldIndex: number;
  }> = new EventEmitter<{ fieldIndex: number }>();
  dragulaElementContainerName = UUID.UUID();

  // collapseSub$: Subscription;

  public composeIndexes(item: number[], index: number): number[] {
    return [...item, index];
  }

  constructor(private visualEditorService: EformVisualEditorService) {}

  ngOnInit() {
    // this.collapseSub$ = this.visualEditorService.collapse.subscribe(
    //   (collapsed) => {
    //     if (!collapsed && this.checklist && this.checklist.collapsed) {
    //       this.checklist.collapsed = false;
    //       this.collapse.toggle();
    //     }
    //     if (collapsed && this.checklist && !this.checklist.collapsed) {
    //       this.checklist.collapsed = true;
    //       this.collapse.toggle();
    //     }
    //   }
    // );
  }

  // onAddNewChecklist(position: number) {
  //   this.addNewChecklist.emit(position);
  // }

  onAddNewField(position: number) {
    this.addNewField.emit(position);
  }

  onDeleteField() {
    this.deleteField.emit({ field: this.field, fieldIndex: this.elementIndex });
  }

  ngOnDestroy(): void {}

  onFieldChanged(model: EformVisualEditorFieldModel[]) {
    this.fieldPositionChanged.emit(model);
  }

  onEditField() {
    // Todo: include checklist index
    this.updateField.emit({ fieldIndex: this.elementIndex });
  }
}
