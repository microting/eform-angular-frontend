import { Component, Input, OnInit } from '@angular/core';
import { EformVisualEditorModel } from 'src/app/common/models';

@Component({
  selector: 'app-eform-visual-editor-header',
  templateUrl: './eform-visual-editor-header.component.html',
  styleUrls: ['./eform-visual-editor-header.component.scss'],
})
export class EformVisualEditorHeaderComponent implements OnInit {
  @Input()
  visualEditorModel: EformVisualEditorModel = new EformVisualEditorModel();

  constructor() {}

  ngOnInit(): void {}
}
