import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CollapseComponent } from 'angular-bootstrap-md';
import { UUID } from 'angular2-uuid';
import { Subscription } from 'rxjs';
import {
  EformVisualEditorFieldsDnDRecursionModel,
  EformVisualEditorFieldModel,
  EformVisualEditorModel,
  EformVisualEditorRecursionModel,
  EformVisualEditorRecursionFieldModel,
  EformVisualEditorRecursionChecklistModel,
} from 'src/app/common/models';
import { EformVisualEditorService } from 'src/app/common/services';

@Component({
  selector: 'app-visual-editor-checklist',
  templateUrl: './visual-editor-checklist.component.html',
  styleUrls: ['./visual-editor-checklist.component.scss'],
})
export class VisualEditorChecklistComponent implements OnInit, OnDestroy {
  @ViewChild('collapse', { static: true }) collapse: CollapseComponent;
  @Input() checklist: EformVisualEditorModel;
  @Input() visualEditorTemplateModel: EformVisualEditorModel;
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
  dragulaElementContainerName = UUID.UUID();

  collapseSub$: Subscription;

  get composeIndexes() {
    return [...this.checklistRecursionIndexes, this.checklistIndex];
  }

  get isChecklistComplete() {
    return this.checklist.translations.find((x) => x.name !== '');
  }

  constructor(
    private translateService: TranslateService,
    private visualEditorService: EformVisualEditorService
  ) {}

  ngOnInit() {
    this.collapseSub$ = this.visualEditorService.collapse.subscribe(
      (collapsed) => {
        if (!collapsed && this.checklist && this.checklist.collapsed) {
          this.checklist.collapsed = false;
          this.collapse.toggle();
        }
        if (collapsed && this.checklist && !this.checklist.collapsed) {
          this.checklist.collapsed = true;
          this.collapse.toggle();
        }
      }
    );
  }

  onAddNewNestedChecklist() {
    this.addNewNestedChecklist.emit({
      checklistRecursionIndex: this.checklistRecursionIndex,
    });
  }

  onEditChecklist() {
    this.editNestedChecklist.emit({
      checklist: { ...this.checklist },
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
    });
  }

  onDeleteChecklist() {
    this.deleteNestedChecklist.emit({
      checklist: { ...this.checklist },
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
      checklistRecursionIndexes: this.checklistRecursionIndexes
    });
  }

  onAddNewNestedField() {
    this.addNewNestedChecklist.emit({
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
    });
  }

  onNestedFieldChanged(model: EformVisualEditorFieldModel[]) {
    this.nestedFieldPositionChanged.emit({
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
      fields: model,
    });
  }

  onEditNestedField(fieldIndex: number, field: EformVisualEditorFieldModel) {
    this.editNestedField.emit({
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
      fieldIndex,
      field,
    });
  }

  onDeleteNestedField(fieldIndex: number, field: EformVisualEditorFieldModel) {
    this.deleteNestedField.emit({
      checklistRecursionIndex: this.checklistRecursionIndex,
      checklistIndex: this.checklistIndex,
      fieldIndex,
      field,
    });
  }

  ngOnDestroy(): void {}
}
