import {Component, Input, OnInit} from '@angular/core';
import {ReportEformPnModel} from '../../../models/report';

@Component({
  selector: 'app-items-planning-pn-report-preview-table',
  templateUrl: './report-preview-table.component.html',
  styleUrls: ['./report-preview-table.component.scss']
})
export class ReportPreviewTableComponent implements OnInit {
  @Input() reportData: ReportEformPnModel = new ReportEformPnModel();
  constructor() { }

  ngOnInit() {
  }
}
