import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EformVisualEditorFieldModel } from 'src/app/common/models';

@Component({
  selector: 'app-visual-editor-additional-field-number',
  templateUrl: './visual-editor-additional-field-number.component.html',
  styleUrls: ['./visual-editor-additional-field-number.component.scss'],
})
export class VisualEditorAdditionalFieldNumberComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {}
}
