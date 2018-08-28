import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CaseEditRequest, ReplyElement, ReplyRequest} from 'src/app/common/models/cases';
import {TemplateDto} from 'src/app/common/models/dto';
import {CasesService} from 'src/app/common/services/cases';
import {EFormService} from 'src/app/common/services/eform';
import {CaseEditElementComponent} from '../case-edit-element/case-edit-element.component';

@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.scss']
})
export class CaseEditComponent implements OnInit {
  @ViewChildren(CaseEditElementComponent) editElements: QueryList<CaseEditElementComponent>;
  id: number;
  templateId: number;
  currentTemplate: TemplateDto = new TemplateDto;
  replyElement: ReplyElement = new ReplyElement();

  requestModels: Array<CaseEditRequest> = [];
  replyRequest: ReplyRequest = new ReplyRequest();

  spinnerStatus = false;

  constructor(private activateRoute: ActivatedRoute,
              private casesService: CasesService,
              private eFormService: EFormService,
              private router: Router) {
    this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.templateId = +params['templateId'];
    });
  }

  ngOnInit() {
    this.loadCase();
    this.loadTemplateInfo();
  }

  loadCase() {
    if (!this.id || this.id == 0) {
      return;
    }
    this.casesService.getById(this.id).subscribe(operation => {
      if (operation && operation.success) {
        this.replyElement = operation.model;
      }
    });
  }

  saveCase() {
    this.spinnerStatus = true;
    this.requestModels = [];
    this.editElements.forEach(x => {
      x.extractData();
      this.requestModels.push(x.requestModel);
    });
    this.replyRequest.id = this.replyElement.id;
    this.replyRequest.label = this.replyElement.label;
    this.replyRequest.elementList = this.requestModels;
    this.casesService.updateCase(this.replyRequest).subscribe(operation => {
      if (operation && operation.success) {
        this.replyElement = new ReplyElement();
        this.spinnerStatus = false;
        this.router.navigate(['/cases/', this.currentTemplate.id]).then();
      } this.spinnerStatus = false;
    });
  }

  loadTemplateInfo() {
    if (this.templateId) {
      this.eFormService.getSingle(this.templateId).subscribe(operation => {
        if (operation && operation.success) {
          this.currentTemplate = operation.model;
        }
      });
    }
  }

  goToSection(location: string): void {
    window.location.hash = location;
    setTimeout(() => {
      document.querySelector(location).parentElement.scrollIntoView();
    });
  }

}
