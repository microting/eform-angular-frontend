import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {DataItemDto} from 'src/app/common/models';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ElementPictureComponent } from '../case-elements/element-picture/element-picture.component';
import { ElementCheckboxComponent, toggleCheckboxValue } from '../case-elements/element-checkbox/element-checkbox.component';
import { ElementNumberComponent } from '../case-elements/element-number/element-number.component';
import { ElementNumberStepperComponent } from '../case-elements/element-number-stepper/element-number-stepper.component';
import { ElementCommentComponent } from '../case-elements/element-comment/element-comment.component';
import { ElementTextComponent } from '../case-elements/element-text/element-text.component';
import { ElementDateComponent } from '../case-elements/element-date/element-date.component';
import { ElementSingleselectComponent } from '../case-elements/element-singleselect/element-singleselect.component';
import { ElementMultiselectComponent } from '../case-elements/element-multiselect/element-multiselect.component';
import { ElementPdfComponent } from '../case-elements/element-pdf/element-pdf.component';
import { ElementInfoboxComponent } from '../case-elements/element-infobox/element-infobox.component';
import { ElementTimerComponent } from '../case-elements/element-timer/element-timer.component';
import { ElementSignatureComponent } from '../case-elements/element-signature/element-signature.component';
import { ElementContainerComponent } from '../case-elements/element-container/element-container.component';
import { ElementEntitysearchComponent } from '../case-elements/element-entitysearch/element-entitysearch.component';
import { ElementEntityselectComponent } from '../case-elements/element-entityselect/element-entityselect.component';
import { ElementAudioComponent } from '../case-elements/element-audio/element-audio.component';

@Component({
    selector: 'app-case-edit-switch',
    templateUrl: './case-edit-switch.component.html',
    imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, ElementPictureComponent, ElementCheckboxComponent, ElementNumberComponent, ElementNumberStepperComponent, ElementCommentComponent, ElementTextComponent, ElementDateComponent, ElementSingleselectComponent, ElementMultiselectComponent, ElementPdfComponent, ElementInfoboxComponent, ElementTimerComponent, ElementSignatureComponent,
      // ElementContainerComponent imports this component back; forwardRef makes the
      // compiler emit a lazy dependency list so neither side captures `undefined`.
      forwardRef(() => ElementContainerComponent), ElementEntitysearchComponent, ElementEntityselectComponent, ElementAudioComponent, NgSwitchDefault]
})
export class CaseEditSwitchComponent implements OnInit {
  @Input() dataItemList: Array<DataItemDto> = [];
  /**
   * Id of the case being edited, threaded down to the picture element. Optional
   * — it is only needed where the ActivatedRoute cannot supply it, i.e. when
   * the case editor is rendered inside a dialog rather than on a case route.
   */
  @Input() caseId?: number;
  @Output() needUpdate: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * A FieldContainer is a grouping construct, not a question — it must not draw
   * an accent bar around the whole group, and must not set the custom property
   * either (it would inherit into the nested fields).
   */
  isAccented(dataItem: DataItemDto): boolean {
    return dataItem.fieldType !== 'FieldContainer' && !!dataItem.color;
  }

  /**
   * A click anywhere in a CheckBox field (title, description, frame) toggles the
   * tick. Clicks inside element-checkbox are left to the box itself, so a click
   * on the box toggles once; links in the description keep working.
   */
  onFieldClick(event: MouseEvent, dataItem: DataItemDto) {
    if (dataItem.fieldType !== 'CheckBox' || !dataItem.fieldValues?.length) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target?.closest?.('element-checkbox, a')) {
      return;
    }
    toggleCheckboxValue(dataItem.fieldValues[0]);
  }

  emitNeedUpdate() {
    this.needUpdate.emit();
  }
}
