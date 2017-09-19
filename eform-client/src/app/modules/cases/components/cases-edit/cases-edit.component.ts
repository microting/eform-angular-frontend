import {CaseEditElementComponent} from '../case-edit-element/case-edit-element.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {CaseEditRequest, ReplyElement, ReplyRequest} from 'app/models';
import {CasesService, NotifyService} from 'app/services';
import {TemplateDto} from 'app/models/dto';
import {EFormService} from 'app/services';

@Component({
  selector: 'app-cases-edit',
  templateUrl: './cases-edit.component.html',
  styleUrls: ['./cases-edit.component.css']
})
export class CasesEditComponent implements OnInit {
  @ViewChildren(CaseEditElementComponent) editElements: QueryList<CaseEditElementComponent>;
  id: number;
  templateId: number;
  currentTemplate: TemplateDto = new TemplateDto;
  replyElement: ReplyElement = new ReplyElement();
  // REQUEST
  requestModels: Array<CaseEditRequest> = [];
  replyRequest: ReplyRequest = new ReplyRequest();

  constructor(private activateRoute: ActivatedRoute,
              private casesService: CasesService,
              private eFormService: EFormService,
              private notifyService: NotifyService, private router: Router) {
    this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.templateId = +params['templateId'];
    });
  }

  ngOnInit() {
    this.loadCase();
    this.loadTemplateInfo();
  }

  gem() {
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
        this.router.navigate(['/cases/', this.currentTemplate.id]).then();
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
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
}
