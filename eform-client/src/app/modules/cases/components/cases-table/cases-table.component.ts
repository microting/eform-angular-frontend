import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {CasesService} from '../../../../services/cases/cases.service';
import {CaseModel} from '../../../../models/cases/case.model';

@Component({
  selector: 'app-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.css']
})
export class CasesTableComponent implements OnInit {
  id: number;
  caseModels: Array<CaseModel> = [];
  spinnerStatus: boolean;

  constructor(private activateRoute: ActivatedRoute,
              private router: Router, private casesService: CasesService) {
    this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

  ngOnInit() {
    this.loadAllCases();
  }

  loadAllCases() {
    this.casesService.getCases(this.id).subscribe(operation => {
      this.spinnerStatus = true;
      if (operation && operation.success) {
        this.caseModels = operation.model;
      }
      this.spinnerStatus = false;
    });
  }

}
