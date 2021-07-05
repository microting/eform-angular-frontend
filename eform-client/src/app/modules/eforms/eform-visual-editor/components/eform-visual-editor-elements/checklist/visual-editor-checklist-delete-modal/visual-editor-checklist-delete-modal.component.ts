import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { applicationLanguages } from 'src/app/common/const';
import {
  CommonDictionaryModel,
  EformVisualEditorModel,
} from 'src/app/common/models';

@Component({
  selector: 'app-visual-editor-checklist-delete-modal',
  templateUrl: './visual-editor-checklist-delete-modal.component.html',
  styleUrls: ['./visual-editor-checklist-delete-modal.component.scss'],
})
export class VisualEditorChecklistDeleteModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output()
  deleteChecklist: EventEmitter<EformVisualEditorModel> = new EventEmitter<EformVisualEditorModel>();
  selectedChecklist: EformVisualEditorModel;
  selectedChecklistTranslations: CommonDictionaryModel[] = [];

  get languages() {
    return applicationLanguages;
  }

  constructor() {}

  ngOnInit() {}

  show(model?: EformVisualEditorModel) {
    this.selectedChecklist = model;
    this.frame.show();
  }
}
