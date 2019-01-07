import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {CaseEditRequest, ElementDto} from 'src/app/common/models';

@Component({
  selector: 'app-eform-report-block',
  templateUrl: './eform-report-block.component.html',
  styleUrls: ['./eform-report-block.component.scss']
})
export class EformReportBlockComponent implements OnInit {
  @ViewChildren(EformReportBlockComponent) editElements: QueryList<EformReportBlockComponent>;
  @Input() element: ElementDto = new ElementDto();
  @Output() onElementVisibilityChanged: EventEmitter<{id: number, visibility: boolean}> =
    new EventEmitter<{id: number, visibility: boolean}>();
  constructor() { }

  ngOnInit() {
  }

}
