import {Component, Input, OnInit} from '@angular/core';
import {OuterInnerResourcePnReportRelationshipEnum} from '../../../enums';
import {ReportPnFullModel} from '../../../models/report';

@Component({
  selector: 'app-machine-area-pn-report-preview-table',
  templateUrl: './report-preview-table.component.html',
  styleUrls: ['./report-preview-table.component.scss']
})
export class ReportPreviewTableComponent implements OnInit {
  @Input() reportData: ReportPnFullModel = new ReportPnFullModel();
  get relationshipType() { return OuterInnerResourcePnReportRelationshipEnum; }
  constructor() { }

  ngOnInit() {
  }

}
