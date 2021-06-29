import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { EformVisualEditorFieldModel } from 'src/app/common/models';

@Component({
  selector: 'app-eform-visual-editor-element-switch',
  templateUrl: './eform-visual-editor-element-switch.component.html',
  styleUrls: ['./eform-visual-editor-element-switch.component.scss'],
})
export class EformVisualEditorElementSwitchComponent implements OnInit {
  @Input() fieldList: EformVisualEditorFieldModel[] = [];
  @Input() dragulaContainerName = 'CHECKLIST_FIELDS';
  @Output() fieldListChanged: EventEmitter<
    EformVisualEditorFieldModel[]
  > = new EventEmitter();

  constructor(private dragulaService: DragulaService) {}

  ngOnInit() {
    this.dragulaService.createGroup(this.dragulaContainerName, {
      removeOnSpill: false,
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      copy: (el, source) => {
        return source.id === this.dragulaContainerName;
      },
      copyItem: (customItem: any) => {
        return new EformVisualEditorFieldModel();
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== this.dragulaContainerName;
      },
    });
  }

  onDataItemListChanged(e: EformVisualEditorFieldModel[]) {
    this.fieldList = e;
    this.fieldListChanged.emit(this.fieldList);
  }
}
