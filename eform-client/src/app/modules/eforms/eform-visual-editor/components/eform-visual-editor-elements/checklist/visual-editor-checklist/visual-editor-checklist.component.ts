import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CollapseComponent } from 'angular-bootstrap-md';
import { UUID } from 'angular2-uuid';
import {
  EformVisualEditorFieldsDnDRecursionModel,
  EformVisualEditorFieldModel,
  EformVisualEditorModel,
  EformVisualEditorRecursionFieldModel,
  EformVisualEditorRecursionChecklistModel,
} from 'src/app/common/models';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-visual-editor-checklist',
  templateUrl: './visual-editor-checklist.component.html',
  styleUrls: ['./visual-editor-checklist.component.scss'],
})
export class VisualEditorChecklistComponent implements OnInit, OnDestroy {
  @ViewChild('collapse', { static: true }) collapse: CollapseComponent;
  @Input() checklist: EformVisualEditorModel;
  @Input() checklistIndex = 0;
  @Input() checklistRecursionIndex = 0;
  @Input() checklistRecursionIndexes = [];
  @Output()
  addNewNestedChecklist: EventEmitter<EformVisualEditorRecursionChecklistModel> = new EventEmitter();
  @Output()
  addNewNestedField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  nestedFieldPositionChanged: EventEmitter<EformVisualEditorFieldsDnDRecursionModel> = new EventEmitter();
  @Output()
  deleteNestedField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  editNestedField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  editNestedChecklist: EventEmitter<EformVisualEditorRecursionChecklistModel> = new EventEmitter();
  @Output()
  deleteNestedChecklist: EventEmitter<EformVisualEditorRecursionChecklistModel> = new EventEmitter();
  @Output()
  copyNestedField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter(); // todo
  @Output()
  changeColorField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  dragulaElementContainerName = UUID.UUID();

  composeIndexes(checklistIndex: number) {
    return [...this.checklistRecursionIndexes, checklistIndex];
  }

  get isChecklistComplete() {
    return this.checklist.translations.find((x) => x.name !== '');
  }

  constructor(private dragulaService: DragulaService) {
    this.dragulaService.createGroup(this.dragulaElementContainerName, {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      accepts: (el, target) => {
        return el.id.includes('checkList_');
      },
    });
  }

  ngOnInit() {}

  onAddNewNestedChecklist() {
    this.addNewNestedChecklist.emit({
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
    });
  }

  onEditChecklist() {
    this.editNestedChecklist.emit({
      checklist: { ...this.checklist },
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      checklistIndex: this.checklistIndex,
    });
  }

  onDeleteChecklist() {
    this.deleteNestedChecklist.emit({
      checklist: { ...this.checklist },
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
    });
  }

  onAddNewNestedField() {
    // add to checklist
    this.addNewNestedField.emit({
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
    });
  }

  onNestedFieldPositionChanged(model: EformVisualEditorFieldModel[]) {
    this.nestedFieldPositionChanged.emit({
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
      fields: model,
    });
  }

  onEditNestedField(fieldIndex: number, field: EformVisualEditorFieldModel) {
    this.editNestedField.emit({
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
      fieldIndex,
      field,
    });
  }

  onDeleteNestedField(fieldIndex: number, field: EformVisualEditorFieldModel) {
    this.deleteNestedField.emit({
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
      fieldIndex,
      field,
    });
  }

  onEditNestedChecklistInNestedChecklist(
    $event: EformVisualEditorRecursionChecklistModel
  ) {
    this.editNestedChecklist.emit($event);
  }

  onAddNewNestedChecklistInNestedChecklist(
    $event: EformVisualEditorRecursionChecklistModel
  ) {
    this.addNewNestedChecklist.emit($event);
  }

  onAddNestedFieldInNestedChecklist(
    $event: EformVisualEditorRecursionFieldModel
  ) {
    // add to field group. Code for visualization: checklist.fields[fieldGroupIndex].fields.push()
    this.addNewNestedField.emit($event);
  }

  onEditNestedFieldInNestedChecklist(
    $event: EformVisualEditorRecursionFieldModel
  ) {
    this.editNestedField.emit($event);
  }

  onFieldPositionChangedInNestedChecklist(
    $event: EformVisualEditorFieldsDnDRecursionModel
  ) {
    this.nestedFieldPositionChanged.emit($event);
  }

  onDeleteNestedChecklist($event: EformVisualEditorRecursionChecklistModel) {
    this.deleteNestedChecklist.emit($event);
  }

  onDeleteNestedFieldInNestedChecklist(
    $event: EformVisualEditorRecursionFieldModel
  ) {
    this.deleteNestedField.emit($event);
  }

  onCopyNestedFieldInNestedChecklist(
    $event: EformVisualEditorRecursionFieldModel
  ) {
    this.copyNestedField.emit($event);
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy(this.dragulaElementContainerName);
  }

  onChangeColorInNestedFieldInNestedChecklist(
    $event: EformVisualEditorRecursionFieldModel
  ) {
    this.changeColorField.emit($event);
  }
}
