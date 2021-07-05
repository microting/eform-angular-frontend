import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as R from 'ramda';
import { Subscription } from 'rxjs';
import { applicationLanguages } from 'src/app/common/const';
import {
  CommonDictionaryModel,
  EformVisualEditorFieldModel,
  EformVisualEditorModel,
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

  visualEditorTemplateModel: EformVisualEditorModel = new EformVisualEditorModel();
  selectedTemplateId: number;
  availableTags: CommonDictionaryModel[] = [];
  isItemsCollapsed = false;

  getTagsSub$: Subscription;
  getVisualTemplateSub$: Subscription;
  createVisualTemplateSub$: Subscription;
  updateVisualTemplateSub$: Subscription;

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
  }

  getVisualTemplate(templateId: number) {
    this.getVisualTemplateSub$ = this.visualEditorService
      .getVisualEditorTemplate(templateId)
      .subscribe((data) => {
        if (data && data.success) {
          this.visualEditorTemplateModel = data.model;
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
          { id: language.id, description: '', name: '' },
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

  onFieldPositionChanged(model: EformVisualEditorFieldModel[]) {
    this.visualEditorTemplateModel.fields = [...model];
  }

  onDeleteElement(model?: any) {}

  showFieldModal(model?: { fieldIndex: number }) {
    debugger;
    if (model) {
      const foundField = this.visualEditorTemplateModel.fields[
        model.fieldIndex
      ];
      this.fieldModal.show(foundField, model.fieldIndex);
    } else {
      this.fieldModal.show();
    }
  }

  showDeleteFieldModal(model: {
    fieldIndex: number;
    field: EformVisualEditorFieldModel;
  }) {
    this.fieldDeleteModal.show(model.fieldIndex, model.field);
  }

  showChecklistModal(model?: EformVisualEditorModel) {
    this.checklistModal.show(model);
  }

  onChecklistCreate(model: EformVisualEditorModel) {
    this.visualEditorTemplateModel = {
      ...this.visualEditorTemplateModel,
      checkLists: [...this.visualEditorTemplateModel.checkLists, model],
    };
  }

  onChecklistUpdate(model: EformVisualEditorModel) {}

  onFieldCreate(model: EformVisualEditorFieldModel) {
    // Todo: redesign for nesting
    this.visualEditorTemplateModel = {
      ...this.visualEditorTemplateModel,
      fields: [...this.visualEditorTemplateModel.fields, model],
    };
  }

  onFieldUpdate(model: {
    field: EformVisualEditorFieldModel;
    fieldIndex: number;
  }) {
    // Todo: redesign for nesting
    debugger;
    this.visualEditorTemplateModel.fields = R.update(
      model.fieldIndex,
      model.field,
      this.visualEditorTemplateModel.fields
    );
  }

  ngOnDestroy(): void {}

  onDeleteField(model: { fieldIndex: number }) {
    this.visualEditorTemplateModel.fields = R.remove(
      model.fieldIndex,
      1,
      this.visualEditorTemplateModel.fields
    );
    this.fieldDeleteModal.hide();
  }
}
