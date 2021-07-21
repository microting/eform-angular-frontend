import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EformVisualEditorRecursionFieldModel } from 'src/app/common/models';

@Component({
  selector: 'app-visual-editor-field-delete-modal',
  templateUrl: './visual-editor-field-delete-modal.component.html',
  styleUrls: ['./visual-editor-field-delete-modal.component.scss'],
})
export class VisualEditorFieldDeleteModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  fieldDelete: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  recursionFieldModel: EformVisualEditorRecursionFieldModel = new EformVisualEditorRecursionFieldModel();

  constructor() {}

  ngOnInit() {}

  show(model: EformVisualEditorRecursionFieldModel) {
    this.recursionFieldModel = model;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  onFieldDelete() {
    this.fieldDelete.emit(this.recursionFieldModel);
    this.frame.hide();
  }
}
