import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {TemplateDto, CaseModel, CasesRequestModel, CaseListModel} from 'app/models';
import {CasesService, NotifyService, EFormService} from 'app/services';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'app-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.css']
})
export class CasesTableComponent implements OnInit {
  @ViewChild('deleteCaseModal')
  deleteCaseModal: ModalComponent;

  id: number;
  caseListModel: CaseListModel = new CaseListModel();
  currentTemplate: TemplateDto = new TemplateDto;
  casesRequestModel: CasesRequestModel = new CasesRequestModel();
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
    this.casesService.getCases(this.casesRequestModel).subscribe(operation => {
      this.spinnerStatus = true;
      if (operation && operation.success) {
        this.caseListModel = operation.model;
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

  changePage(e: any) {
    if (e || e === 0) {
      this.casesRequestModel.offset = e;
      if (e === 0) {
        this.casesRequestModel.pageIndex = 0;
      } else {
        this.casesRequestModel.pageIndex = Math.floor(e / this.casesRequestModel.pageSize);
      }
      this.loadAllCases();
    }
  }

  sortByColumn(columnName: string, sortedByDsc: boolean) {
    this.casesRequestModel.sort = columnName;
    this.casesRequestModel.isSortDsc = sortedByDsc;
    this.loadAllCases();
  }

  onLabelInputChanged(label: string) {
    this.casesRequestModel.nameFilter = label;
    this.loadAllCases();
  }

  showCaseDeleteModal(model: CaseModel) {
    this.selectedCase = model;
    this.deleteCaseModal.open();
  }
}
