import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  EformFieldTypesEnum,
} from 'src/app/common/const';
import {
  EformVisualEditorFieldModel,
  EformVisualEditorFieldsDnDRecursionModel,
  EformVisualEditorRecursionFieldModel, LanguagesModel,
} from 'src/app/common/models';
import {
  eformVisualEditorElementColors,
  getTranslatedTypes
} from '../../../../const';
import { LocaleService } from 'src/app/common/services';
import {TranslateService} from '@ngx-translate/core';
import {getRandomInt} from 'src/app/common/helpers';
import {selectCurrentUserLanguageId} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Component({
    selector: 'app-visual-editor-field',
    templateUrl: './visual-editor-field.component.html',
    styleUrls: ['./visual-editor-field.component.scss'],
    standalone: false
})
export class VisualEditorFieldComponent implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  @Input() fieldIndex: number;
  @Input() checklistRecursionIndexes = [];
  @Input() parentFieldIndex?: number;
  @Input() fieldIsNested = false;
  @Input() translationPossible: boolean;
  @Output()
  addNewField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  // eslint-disable-next-line max-len
  fieldPositionChanged: EventEmitter<EformVisualEditorFieldsDnDRecursionModel> = new EventEmitter<EformVisualEditorFieldsDnDRecursionModel>();
  @Output()
  deleteField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  editField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  changeColor: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  @Output()
  copyField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  // dragulaElementContainerName = this.fieldIsNested ? 'NESTED_FIELDS' : 'FIELDS';
  @Input() appLanguages: LanguagesModel = new LanguagesModel();
  private selectCurrentUserLanguageId$ = this.authStore.select(selectCurrentUserLanguageId);

  get fieldTypes() {
    return EformFieldTypesEnum;
  }

  get fieldColors() {
    return eformVisualEditorElementColors;
  }

  get isFieldComplete() {
    return (
      this.field.translations.find((x) => x.name !== '') && this.field.fieldType
    );
  }

  get getTranslation(): string {
    let languageId = 0;
    this.selectCurrentUserLanguageId$.subscribe((x) => {
      languageId = x;
    });
    const index = this.field.translations.findIndex((x) => x.languageId === languageId);
    if(index !== -1) {
      return this.field.translations[index].name || '';
    }
    return '';
  }

  fieldTypeTranslation(fieldType: number): string {
    if(fieldType) {
      const types = [...getTranslatedTypes(this.translateService)];
      return types.find(x => x.id === fieldType).name;
    }
  }

  constructor(
    private authStore: Store,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
  }

  onAddNewField() {
    this.addNewField.emit({
      fieldIndex: this.fieldIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      fieldIsNested: this.field.fieldType === EformFieldTypesEnum.FieldGroup, // called on parent field(field group)
    });
  }

  onEditField() {
    this.editField.emit({
      field: { ...this.field },
      fieldIndex: this.fieldIndex,
      parentFieldIndex: this.parentFieldIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      fieldIsNested: this.fieldIsNested, // called on field
    });
  }

  onDeleteField() {
    this.deleteField.emit({
      field: { ...this.field },
      fieldIndex: this.fieldIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      parentFieldIndex: this.parentFieldIndex,
    });
  }

  ngOnDestroy(): void {}

  onChangeColor(color: string) {
    this.changeColor.emit({
      field: { ...this.field, color: color },
      fieldIndex: this.fieldIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      parentFieldIndex: this.parentFieldIndex,
    });
  }

  onCopyField(field) {
    this.copyField.emit({
      field: {...field, id: null, tempId: getRandomInt(1000, 10000),},
      fieldIndex: this.fieldIsNested ? this.fieldIndex : null,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      parentFieldIndex: this.parentFieldIndex,
    });
  }

  toggleCollapse(field: EformVisualEditorFieldModel) {
    field.collapsed = !field.collapsed;
  }

  onChangeColorOnNestedField(fieldModel: EformVisualEditorRecursionFieldModel) {
    this.changeColor.emit(fieldModel);
  }

  onCopyFieldOnNestedField(fieldModel: EformVisualEditorRecursionFieldModel) {
    this.copyField.emit(fieldModel);
  }

  onDeleteFieldOnNestedField(fieldModel: EformVisualEditorRecursionFieldModel) {
    this.deleteField.emit(fieldModel);
  }

  onEditFieldOnNestedField(fieldModel: EformVisualEditorRecursionFieldModel) {
    this.editField.emit(fieldModel);
  }

  onFieldPositionChangedOnNestedField(
    fieldModel: EformVisualEditorFieldModel[]
  ) {
    this.fieldPositionChanged.emit({
      fields: fieldModel,
      fieldIndex: this.fieldIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes,
      parentFieldId: this.field.id ? this.field.id : this.field.tempId,
    });
  }

  get fieldTranslationAndType() {
    const type = this.fieldTypeTranslation(this.field.fieldType);
    let strForReturn = this.getTranslation;
    if (type) {
      if (this.field.id != null) {
        strForReturn += `; ${type}; <small class="microting-uid">(${this.field.id})</small>`;
      } else {
        strForReturn += `; ${type}`;
      }
    }
    return strForReturn;
  }
}
