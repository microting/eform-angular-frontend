import { Component, OnInit, ViewChild } from '@angular/core';
import { PageSettingsModel } from 'src/app/common/models';

@Component({
  selector: 'app-report-preview-table',
  templateUrl: './report-preview-table-container.component.html',
  styleUrls: ['./report-preview-table-container.component.scss'],
})
export class ReportPreviewTableContainerComponent implements OnInit {
  @ViewChild('reportGraphViewModal') reportGraphViewModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  selectedYear = new Date().getFullYear();
  years: number[] = [];
  viewNames = ['Fractions', 'Producers', 'Transporters'];
  selectedView: string;
  constructor() {}

  ngOnInit() {
    this.getAllYears();
  }

  getAllYears() {
    for (let i = 2019; i <= this.selectedYear; i++) {
      this.years.push(i);
    }
    return this.years;
  }

  onSelectedChanged(thisYear: number) {
    this.selectedYear = thisYear;
  }

  showGraphModal(model: any) {
    this.reportGraphViewModal.show(model, this.selectedYear, this.selectedView);
  }

  onSelectedViewChanged(selectedView: string) {
    this.selectedView = selectedView;
  }
}
