import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CasesService} from 'src/app/common/services/cases';
import {EFormService} from 'src/app/common/services/eform';
import {CaseEditElementComponent} from '../../../../../../modules/cases/components';
import {TemplateDto} from '../../../../../../common/models/dto';
import {CaseEditRequest, ReplyElementDto, ReplyRequest} from '../../../../../../common/models/cases';
import {AuthService} from '../../../../../../common/services/auth';

@Component({
  selector: 'app-installation-case-page',
  templateUrl: './planning-case-page.component.html',
  styleUrls: ['./planning-case-page.component.scss']
})
export class PlanningCasePageComponent implements OnInit {
  @ViewChildren(CaseEditElementComponent) editElements: QueryList<CaseEditElementComponent>;
  @ViewChild('caseConfirmation', {static: false}) caseConfirmation;
  id: number;
  planningId: number;
  eFormId: number;
  dateFrom: string;
  dateTo: string;
  currenteForm: TemplateDto = new TemplateDto;
  replyElement: ReplyElementDto = new ReplyElementDto();
  reverseRoute: string;
  requestModels: Array<CaseEditRequest> = [];
  replyRequest: ReplyRequest = new ReplyRequest();

  get userClaims() {
    return this.authService.userClaims;
  }

  constructor(private activateRoute: ActivatedRoute,
              private casesService: CasesService,
              private eFormService: EFormService,
              private router: Router,
              private authService: AuthService) {
    this.activateRoute.params.subscribe(params => {
      this.id = +params['sdkCaseId'];
      this.planningId = +params['planningId'];
      this.eFormId = +params['templateId'];
      this.dateFrom = params['dateFrom'];
      this.dateTo = params['dateTo'];
    });
  }

  ngOnInit() {
    this.loadTemplateInfo();
  }

  loadCase() {
    if (!this.id || this.id === 0) {
      return;
    }
    this.casesService.getById(this.id, this.currenteForm.id).subscribe(operation => {
      if (operation && operation.success) {
        this.replyElement = operation.model;
      }
    });
  }

  loadTemplateInfo() {
    if (this.eFormId) {
      this.eFormService.getSingle(this.eFormId).subscribe(operation => {
        if (operation && operation.success) {
          this.currenteForm = operation.model;
          this.loadCase();
        }
      });
    }
  }

  saveCase(navigateToPosts?: boolean) {
    this.requestModels = [];
    this.editElements.forEach(x => {
      x.extractData();
      this.requestModels.push(x.requestModel);
    });
    this.replyRequest.id = this.replyElement.id;
    this.replyRequest.label = this.replyElement.label;
    this.replyRequest.elementList = this.requestModels;
    this.casesService.updateCase(this.replyRequest, this.currenteForm.id).subscribe(operation => {
      if (operation && operation.success) {
        this.replyElement = new ReplyElementDto();
        this.router.navigate(['/plugins/items-planning-pn/reports/' + this.dateFrom + '/' + this.dateTo]).then();
      }
    });
  }


  goToSection(location: string): void {
    window.location.hash = location;
    setTimeout(() => {
      document.querySelector(location).parentElement.scrollIntoView();
    });
  }
}
