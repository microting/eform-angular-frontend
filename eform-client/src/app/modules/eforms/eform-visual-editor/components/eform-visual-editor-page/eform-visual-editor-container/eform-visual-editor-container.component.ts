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
  EformVisualEditorRecursionModel,
} from 'src/app/common/models';
import { SharedTagsComponent } from 'src/app/common/modules/eform-shared-tags/components';
import {
  EformTagService,
  EformVisualEditorService,
} from 'src/app/common/services';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-visual-editor-container',
  templateUrl: './eform-visual-editor-container.component.html',
  styleUrls: ['./eform-visual-editor-container.component.scss'],
})
export class EformVisualEditorContainerComponent implements OnInit, OnDestroy {
  @ViewChild('tagsModal') tagsModal: SharedTagsComponent;
  @ViewChild('fieldModal') fieldModal: any;
  @ViewChild('fieldDeleteModal') fieldDeleteModal: any;
  @ViewChild('checklistModal') checklistModal: any;
  @ViewChild('checklistDeleteModal') checklistDeleteModal: any;

  visualEditorTemplateModel: EformVisualEditorModel = new EformVisualEditorModel();
  selectedTemplateId: number;
  availableTags: CommonDictionaryModel[] = [];
  isItemsCollapsed = false;

  getTagsSub$: Subscription;
  getVisualTemplateSub$: Subscription;
  createVisualTemplateSub$: Subscription;
  updateVisualTemplateSub$: Subscription;
  collapseSub$: Subscription;

  constructor(
    private tagsService: EformTagService,
    private visualEditorService: EformVisualEditorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
          if (
            this.visualEditorTemplateModel.translations.length <
            applicationLanguages.length
          ) {
            for (const language of applicationLanguages) {
              if (
                !this.visualEditorTemplateModel.translations.find(
                  (x) => x.languageId === language.id
                )
              ) {
                this.visualEditorTemplateModel.translations = [
                  ...this.visualEditorTemplateModel.translations,
                  {
                    id: null,
                    languageId: language.id,
                    description: '',
                    name: '',
                  },
                ];
              }
            }
          }
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
    this.updateVisualTemplateSub$ = this.visualEditorService
      .updateVisualEditorTemplate(this.visualEditorTemplateModel)
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

  dragulaPositionChanged(model: EformVisualEditorFieldModel[]) {
    this.visualEditorTemplateModel.fields = [...model];
  }

  onFieldPositionChanged(model: EformVisualEditorFieldsDnDRecursionModel) {
    // TODO: FIND FIX GRAPH
    this.visualEditorTemplateModel.fields = [...model.fields];
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
      model.checklist = {
        ...model.checklist,
        id: null,
        position: model.checklistRecursionIndex,
        collapsed: true,
      };
      model.checklistRecursionIndexes.forEach(
        (x) => indexes.push('checkLists', x) // checkLists[x]
      );
      indexes.push('checkLists'); // for change checkLists[x].checkLists. if remove this, have been change checkLists[x]
      const visualTemplatePath = R.lensPath(indexes);
      this.visualEditorTemplateModel = R.set(
        visualTemplatePath,
        [model.checklist],
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

  onUpdateChecklist(model: EformVisualEditorRecursionChecklistModel) {
    if (model.checklistRecursionIndexes.length) {
      // Updating checklist inside nested checklists
      // TODO: FIND FIX GRAPH
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
    if (model.checklistRecursionIndexes.length) {
      // Deleting field inside nested checklists
      // TODO: FIND FIX GRAPH
    } else {
      // Deleting field for the initial checklist
      this.visualEditorTemplateModel.checkLists = R.remove(
        model.checklistIndex,
        1,
        this.visualEditorTemplateModel.checkLists
      );
    }
  }

  onAddNewNestedField(model: EformVisualEditorRecursionModel) {
    // TODO: FIND FIX GRAPH
  }

  onFieldCreate(model: EformVisualEditorRecursionFieldModel) {
    if (model.checklistRecursionIndexes.length) {
      // Creating field inside nested checklists
      // TODO: FIND FIX GRAPH
    } else {
      // Creating field for the initial checklist
      this.visualEditorTemplateModel = {
        ...this.visualEditorTemplateModel,
        fields: [...this.visualEditorTemplateModel.fields, model.field],
      };
    }
  }

  onFieldUpdate(model: EformVisualEditorRecursionFieldModel) {
    if (model.checklistRecursionIndexes.length) {
      // Updating field inside nested checklists
      // TODO: FIND FIX GRAPH
    } else {
      // Updating field for the initial checklist
      this.visualEditorTemplateModel.fields = R.update(
        model.fieldIndex,
        model.field,
        this.visualEditorTemplateModel.fields
      );
    }
  }

  onFieldDelete(model: EformVisualEditorRecursionModel) {
    if (model.checklistRecursionIndexes.length) {
      // Deleting field inside nested checklists
      // TODO: FIND FIX GRAPH
    } else {
      // Deleting field for the initial checklist
      this.visualEditorTemplateModel.fields = R.remove(
        model.fieldIndex,
        1,
        this.visualEditorTemplateModel.fields
      );
    }
  }

  ngOnDestroy(): void {}
}
