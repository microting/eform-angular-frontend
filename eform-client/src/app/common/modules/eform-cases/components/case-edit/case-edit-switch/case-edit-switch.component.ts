import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataItemDto} from 'src/app/common/models';
import { NgIf, NgFor, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { ElementPictureComponent } from '../case-elements/element-picture/element-picture.component';
import { ElementCheckboxComponent } from '../case-elements/element-checkbox/element-checkbox.component';
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
    styleUrls: ['./case-edit-switch.component.scss'],
    imports: [NgIf, NgFor, MatCard, MatCardHeader, NgStyle, NgSwitch, NgSwitchCase, MatCardContent, ElementPictureComponent, ElementCheckboxComponent, ElementNumberComponent, ElementNumberStepperComponent, ElementCommentComponent, ElementTextComponent, ElementDateComponent, ElementSingleselectComponent, ElementMultiselectComponent, ElementPdfComponent, ElementInfoboxComponent, ElementTimerComponent, ElementSignatureComponent, ElementContainerComponent, ElementEntitysearchComponent, ElementEntityselectComponent, ElementAudioComponent, NgSwitchDefault]
})
export class CaseEditSwitchComponent implements OnInit {
  @Input() dataItemList: Array<DataItemDto> = [];
  @Output() needUpdate: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  emitNeedUpdate() {
    this.needUpdate.emit();
  }
}
