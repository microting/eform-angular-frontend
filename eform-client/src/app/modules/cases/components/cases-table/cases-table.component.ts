import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {EFormService} from 'app/services/eform/eform.service';
import {TemplateDto} from 'app/models/dto';
import {CaseModel} from 'app/models/cases';
import {CasesService} from 'app/services/cases/cases.service';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NotifyService} from 'app/services/notify.service';

@Component({
  selector: 'app-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.css']
})
export class CasesTableComponent implements OnInit {
  @ViewChild('deleteCaseModal')
  deleteCaseModal: ModalComponent;

  id: number;
  caseModels: Array<CaseModel> = [];
  currentTemplate: TemplateDto = new TemplateDto;
  selectedCase: CaseModel = new CaseModel;
  spinnerStatus: boolean;

  constructor(private activateRoute: ActivatedRoute,
              private router: Router,
              private casesService: CasesService,
              private eFormService: EFormService,
              private notifyService: NotifyService) {
    this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

  ngOnInit() {
    this.loadAllCases();
    this.loadTemplateData();
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

  loadTemplateData() {
    this.eFormService.getSingle(this.id).subscribe(operation => {
      this.spinnerStatus = true;
      if (operation && operation.success) {
        this.currentTemplate = operation.model;
      }
      this.spinnerStatus = false;
    });
  }

  submitCaseDelete(id: number) {
    this.casesService.deleteCase(id).subscribe((data => {
      if (data && data.success) {
        this.loadAllCases();
        this.notifyService.success({text: data.message || 'Error'});
      } else {
        this.notifyService.error({text: data.message || 'Error'});
      }
      this.deleteCaseModal.close();
    }));
  }

  showCaseDeleteModal(model: CaseModel) {
    this.selectedCase = model;
    this.deleteCaseModal.open();
  }
}
