import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UUID } from 'angular2-uuid';
import {
  EformVisualEditorFieldsDnDRecursionModel,
  EformVisualEditorFieldModel,
  EformVisualEditorModel,
  EformVisualEditorRecursionFieldModel,
  EformVisualEditorRecursionChecklistModel, LanguagesModel,
} from 'src/app/common/models';
import { DragulaService } from 'ng2-dragula';
import { AuthStateService } from 'src/app/common/store';
import {
  EformFieldTypesEnum,
} from 'src/app/common/const';

@Component({
  selector: 'app-visual-editor-checklist',
  templateUrl: './visual-editor-checklist.component.html',
  styleUrls: ['./visual-editor-checklist.component.scss'],
})
export class VisualEditorChecklistComponent implements OnInit, OnDestroy {
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
  copyNestedField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  changeColorField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  // dragulaElementContainerName = UUID.UUID();
  @Input() appLanguages: LanguagesModel = new LanguagesModel();

  composeIndexes(checklistIndex: number) {
    return [...this.checklistRecursionIndexes, checklistIndex];
  }

  get isChecklistComplete() {
    return this.checklist.translations.find((x) => x.name !== '');
  }

  get translationChecklistName(): string {
    const language = this.appLanguages.languages.find(
      (x) => x.languageCode === this.authStateService.currentUserLocale
    );
    const index = this.checklist.translations.findIndex(
      (x) => x.languageId === language.id
    );
    if (index !== -1) {
      return this.checklist.translations[index].name;
    }
    return '';
  }

  constructor(
    // private dragulaService: DragulaService,
    private authStateService: AuthStateService
  ) {
/*    this.dragulaService.createGroup(this.dragulaElementContainerName, {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      accepts: (el, target) => {
        return (
          el.id.includes('checkList_') ||
          target.id.includes(`fields_${this.checklistIndex}`)
        );
      },
    });*/
  }

  get fieldTypes() {
    return EformFieldTypesEnum;
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
    // this.dragulaService.destroy(this.dragulaElementContainerName);
  }

  onChangeColorInNestedFieldInNestedChecklist(
    $event: EformVisualEditorRecursionFieldModel
  ) {
    this.changeColorField.emit($event);
  }
}
