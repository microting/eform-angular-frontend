import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EformVisualEditorFieldModel } from 'src/app/common/models';

@Component({
  selector: 'app-visual-editor-additional-field-save-button',
  templateUrl: './visual-editor-additional-field-save-button.component.html',
  styleUrls: ['./visual-editor-additional-field-save-button.component.scss'],
})
export class VisualEditorAdditionalFieldSaveButtonComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {}
}
