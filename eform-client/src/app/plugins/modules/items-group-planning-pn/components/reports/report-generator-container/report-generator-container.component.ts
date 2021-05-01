import {Component, OnInit} from '@angular/core';
import {saveAs} from 'file-saver';
import {ToastrService} from 'ngx-toastr';
import {ReportPnFullModel, ReportPnGenerateModel} from '../../../models/report';
import {ItemsGroupPlanningPnReportsService} from '../../../services';

@Component({
  selector: 'app-items-group-planning-pn-report-generator',
  templateUrl: './report-generator-container.component.html',
  styleUrls: ['./report-generator-container.component.scss']
})
export class ReportGeneratorContainerComponent implements OnInit {
  reportModel: ReportPnFullModel = new ReportPnFullModel();

  constructor(private reportService: ItemsGroupPlanningPnReportsService, private toastrService: ToastrService) {
  }

  ngOnInit() {
  }

  onGenerateReport(model: ReportPnGenerateModel) {
    this.reportService.generateReport(model).subscribe((data) => {
      if (data && data.success) {
        this.reportModel = data.model;
      }

    });
  }

  onSaveReport(model: ReportPnGenerateModel) {
    this.reportService.getGeneratedReport(model).subscribe(((data) => {
      saveAs(data, model.dateFrom + '_' + model.dateTo + '_report.xlsx');

    }), error => {
      this.toastrService.error();

    });
  }
}
