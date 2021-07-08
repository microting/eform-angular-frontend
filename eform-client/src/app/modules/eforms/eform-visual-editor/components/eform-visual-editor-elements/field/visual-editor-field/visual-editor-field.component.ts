import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { EformFieldTypesEnum } from 'src/app/common/const';
import {
  EformVisualEditorFieldModel,
  EformVisualEditorModel,
  EformVisualEditorRecursionFieldModel,
} from 'src/app/common/models';

@Component({
  selector: 'app-visual-editor-field',
  templateUrl: './visual-editor-field.component.html',
  styleUrls: ['./visual-editor-field.component.scss'],
})
export class VisualEditorFieldComponent implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  @Input() visualEditorTemplateModel: EformVisualEditorModel;
  @Input() fieldIndex: number;
  @Input() checklistRecursionIndexes = [];
  @Output()
  addNewField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  fieldPositionChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  deleteField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  editField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();

  // dragulaElementContainerName = UUID.UUID();

  get fieldTypes() {
    return EformFieldTypesEnum;
  }

  get isFieldComplete() {
    return (
      this.field.translations.find((x) => x.name !== '') && this.field.fieldType
    );
  }

  constructor() {}

  ngOnInit() {}

  // onAddNewField() {
  //   this.addNewField.emit({
  //     field: this.field,
  //     fieldIndex: this.fieldIndex,
  //     checklistRecursionIndexes: this.checklistRecursionIndexes,
  //   });
  // }

  onEditField() {
    this.editField.emit({
      field: {...this.field},
      fieldIndex: this.fieldIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
    });
  }

  onDeleteField() {
    this.deleteField.emit({
      field: {...this.field},
      fieldIndex: this.fieldIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
    });
  }

  ngOnDestroy(): void {}
}
