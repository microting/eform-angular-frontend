import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserClaimsEnum } from 'src/app/common/const';
import {
  CaseEditRequest,
  ReplyElementDto,
  EformPermissionsSimpleModel,
  ReplyRequest,
  TemplateDto,
} from 'src/app/common/models';
import { CaseEditElementComponent } from 'src/app/common/modules/eform-cases/components';
import {
  AuthService,
  CasesService,
  EFormService,
  SecurityGroupEformsPermissionsService,
} from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.scss'],
})
export class CaseEditComponent implements OnInit, OnDestroy {
  @ViewChildren(CaseEditElementComponent)
  editElements: QueryList<CaseEditElementComponent>;
  @ViewChild('caseConfirmation', { static: true }) caseConfirmation;
  id: number;
  templateId: number;
  currentTemplate: TemplateDto = new TemplateDto();
  replyElement: ReplyElementDto = new ReplyElementDto();

  requestModels: Array<CaseEditRequest> = [];
  replyRequest: ReplyRequest = new ReplyRequest();
  eformPermissionsSimpleModel: EformPermissionsSimpleModel = new EformPermissionsSimpleModel();

  isNoSaveExitAllowed = false;
  isSaveClicked = false;
  reverseRoute: string;

  activatedRouteSub$: Subscription;
  queryParamsSun$: Subscription;
  getSingleEformSun$: Subscription;

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  get userClaimsEnum() {
    return UserClaimsEnum;
  }

  constructor(
    activateRoute: ActivatedRoute,
    private casesService: CasesService,
    private eFormService: EFormService,
    private router: Router,
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    private authStateService: AuthStateService
  ) {
    this.activatedRouteSub$ = activateRoute.params.subscribe((params) => {
      this.id = +params['id'];
      this.templateId = +params['templateId'];
    });
    this.queryParamsSun$ = activateRoute.queryParams.subscribe((params) => {
      this.reverseRoute = params['reverseRoute'];
    });
  }

  ngOnInit() {
    this.loadTemplateInfo();
  }

  ngOnDestroy() {}

  loadCase() {
    if (!this.id || this.id === 0) {
      return;
    }
    this.casesService
      .getById(this.id, this.currentTemplate.id)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.replyElement = operation.model;
        }
      });
  }

  saveCase(navigateToPosts?: boolean) {
    this.requestModels = [];
    this.editElements.forEach((x) => {
      x.extractData();
      this.requestModels.push(x.requestModel);
    });
    this.replyRequest.id = this.replyElement.id;
    this.replyRequest.label = this.replyElement.label;
    this.replyRequest.elementList = this.requestModels;
    this.casesService
      .updateCase(this.replyRequest, this.currentTemplate.id)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.replyElement = new ReplyElementDto();
          this.isNoSaveExitAllowed = true;
          if (this.reverseRoute) {
            this.navigateToReverse();
          } else if (navigateToPosts) {
            this.router
              .navigate([
                '/cases/posts/',
                this.id,
                this.currentTemplate.id,
                'new',
              ])
              .then();
          } else if (this.isSaveClicked) {
            this.navigateToReverse();
          }
        }
      });
  }

  loadTemplateInfo() {
    if (this.templateId) {
      this.getSingleEformSun$ = this.eFormService
        .getSingle(this.templateId)
        .subscribe((operation) => {
          if (operation && operation.success) {
            this.currentTemplate = operation.model;
            this.loadEformPermissions(this.currentTemplate.id);
            this.loadCase();
          }
          // // This is commented as loadCase is in 99% of the time the slowest
        });
    }
  }

  goToSection(location: string): void {
    window.location.hash = location;
    setTimeout(() => {
      document.querySelector(location).parentElement.scrollIntoView();
      return true;
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
    if (
      !this.isNoSaveExitAllowed &&
      this.checkEformPermissions(UserClaimsEnum.caseUpdate)
    ) {
      this.caseConfirmation.show();
      return this.caseConfirmation.navigateAwaySelection$;
    }
    return true;
  }

  navigateToReverse() {
    if (this.reverseRoute) {
      this.router.navigate([this.reverseRoute]).then();
    } else {
      this.router.navigate(['/cases/', this.currentTemplate.id]).then();
    }
  }

  loadEformPermissions(templateId: number) {
    if (this.securityGroupEformsService.mappedPermissions.length) {
      this.eformPermissionsSimpleModel = this.securityGroupEformsService.mappedPermissions.find(
        (x) => x.templateId === templateId
      );
    } else {
      this.securityGroupEformsService
        .getEformsSimplePermissions()
        .subscribe((data) => {
          if (data && data.success) {
            const foundTemplates = this.securityGroupEformsService.mapEformsSimplePermissions(
              data.model
            );
            if (foundTemplates.length) {
              this.eformPermissionsSimpleModel = foundTemplates.find(
                (x) => x.templateId === templateId
              );
            }
            // // This is commented as loadCase is in 99% of the time the slowest
          }
        });
    }
  }

  checkEformPermissions(permissionIndex: number) {
    if (this.eformPermissionsSimpleModel.templateId) {
      return this.eformPermissionsSimpleModel.permissionsSimpleList.find(
        (x) => x === UserClaimsEnum[permissionIndex].toString()
      );
    } else {
      return this.userClaims[UserClaimsEnum[permissionIndex].toString()];
    }
  }
}
