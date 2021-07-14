import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as R from 'ramda';
import { Subscription } from 'rxjs';
import { applicationLanguages } from 'src/app/common/const';
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
import { fixTranslations, getRandomInt } from 'src/app/common/helpers';
import { VisualEditorFieldModalComponent } from '../../';
import { DragulaService } from 'ng2-dragula';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-visual-editor-container',
  templateUrl: './eform-visual-editor-container.component.html',
  styleUrls: ['./eform-visual-editor-container.component.scss'],
})
export class EformVisualEditorContainerComponent implements OnInit, OnDestroy {
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

  getTagsSub$: Subscription;
  getVisualTemplateSub$: Subscription;
  createVisualTemplateSub$: Subscription;
  updateVisualTemplateSub$: Subscription;
  collapseSub$: Subscription;

  constructor(
    private dragulaService: DragulaService,
    private tagsService: EformTagService,
    private visualEditorService: EformVisualEditorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dragulaService.createGroup('CHECK_LISTS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      accepts: (el, target) => {
        return target.id === 'editorChecklists' && el.id.includes('checkList_');
      },
    });
  }

  ngOnInit(): void {
    this.getTags();

    this.route.params.subscribe((params) => {
      this.selectedTemplateId = params['templateId'];
      if (this.selectedTemplateId) {
        this.getVisualTemplate(this.selectedTemplateId);
      } else {
        this.initForm();
      }
    });

    this.collapseSub$ = this.visualEditorService.collapse.subscribe((data) => {
      this.isItemsCollapsed = data;
    });
  }

  getVisualTemplate(templateId: number) {
    this.getVisualTemplateSub$ = this.visualEditorService
      .getVisualEditorTemplate(templateId)
      .subscribe((data) => {
        if (data && data.success) {
          this.visualEditorTemplateModel = data.model;
          // if there are not enough translations
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
    for (const language of applicationLanguages) {
      this.visualEditorTemplateModel = {
        ...this.visualEditorTemplateModel,
        translations: [
          ...this.visualEditorTemplateModel.translations,
          { id: null, languageId: language.id, description: '', name: '' },
        ],
      };
    }
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

  toggleCollapse() {}

  dragulaPositionChecklistChanged(model: EformVisualEditorModel[]) {
    for (let i = 0; i < model.length; i++) {
      if (model[i].position !== i) {
        model[i].position = i;
        if (model[i].id) {
          const index = this.eformVisualEditorUpdateModel.checklistForUpdate.findIndex(
            (x) => x.id === model[i].id
          );
          if (index === -1) {
            this.eformVisualEditorUpdateModel.checklistForUpdate = [
              ...this.eformVisualEditorUpdateModel.checklistForUpdate,
              { ...model[i], checkLists: [], fields: [] },
            ];
          } else {
            this.eformVisualEditorUpdateModel.checklistForUpdate[index] = {
              ...model[i],
              checkLists: [],
              fields: [],
            };
          }
        } else if (model[i].tempId) {
          const index = this.eformVisualEditorUpdateModel.checklistForCreate.findIndex(
            (x) => x.tempId === model[i].tempId
          );
          if (index === -1) {
            this.eformVisualEditorUpdateModel.checklistForCreate = [
              ...this.eformVisualEditorUpdateModel.checklistForCreate,
              { ...model[i], checkLists: [], fields: [] },
            ];
          } else {
            this.eformVisualEditorUpdateModel.checklistForCreate[index] = {
              ...model[i],
              checkLists: [],
              fields: [],
            };
          }
        }
      }
    }
    this.visualEditorTemplateModel.checkLists = [...model];
  }

  dragulaPositionFieldChanged(model: EformVisualEditorFieldModel[]) {
    for (let i = 0; i < model.length; i++) {
      if (model[i].position !== i) {
        model[i].position = i;
        if (model[i].id) {
          const index = this.eformVisualEditorUpdateModel.fieldForUpdate.findIndex(
            (x) => x.id === model[i].id
          );
          if (index === -1) {
            this.eformVisualEditorUpdateModel.fieldForUpdate = [
              ...this.eformVisualEditorUpdateModel.fieldForUpdate,
              model[i],
            ];
          } else {
            this.eformVisualEditorUpdateModel.fieldForUpdate[index] = model[i];
          }
        } else if (model[i].tempId) {
          const index = this.eformVisualEditorUpdateModel.fieldForCreate.findIndex(
            (x) => x.tempId === model[i].tempId
          );
          if (index === -1) {
            this.eformVisualEditorUpdateModel.fieldForCreate = [
              ...this.eformVisualEditorUpdateModel.fieldForCreate,
              model[i],
            ];
          } else {
            this.eformVisualEditorUpdateModel.fieldForCreate[index] = model[i];
          }
        }
      }
    }
    this.visualEditorTemplateModel.fields = [...model];
  }

  onNestedFieldPositionChanged(
    model: EformVisualEditorFieldsDnDRecursionModel
  ) {
    if (this.selectedTemplateId) {
      // Deleting field inside nested checklists
      let indexes = new Array<number | string>();
      if (model.checklistRecursionIndexes.length) {
        if (model.checklistRecursionIndexes.length === 1) {
          indexes = ['checkLists', model.checklistIndex];
        } else {
          model.checklistRecursionIndexes.forEach(
            (x) => indexes.push('checkLists', x) // checkLists[x]
          );
        }
      }
      indexes.push('fields'); // checkLists[x].fields
      const visualTemplatePath = R.lensPath(indexes);

      for (let i = 0; i < model.fields.length; i++) {
        if (model.fields[i].position !== i) {
          model.fields[i].position = i;
          if (model.fields[i].id) {
            const index = this.eformVisualEditorUpdateModel.fieldForUpdate.findIndex(
              (x) => x.id === model.fields[i].id
            );
            if (index === -1) {
              this.eformVisualEditorUpdateModel.fieldForUpdate = [
                ...this.eformVisualEditorUpdateModel.fieldForUpdate,
                model.fields[i],
              ];
            } else {
              this.eformVisualEditorUpdateModel.fieldForUpdate[index] =
                model.fields[i];
            }
          } else if (model.fields[i].tempId) {
            const index = this.eformVisualEditorUpdateModel.fieldForCreate.findIndex(
              (x) => x.tempId === model.fields[i].tempId
            );
            if (index === -1) {
              this.eformVisualEditorUpdateModel.fieldForCreate = [
                ...this.eformVisualEditorUpdateModel.fieldForCreate,
                model.fields[i],
              ];
            } else {
              this.eformVisualEditorUpdateModel.fieldForCreate[index] =
                model.fields[i];
            }
          }
        }
      }
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        model.fields,
        this.visualEditorTemplateModel
      );
    } else {
      this.visualEditorTemplateModel.fields = [...model.fields];
    }
  }

  showFieldModal(model?: EformVisualEditorRecursionFieldModel) {
    this.fieldModal.show(
      model,
      model ? null : this.visualEditorTemplateModel.id // add field to root checklist
    );
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
    if (this.selectedTemplateId) {
      // Creating checklist inside nested checklists
      model.checklist = {
        ...model.checklist,
        id: null,
        position: model.checklistRecursionIndex,
        collapsed: true,
        tempId: getRandomInt(1000, 10000),
      };
      const indexes = new Array<number | string>();
      if (model.checklistRecursionIndexes.length) {
        model.checklistRecursionIndexes.forEach(
          (x) => indexes.push('checkLists', x) // checkLists[x]
        );
      }
      indexes.push('checkLists'); // for change checkLists[x].checkLists. if remove this, have been change checkLists[x]
      const visualTemplatePath = R.lensPath(indexes);
      const checklists: EformVisualEditorModel[] = (this.visualEditorTemplateModel = R.view(
        visualTemplatePath,
        this.visualEditorTemplateModel
      ));
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        [...checklists, model.checklist],
        this.visualEditorTemplateModel
      );
      this.eformVisualEditorUpdateModel.checklistForCreate = [
        ...this.eformVisualEditorUpdateModel.checklistForCreate,
        model.checklist,
      ];
    } else {
      if (model.checklistRecursionIndexes.length) {
        const indexes = new Array<number | string>();
        model.checklistRecursionIndexes.forEach(
          (x) => indexes.push('checkLists', x) // checkLists[x]
        );
        indexes.push('checkLists'); // for change checkLists[x].checkLists. if remove this, have been change checkLists[x]
        const visualTemplatePath = R.lensPath(indexes);
        const checklists: EformVisualEditorModel[] = R.view(
          visualTemplatePath,
          this.visualEditorTemplateModel
        );
        this.visualEditorTemplateModel = R.set(
          visualTemplatePath,
          [...checklists, model.checklist],
          this.visualEditorTemplateModel
        );
      } else {
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
  }

  onUpdateChecklist(model: EformVisualEditorRecursionChecklistModel) {
    if (this.selectedTemplateId) {
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
      this.checkOnUpdateChecklist(model.checklist, checklist);
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
      this.checkOnDeleteChecklist(model.checklist);
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
    model.field = {
      ...model.field,
      id: null,
      tempId: getRandomInt(1000, 10000),
      position: model.field.position
        ? model.field.position
        : model.fieldPosition ?? this.visualEditorTemplateModel.fields.length,
      checklistId: model.field.checklistId ?? model.checklistId,
    };
    if (this.selectedTemplateId) {
      // if template is selected - it update
      // Creating field inside nested checklists
      const indexes = new Array<number | string>();
      if (model.checklistRecursionIndexes.length) {
        model.checklistRecursionIndexes.forEach(
          (x) => indexes.push('checkLists', x) // checkLists[x]
        );
      }
      indexes.push('fields'); // checkLists[x].fields
      const visualTemplatePath = R.lensPath(indexes);
      let fields: EformVisualEditorFieldModel[] = R.view(
        visualTemplatePath,
        this.visualEditorTemplateModel
      ); // get fields for update
      fields = [...fields, model.field]; // add new field
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        fields,
        this.visualEditorTemplateModel
      ); // save changes
      this.eformVisualEditorUpdateModel.fieldForCreate = [
        ...this.eformVisualEditorUpdateModel.fieldForCreate,
        model.field,
      ];
    } else {
      // Creating field for the initial checklist
      model.field = {
        ...model.field,
        checklistId:
          model.field.checklistId ??
          model.checklistId ??
          this.visualEditorTemplateModel.id,
      };
      this.visualEditorTemplateModel = {
        ...this.visualEditorTemplateModel,
        fields: [...this.visualEditorTemplateModel.fields, model.field],
      };
    }
  }

  onFieldUpdate(model: EformVisualEditorRecursionFieldModel) {
    if (this.selectedTemplateId) {
      // Updating field inside nested checklists
      const indexes = new Array<number | string>();
      if (model.checklistRecursionIndexes.length) {
        model.checklistRecursionIndexes.forEach(
          (x) => indexes.push('checkLists', x) // checkLists[x]
        );
      }
      indexes.push('fields', model.fieldIndex); // checkLists[x].fields
      const visualTemplatePath = R.lensPath(indexes);
      let field: EformVisualEditorFieldModel = R.view(
        visualTemplatePath,
        this.visualEditorTemplateModel
      );
      field = { ...field, ...model.field };
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        field,
        this.visualEditorTemplateModel
      );
      this.checkOnUpdateField(field);
    } else {
      // Updating field for the initial checklist
      this.visualEditorTemplateModel.fields = R.update(
        model.fieldIndex,
        model.field,
        this.visualEditorTemplateModel.fields
      );
    }
  }

  onFieldDelete(model: EformVisualEditorRecursionFieldModel) {
    if (this.selectedTemplateId) {
      // Deleting field inside nested checklists
      const indexes = new Array<number | string>();
      if (model.checklistRecursionIndexes.length) {
        model.checklistRecursionIndexes.forEach(
          (x) => indexes.push('checkLists', x) // checkLists[x]
        );
      }
      indexes.push('fields'); // checkLists[x].fields
      const visualTemplatePath = R.lensPath(indexes);
      const fields = R.view(visualTemplatePath, this.visualEditorTemplateModel);
      fields.splice(model.fieldIndex, 1);
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        fields,
        this.visualEditorTemplateModel
      );
      this.checkOnDeleteField(model.field);
    } else {
      // Deleting field for the initial checklist
      this.visualEditorTemplateModel.fields = R.remove(
        model.fieldIndex,
        1,
        this.visualEditorTemplateModel.fields
      );
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
      // if (index !== -1) {
      //   this.eformVisualEditorUpdateModel.fieldForCreate[index] = field;
      // }
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

  private checkOnUpdateChecklist(
    modelChecklist: EformVisualEditorModel,
    checklist: EformVisualEditorModel
  ) {
    if (checklist.id) {
      const index = this.eformVisualEditorUpdateModel.checklistForUpdate.findIndex(
        (x) => x.id === checklist.id
      );
      if (index !== -1) {
        this.eformVisualEditorUpdateModel.checklistForUpdate[index] = {
          ...checklist,
          ...modelChecklist,
          checkLists: [],
          fields: [],
        };
      } else {
        this.eformVisualEditorUpdateModel.checklistForUpdate = [
          ...this.eformVisualEditorUpdateModel.checklistForUpdate,
          { ...checklist, ...modelChecklist, checkLists: [], fields: [] },
        ];
      }
    } else if (checklist.tempId) {
      const index = this.eformVisualEditorUpdateModel.checklistForCreate.findIndex(
        (x) => x.tempId === checklist.tempId
      );
      if (index !== -1) {
        this.eformVisualEditorUpdateModel.checklistForCreate[index] = {
          ...checklist,
          ...modelChecklist,
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

  ngOnDestroy(): void {
    this.dragulaService.destroy('CHECK_LISTS');
  }
}
