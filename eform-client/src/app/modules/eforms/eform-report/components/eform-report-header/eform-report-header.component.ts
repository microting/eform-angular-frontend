import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {EformReportModel} from 'src/app/common/models/eforms/report';

@Component({
  selector: 'app-eform-report-header',
  templateUrl: './eform-report-header.component.html',
  styleUrls: ['./eform-report-header.component.scss']
})
export class EformReportHeaderComponent implements OnInit {
  @Input() reportModel: EformReportModel = new EformReportModel();
  @ViewChild(('reportCropperModal'), {static: false}) reportCropperModal;
  constructor() { }

  ngOnInit() {
  }

  showCropper() {
    this.reportCropperModal.show();
  }

  updateHeaderImage(e: string) {
    this.reportModel.headerImage = e;
  }
}
