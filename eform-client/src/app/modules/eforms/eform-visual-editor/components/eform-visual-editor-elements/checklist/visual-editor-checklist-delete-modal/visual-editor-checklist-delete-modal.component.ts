import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EformVisualEditorRecursionChecklistModel } from 'src/app/common/models';

@Component({
  selector: 'app-visual-editor-checklist-delete-modal',
  templateUrl: './visual-editor-checklist-delete-modal.component.html',
  styleUrls: ['./visual-editor-checklist-delete-modal.component.scss'],
})
export class VisualEditorChecklistDeleteModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  deleteChecklist: EventEmitter<EformVisualEditorRecursionChecklistModel> = new EventEmitter();
  recursionChecklistModel: EformVisualEditorRecursionChecklistModel = new EformVisualEditorRecursionChecklistModel();

  constructor() {}

  ngOnInit() {}

  show(model: EformVisualEditorRecursionChecklistModel) {
    this.recursionChecklistModel = model;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  onDeleteChecklist() {
    this.deleteChecklist.emit(this.recursionChecklistModel);
    this.frame.hide();
  }
}
