import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as R from 'ramda';
import { Subscription } from 'rxjs';
import {
  applicationLanguages,
  EformFieldTypesEnum,
} from 'src/app/common/const';
import {
  CommonDictionaryModel,
  EformVisualEditorFieldModel,
  EformVisualEditorFieldsDnDRecursionModel,
  EformVisualEditorModel,
  EformVisualEditorRecursionChecklistModel,
  EformVisualEditorRecursionFieldModel,
  EformVisualEditorUpdateModel,
} from 'src/app/common/models';
import { SharedTagsComponent } from 'src/app/common/modules/eform-shared-tags/components';
import {
  EformTagService,
  EformVisualEditorService,
} from 'src/app/common/services';
import { fixTranslations } from 'src/app/common/helpers';
import { VisualEditorFieldModalComponent } from '../../';
import { DragulaService } from 'ng2-dragula';
// TODO import { CollapseComponent } from 'angular-bootstrap-md';
import { AuthStateService } from 'src/app/common/store';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-visual-editor-container',
  templateUrl: './eform-visual-editor-container.component.html',
  styleUrls: ['./eform-visual-editor-container.component.scss'],
})
export class EformVisualEditorContainerComponent implements OnInit, OnDestroy {
// TODO   @ViewChild('collapse') collapse: CollapseComponent;
  @ViewChild('tagsModal') tagsModal: SharedTagsComponent;
  @ViewChild('fieldModal') fieldModal: VisualEditorFieldModalComponent;
  @ViewChild('fieldDeleteModal') fieldDeleteModal: any;
  @ViewChild('checklistModal') checklistModal: any;
  @ViewChild('checklistDeleteModal') checklistDeleteModal: any;

  visualEditorTemplateModel: EformVisualEditorModel = new EformVisualEditorModel();
  selectedTemplateId: number;
  availableTags: CommonDictionaryModel[] = [];
  isItemsCollapsed = false;
  eformVisualEditorUpdateModel: EformVisualEditorUpdateModel = new EformVisualEditorUpdateModel();
  selectedLanguages: number[] = [];

  getTagsSub$: Subscription;
  getVisualTemplateSub$: Subscription;
  createVisualTemplateSub$: Subscription;
  updateVisualTemplateSub$: Subscription;
  routerSub$: Subscription;

  constructor(
    private dragulaService: DragulaService,
    private tagsService: EformTagService,
    private visualEditorService: EformVisualEditorService,
    private router: Router,
    private route: ActivatedRoute,
    private authStateService: AuthStateService
  ) {
    this.dragulaService.createGroup('CHECK_LISTS', {
      moves: (el, container, handle) => {
        return (
          handle.classList.contains('dragula-handle') && handle.id === 'moveBtn'
        );
      },
      accepts: (el, target) => {
        return target.id === 'editorChecklists' && el.id.includes('checkList_');
      },
    });
    this.dragulaService.createGroup('FIELDS', {
      moves: (el, container, handle) => {
        return (
          handle.id === 'moveFieldBtn' &&
          handle.classList.contains('dragula-handle')
        );
      },
      accepts: (el, target) => {
        if (el.classList.contains('field-group')) {
          return (
            (target.id === 'editorFields' || target.id === 'nestedFields') &&
            !target.classList.contains('field-group-container')
          );
        }
        return target.id === 'editorFields' || target.id === 'nestedFields';
      },
    });
  }

  get isAllNamesEmpty() {
    return !this.visualEditorTemplateModel.translations.find(
      (x) => x.name !== ''
    );
  }

  get fieldTypes() {
    return EformFieldTypesEnum;
  }

  ngOnInit(): void {
    this.getTags();

    this.routerSub$ = this.route.params.subscribe((params) => {
      this.selectedTemplateId = params['templateId'];
      this.selectedLanguages = [
        applicationLanguages.find(
          (x) => x.locale === this.authStateService.currentUserLocale
        ).id,
      ];
      if (this.selectedTemplateId) {
        this.getVisualTemplate(this.selectedTemplateId);
      } else {
        this.initForm();
      }
    });
  }

  getVisualTemplate(templateId: number) {
    this.getVisualTemplateSub$ = this.visualEditorService
      .getVisualEditorTemplate(templateId)
      .subscribe((data) => {
        if (data && data.success) {
          this.visualEditorTemplateModel = data.model;
          this.visualEditorTemplateModel.translations = fixTranslations(
            this.visualEditorTemplateModel.translations
          );
        }
      });
  }

  getTags() {
    this.getTagsSub$ = this.tagsService.getAvailableTags().subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
    });
  }

  initForm() {
    this.visualEditorTemplateModel.translations = fixTranslations(
      this.visualEditorTemplateModel.translations
    );
    // for (const language of applicationLanguages) {
    //   this.visualEditorTemplateModel = {
    //     ...this.visualEditorTemplateModel,
    //     translations: [
    //       ...this.visualEditorTemplateModel.translations,
    //       { id: null, languageId: language.id, description: '', name: '' },
    //     ],
    //   };
    // }
  }

  createVisualTemplate() {
    this.createVisualTemplateSub$ = this.visualEditorService
      .createVisualEditorTemplate(this.visualEditorTemplateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigate(['/']).then();
        }
      });
  }

  updateVisualTemplate() {
    this.eformVisualEditorUpdateModel = {
      ...this.eformVisualEditorUpdateModel,
      checklist: {
        ...this.visualEditorTemplateModel,
        checkLists: [],
        fields: [],
      },
    };
    this.updateVisualTemplateSub$ = this.visualEditorService
      .updateVisualEditorTemplate(this.eformVisualEditorUpdateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigate(['/']).then();
        }
      });
  }

  openTagsModal() {
    this.tagsModal.show();
  }

  // toggleCollapse() {
  //   this.isItemsCollapsed = !this.isItemsCollapsed;
  //   this..toggle();
  // }

  dragulaPositionChecklistChanged(model: EformVisualEditorModel[]) {
    model = this.checkPosition(model, true);
    this.visualEditorTemplateModel.checkLists = [...model];
  }

  dragulaPositionFieldChanged(model: EformVisualEditorFieldModel[]) {
    model = this.checkPosition(model);
    // need check, maybe need to delete field from fields
    let field = new EformVisualEditorFieldModel();
    if (model.length < this.visualEditorTemplateModel.fields.length) {
      this.visualEditorTemplateModel.fields.forEach((x) => {
        const index = model.findIndex((y) =>
          y.id ? y.id === x.id : y.tempId === x.tempId
        );
        if (index === -1) {
          field = x;
        }
      });
      this.checkOnDeleteField(field);
    } else if (model.length > this.visualEditorTemplateModel.fields.length) {
      model.forEach((x) => {
        const index = this.visualEditorTemplateModel.fields.findIndex((y) =>
          y.id ? y.id === x.id : y.tempId === x.tempId
        );
        if (index === -1) {
          field = x;
        }
      });
      this.checkOnUpdateField(field);
    }
    this.visualEditorTemplateModel.fields = [...model];
  }

  onNestedFieldPositionChanged(
    model: EformVisualEditorFieldsDnDRecursionModel
  ) {
    if (model.checklistRecursionIndexes.length) {
      model.fields = this.checkPosition(model.fields);
      // Deleting field inside nested checklists
      let indexes = new Array<number | string>();
      if (model.checklistRecursionIndexes.length === 1) {
        indexes = ['checkLists', model.checklistIndex];
      } else {
        model.checklistRecursionIndexes.forEach(
          (x) => indexes.push('checkLists', x) // checkLists[x]
        );
      }
      indexes.push('fields'); // checkLists[x].fields
      const visualTemplatePath = R.lensPath(indexes);
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        model.fields,
        this.visualEditorTemplateModel
      );
    } else {
      const parentField = this.visualEditorTemplateModel.fields.find(
        (x) => x.id === model.parentFieldId || x.tempId === model.parentFieldId
      );
      if (
        parentField.fieldType === EformFieldTypesEnum.FieldGroup &&
        !model.fields.some(
          (x) => x.fieldType === EformFieldTypesEnum.FieldGroup
        ) // CAN'T nested field group in field group
      ) {
        model.fields.forEach(
          (x) => (x.parentFieldId = parentField.id ?? parentField.tempId)
        );
        model.fields = this.checkPosition(model.fields);
        parentField.fields = [...model.fields];
      }
    }
  }

  showFieldModal(model?: EformVisualEditorRecursionFieldModel) {
    this.fieldModal.show(model);
  }

  showDeleteFieldModal(model: EformVisualEditorRecursionFieldModel) {
    this.fieldDeleteModal.show(model);
  }

  showChecklistModal(model?: EformVisualEditorRecursionChecklistModel) {
    this.checklistModal.show(model);
  }

  showDeleteChecklistModal(model: EformVisualEditorRecursionChecklistModel) {
    this.checklistDeleteModal.show(model);
  }

  onCreateChecklist(model: EformVisualEditorRecursionChecklistModel) {
    if (model.checklistRecursionIndexes.length) {
      // Creating checklist inside nested checklists
      const indexes = new Array<number | string>();
      // if (model.checklistRecursionIndexes.length > 1) {
      model.checklistRecursionIndexes.forEach(
        (x) => indexes.push('checkLists', x) // checkLists[x]
      );
      // } else {
      //   indexes.push('checkLists');
      // }
      const visualTemplatePath = R.lensPath(indexes);
      let checklist: EformVisualEditorModel = R.view(
        visualTemplatePath,
        this.visualEditorTemplateModel
      );
      model.checklist = {
        ...model.checklist,
        id: null,
        position: checklist.checkLists.length,
        collapsed: true,
        parentChecklistId: checklist.id ?? checklist.tempId,
      };
      checklist = {
        ...checklist,
        checkLists: [...checklist.checkLists, model.checklist],
      };
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        checklist,
        this.visualEditorTemplateModel
      );
      if (this.selectedTemplateId) {
        this.eformVisualEditorUpdateModel.checklistForCreate = [
          ...this.eformVisualEditorUpdateModel.checklistForCreate,
          model.checklist,
        ];
      }
    } else {
      model.checklist = {
        ...model.checklist,
        id: null,
        position: this.visualEditorTemplateModel.checkLists.length,
        collapsed: true,
        parentChecklistId:
          this.visualEditorTemplateModel.id ??
          this.visualEditorTemplateModel.tempId,
      };
      if (this.selectedTemplateId) {
        this.eformVisualEditorUpdateModel.checklistForCreate = [
          ...this.eformVisualEditorUpdateModel.checklistForCreate,
          model.checklist,
        ];
      }
      // Creating checklist for the initial checklist
      this.visualEditorTemplateModel = {
        ...this.visualEditorTemplateModel,
        checkLists: [
          ...this.visualEditorTemplateModel.checkLists,
          model.checklist,
        ],
      };
    }
  }

  onUpdateChecklist(model: EformVisualEditorRecursionChecklistModel) {
    if (this.selectedTemplateId) {
      this.checkOnUpdateChecklist(model.checklist);
    }
    if (model.checklistRecursionIndexes.length) {
      // Updating checklist inside nested checklists
      const indexes = new Array<number | string>();
      if (model.checklistRecursionIndexes.length > 1) {
        model.checklistRecursionIndexes.forEach(
          (x) => indexes.push('checkLists', x) // checkLists[x]
        );
      }
      indexes.push('checkLists', model.checklistIndex); // for change checkLists[x].checkLists[model.checklistIndex]
      const visualTemplatePath = R.lensPath(indexes);
      let checklist: EformVisualEditorModel = R.view(
        visualTemplatePath,
        this.visualEditorTemplateModel
      );
      checklist = { ...checklist, ...model.checklist };
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        checklist,
        this.visualEditorTemplateModel
      );
    } else {
      // Updating checklist for the initial checklist
      this.visualEditorTemplateModel.checkLists = R.update(
        model.checklistIndex,
        model.checklist,
        this.visualEditorTemplateModel.checkLists
      );
    }
  }

  onDeleteChecklist(model: EformVisualEditorRecursionChecklistModel) {
    if (this.selectedTemplateId) {
      this.checkOnDeleteChecklist(model.checklist);
    }
    if (model.checklistRecursionIndexes.length) {
      // Deleting field inside nested checklists
      const indexes = new Array<number | string>();
      if (model.checklistRecursionIndexes.length > 1) {
        model.checklistRecursionIndexes.forEach(
          (x) => indexes.push('checkLists', x) // checkLists[x]
        );
      }
      indexes.push('checkLists'); // for change checkLists[x].checkLists. if remove this, have been change checkLists[x]
      const visualTemplatePath = R.lensPath(indexes);
      const checklists = R.view(
        visualTemplatePath,
        this.visualEditorTemplateModel
      );
      checklists.splice(model.checklistIndex, 1);
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        checklists,
        this.visualEditorTemplateModel
      );
    } else {
      // Deleting field for the initial checklist
      this.visualEditorTemplateModel.checkLists = R.remove(
        model.checklistIndex,
        1,
        this.visualEditorTemplateModel.checkLists
      );
    }
  }

  onFieldCreate(model: EformVisualEditorRecursionFieldModel) {
    if (model.checklistRecursionIndexes.length) {
      // Creating field inside nested checklists
      const indexes = new Array<number | string>();
      model.checklistRecursionIndexes.forEach(
        (x) => indexes.push('checkLists', x) // checkLists[x]
      );
      const visualTemplatePath = R.lensPath(indexes);
      let checklist: EformVisualEditorModel = R.view(
        visualTemplatePath,
        this.visualEditorTemplateModel
      ); // get checklist for update
      model.field = {
        ...model.field,
        checklistId: checklist.id ?? checklist.tempId,
        position: checklist.fields.length,
      };
      if (!R.isNil(model.fieldIndex)) {
        // add nested field to field
        const fieldGroup = checklist.fields[model.fieldIndex];
        model.field = {
          ...model.field,
          parentFieldId: fieldGroup.id ?? fieldGroup.tempId,
          position: fieldGroup.fields.length,
        };
        checklist.fields[model.fieldIndex].fields = [
          ...fieldGroup.fields,
          model.field,
        ];
      } else {
        checklist = {
          ...checklist,
          fields: [...checklist.fields, model.field],
        }; // add new field
      }
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        checklist,
        this.visualEditorTemplateModel
      ); // save changes
      if (this.selectedTemplateId) {
        // if template is selected - it update
        this.eformVisualEditorUpdateModel.fieldForCreate = [
          ...this.eformVisualEditorUpdateModel.fieldForCreate,
          model.field,
        ];
      }
    } else {
      model.field = {
        ...model.field,
        checklistId: this.visualEditorTemplateModel.id,
        position: this.visualEditorTemplateModel.fields.length,
      };

      if (!R.isNil(model.fieldIndex)) {
        // add nested field to field
        const groupField = this.visualEditorTemplateModel.fields[
          model.fieldIndex
        ];
        model.field = {
          ...model.field,
          position: groupField.fields.length,
          parentFieldId: groupField.id ?? groupField.tempId,
        };
        this.visualEditorTemplateModel.fields[model.fieldIndex].fields = [
          ...groupField.fields,
          model.field,
        ];
      } else {
        // Creating field for the initial checklist

        this.visualEditorTemplateModel = {
          ...this.visualEditorTemplateModel,
          fields: [...this.visualEditorTemplateModel.fields, model.field],
        };
      }
      if (this.selectedTemplateId) {
        // update or initial create
        this.eformVisualEditorUpdateModel.fieldForCreate = [
          ...this.eformVisualEditorUpdateModel.fieldForCreate,
          model.field,
        ];
      }
    }
  }

  onFieldUpdate(model: EformVisualEditorRecursionFieldModel) {
    if (this.selectedTemplateId) {
      this.checkOnUpdateField(model.field);
    }
    if (model.checklistRecursionIndexes.length) {
      // Updating field inside nested checklists
      const indexes = new Array<number | string>();
      model.checklistRecursionIndexes.forEach(
        (x) => indexes.push('checkLists', x) // checkLists[x]
      );
      if (!R.isNil(model.parentFieldIndex)) {
        indexes.push('fields', model.parentFieldIndex); // checkLists[x].fields[parentFieldIndex]
      }
      indexes.push('fields', model.fieldIndex);
      // checkLists[x].fields[fieldIndex] or checkLists[x].fields[parentFieldIndex].fields[fieldIndex]
      const visualTemplatePath = R.lensPath(indexes);
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        model.field,
        this.visualEditorTemplateModel
      );
    } else {
      // Updating field for the initial checklist
      if (!R.isNil(model.parentFieldIndex)) {
        // update in group field
        this.visualEditorTemplateModel.fields[
          model.parentFieldIndex
        ].fields = R.update(
          model.fieldIndex,
          model.field,
          this.visualEditorTemplateModel.fields[model.parentFieldIndex].fields
        );
      } else {
        // simple update
        this.visualEditorTemplateModel.fields = R.update(
          model.fieldIndex,
          model.field,
          this.visualEditorTemplateModel.fields
        );
      }
    }
  }

  onFieldDelete(model: EformVisualEditorRecursionFieldModel) {
    if (model.checklistRecursionIndexes.length) {
      // Deleting field inside nested checklists
      const indexes = new Array<number | string>();
      model.checklistRecursionIndexes.forEach(
        (x) => indexes.push('checkLists', x) // checkLists[x]
      );
      indexes.push('fields'); // checkLists[x].fields
      if (!R.isNil(model.parentFieldIndex)) {
        // if delete from fieldGroup
        indexes.push(model.parentFieldIndex, 'fields'); // checkLists[x].fields[parentFieldIndex].fields
      }
      const visualTemplatePath = R.lensPath(indexes);
      const fields = R.view(visualTemplatePath, this.visualEditorTemplateModel);
      fields.splice(model.fieldIndex, 1);
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        fields,
        this.visualEditorTemplateModel
      );
      if (this.selectedTemplateId) {
        this.checkOnDeleteField(model.field);
      }
    } else {
      // Deleting field for the initial checklist
      if (this.selectedTemplateId) {
        this.checkOnDeleteField(model.field);
      }

      if (!R.isNil(model.parentFieldIndex)) {
        // delete from group
        this.visualEditorTemplateModel.fields[
          model.parentFieldIndex
        ].fields = R.remove(
          model.fieldIndex,
          1,
          this.visualEditorTemplateModel.fields[model.parentFieldIndex].fields
        );
      } else {
        // simple delete
        this.visualEditorTemplateModel.fields = R.remove(
          model.fieldIndex,
          1,
          this.visualEditorTemplateModel.fields
        );
      }
    }
  }

  private checkOnUpdateField(field: EformVisualEditorFieldModel) {
    // when updating, need to check if the field was created or updated.
    // and if created-update in the array for creation.
    // if updated-update to array for updating
    if (field.id) {
      const index = R.findIndex(
        (x) => x.id === field.id,
        this.eformVisualEditorUpdateModel.fieldForUpdate
      ); // need find, if we updated this object
      if (index !== -1) {
        this.eformVisualEditorUpdateModel.fieldForUpdate = R.update(
          index,
          field,
          this.eformVisualEditorUpdateModel.fieldForUpdate
        );
      } else {
        this.eformVisualEditorUpdateModel.fieldForUpdate = [
          ...this.eformVisualEditorUpdateModel.fieldForUpdate,
          field,
        ];
      }
    } else if (field.tempId) {
      const index = R.findIndex(
        (x: EformVisualEditorFieldModel) => x.tempId === field.tempId,
        this.eformVisualEditorUpdateModel.fieldForCreate
      ); // need update created field
      this.eformVisualEditorUpdateModel.fieldForCreate = R.update(
        index,
        field,
        this.eformVisualEditorUpdateModel.fieldForCreate
      );
    }
  }

  private checkOnDeleteField(field: EformVisualEditorFieldModel) {
    // when deleting, need to check if the field was created or updated.
    // and if created, delete it from the array for creation.
    // if updated - remove from the mass for updating
    if (field.id) {
      this.eformVisualEditorUpdateModel.fieldForUpdate = R.reject(
        (x: EformVisualEditorFieldModel) => x.id === field.id,
        this.eformVisualEditorUpdateModel.fieldForUpdate
      );
      this.eformVisualEditorUpdateModel.fieldForDelete = [
        ...this.eformVisualEditorUpdateModel.fieldForDelete,
        field.id,
      ];
    } else if (field.tempId) {
      this.eformVisualEditorUpdateModel.fieldForCreate = R.reject(
        (x: EformVisualEditorFieldModel) => x.tempId === field.tempId,
        this.eformVisualEditorUpdateModel.fieldForCreate
      );
    }
  }

  private checkOnUpdateChecklist(checklist: EformVisualEditorModel) {
    if (checklist.id) {
      const index = this.eformVisualEditorUpdateModel.checklistForUpdate.findIndex(
        (x) => x.id === checklist.id
      );
      if (index !== -1) {
        this.eformVisualEditorUpdateModel.checklistForUpdate[index] = {
          ...checklist,
          checkLists: [],
          fields: [],
        };
      } else {
        this.eformVisualEditorUpdateModel.checklistForUpdate = [
          ...this.eformVisualEditorUpdateModel.checklistForUpdate,
          { ...checklist, checkLists: [], fields: [] },
        ];
      }
    } else if (checklist.tempId) {
      const index = this.eformVisualEditorUpdateModel.checklistForCreate.findIndex(
        (x) => x.tempId === checklist.tempId
      );
      if (index !== -1) {
        this.eformVisualEditorUpdateModel.checklistForCreate[index] = {
          ...checklist,
          checkLists: [],
          fields: [],
        };
      }
    }
  }

  private checkOnDeleteChecklist(checklist: EformVisualEditorModel) {
    if (checklist.id) {
      this.eformVisualEditorUpdateModel.checklistForUpdate = R.reject(
        (x: EformVisualEditorModel) => x.id === checklist.id,
        this.eformVisualEditorUpdateModel.checklistForUpdate
      );
      this.eformVisualEditorUpdateModel.checklistForDelete = [
        ...this.eformVisualEditorUpdateModel.checklistForDelete,
        checklist.id,
      ];
    } else if (checklist.tempId) {
      this.eformVisualEditorUpdateModel.checklistForCreate = R.reject(
        (x: EformVisualEditorModel) => x.tempId === checklist.tempId,
        this.eformVisualEditorUpdateModel.checklistForCreate
      );
    }
  }

  private checkPosition(mas: any[], masIsChecklists: boolean = false): any[] {
    for (let i = 0; i < mas.length; i++) {
      if (mas[i].position !== i) {
        mas[i].position = i;
        if (this.selectedTemplateId) {
          masIsChecklists
            ? this.checkOnUpdateChecklist(mas[i])
            : this.checkOnUpdateField(mas[i]);
        }
      }
    }
    return mas;
  }

  onAddOrDeleteLanguage(model: { addTranslate: boolean; languageId: number }) {
    if (model) {
      if (model.addTranslate) {
        this.selectedLanguages = [...this.selectedLanguages, model.languageId];
      } else {
        this.selectedLanguages = [
          ...this.selectedLanguages.filter((x) => x !== model.languageId),
        ];
      }
    }
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('CHECK_LISTS');
    this.dragulaService.destroy('FIELDS');
  }
}
