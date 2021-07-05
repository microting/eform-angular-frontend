import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EformVisualEditorFieldModel } from 'src/app/common/models';

@Component({
  selector: 'app-visual-editor-field-delete-modal',
  templateUrl: './visual-editor-field-delete-modal.component.html',
  styleUrls: ['./visual-editor-field-delete-modal.component.scss'],
})
export class VisualEditorFieldDeleteModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output() fieldDelete: EventEmitter<{
    fieldIndex: number;
  }> = new EventEmitter<{ fieldIndex: number }>();
  fieldModel: EformVisualEditorFieldModel = new EformVisualEditorFieldModel();
  fieldIndex: number;

  constructor() {}

  ngOnInit() {}

  show(fieldIndex: number, field: EformVisualEditorFieldModel) {
    this.fieldModel = field;
    this.fieldIndex = fieldIndex;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  onFieldDelete() {
    this.fieldDelete.emit({ fieldIndex: this.fieldIndex });
  }
}
