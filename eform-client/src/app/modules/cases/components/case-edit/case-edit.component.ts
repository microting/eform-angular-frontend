import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {RouteConfigLoadEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {Observable} from 'rxjs';
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
export class CaseEditComponent implements OnInit, OnDestroy {
  @ViewChildren(CaseEditElementComponent) editElements: QueryList<CaseEditElementComponent>;
  @ViewChild('caseConfirmation') caseConfirmation;
  activatedRouteSub: Subscription;
  id: number;
  templateId: number;
  currentTemplate: TemplateDto = new TemplateDto;
  replyElement: ReplyElement = new ReplyElement();

  requestModels: Array<CaseEditRequest> = [];
  replyRequest: ReplyRequest = new ReplyRequest();

  isNoSaveExitAllowed = false;
  isSaveClicked = false;

  spinnerStatus = false;

  constructor(private activateRoute: ActivatedRoute,
              private casesService: CasesService,
              private eFormService: EFormService,
              private router: Router) {
    const activatedRouteSub = this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.templateId = +params['templateId'];
    });
  }

  ngOnInit() {
    this.loadCase();
    this.loadTemplateInfo();
  }

  ngOnDestroy() {

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
        this.isNoSaveExitAllowed = true;
        if (this.isSaveClicked) {
          this.router.navigate(['/cases/', this.currentTemplate.id]).then();
        }
      }
      this.spinnerStatus = false;
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

  confirmExit(keepData: boolean): void {
    this.caseConfirmation.navigateAwaySelection$.next(true);
    if (keepData) {
      this.saveCase();
    } else {
      this.isNoSaveExitAllowed = true;
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isNoSaveExitAllowed) {
      this.caseConfirmation.show();
      return this.caseConfirmation.navigateAwaySelection$;
    }
    return true;
  }
}
