import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EformFullReportModel,
  EformReportElement,
} from 'src/app/common/models/eforms/report';
import { CasesService } from 'src/app/common/services/cases';
import { EformReportService } from 'src/app/common/services/eform';

@Component({
  selector: 'app-eform-report-page',
  templateUrl: './eform-report-page.component.html',
  styleUrls: ['./eform-report-page.component.scss'],
})
export class EformReportPageComponent implements OnInit {
  selectedEformId: number;
  fullReportModel: EformFullReportModel = new EformFullReportModel();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private casesService: CasesService,
    private eformReportService: EformReportService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.selectedEformId = +params['eformId'];
      this.getReport();
    });
  }

  getReport() {
    this.eformReportService
      .getSingle(this.selectedEformId)
      .subscribe((data) => {
        if (data && data.success) {
          this.fullReportModel = data.model;
        }
      });
  }

  updateReport() {
    this.eformReportService
      .updateSingle(this.fullReportModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigate(['/']).then();
        }
      });
  }

  onElementChanged(e: EformReportElement) {
    const foundElementIndex = this.fullReportModel.eformMainElement.elementList.findIndex(
      (x) => x.elementId === e.elementId
    );
    this.fullReportModel.eformMainElement.elementList[foundElementIndex] = e;
  }
}
