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
  EformVisualEditorFieldModel,
  EformVisualEditorModel,
} from 'src/app/common/models';
import { EformVisualEditorService } from 'src/app/common/services';

@Component({
  selector: 'app-eform-visual-editor-block',
  templateUrl: './eform-visual-editor-block.component.html',
  styleUrls: ['./eform-visual-editor-block.component.scss'],
})
export class EformVisualEditorBlockComponent implements OnInit, OnDestroy {
  @ViewChild('collapse', { static: true }) collapse: CollapseComponent;
  @Input() checklist: EformVisualEditorModel;
  @Input() field: EformVisualEditorFieldModel;
  @Input() visualEditorTemplateModel: EformVisualEditorModel;
  @Input() elementIndex: number;
  @Input() checklistRecursionIndex: number[] = [0];
  @Input() fieldRecursionIndex: number[] = [0];
  @Input() elementRecursionIndex: number[] = [0];
  @Output() addNewChecklist: EventEmitter<any> = new EventEmitter<any>();
  @Output() addNewField: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  fieldPositionChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteField: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateField: EventEmitter<{ fieldIndex: number }> = new EventEmitter<{ fieldIndex: number }>();
  dragulaElementContainerName = UUID.UUID();

  collapseSub$: Subscription;

  public composeIndexes(item: number[], index: number): number[] {
    return [...item, index];
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

  onAddNewChecklist(position: number) {
    this.addNewChecklist.emit(position);
  }

  onAddNewField(position: number) {
    this.addNewChecklist.emit(position);
  }

  deleteChecklist(position: number) {
    this.deleteField.emit(position);
  }

  ngOnDestroy(): void {}

  onFieldChanged(model: EformVisualEditorFieldModel[]) {
    this.fieldPositionChanged.emit(model);
  }

  onEditField() {
    // Todo: include checklist index
    this.updateField.emit({ fieldIndex: this.elementIndex });
  }

  onDeleteField() {}
}
