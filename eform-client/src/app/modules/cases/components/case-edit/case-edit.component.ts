import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
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
  TemplateDto, ElementDto, DataItemDto,
} from 'src/app/common/models';
import {CaseEditConfirmationComponent, CaseEditElementComponent} from 'src/app/common/modules/eform-cases/components';
import {
  CasesService,
  EFormService,
  SecurityGroupEformsPermissionsService,
} from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {DateTimeAdapter} from '@danielmoncada/angular-datetime-picker';
import * as R from 'ramda';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {selectCurrentUserClaimsCaseUpdate, selectCurrentUserLocale} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@AutoUnsubscribe()
@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.scss'],
})
export class CaseEditComponent implements OnInit, OnDestroy {
  @ViewChildren(CaseEditElementComponent)
  editElements: QueryList<CaseEditElementComponent>;
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
  onConfirmationPressedSub$: Subscription;
  private selectCurrentUserLocale$ = this.authStore.select(selectCurrentUserLocale);
  public selectCaseUpdate$ = this.authStore.select(selectCurrentUserClaimsCaseUpdate);

  constructor(
    private authStore: Store,
    dateTimeAdapter: DateTimeAdapter<any>,
    activateRoute: ActivatedRoute,
    private casesService: CasesService,
    private eFormService: EFormService,
    private router: Router,
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    private authStateService: AuthStateService,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
    this.activatedRouteSub$ = activateRoute.params.subscribe((params) => {
      this.id = +params['id'];
      this.templateId = +params['templateId'];
    });
    this.queryParamsSun$ = activateRoute.queryParams.subscribe((params) => {
      this.reverseRoute = params['reverseRoute'];
    });
    this.selectCurrentUserLocale$.subscribe((locale) => {
      dateTimeAdapter.setLocale(locale);
    });
    // dateTimeAdapter.setLocale(authStateService.currentUserLocale);
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

  partialLoadCase() {
    if (!this.id || this.id === 0) {
      return;
    }
    this.casesService
      .getById(this.id, this.currentTemplate.id)
      .subscribe((operation) => {
        if (operation && operation.success) {
          const fn = (pathForLens: Array<number | string>) => {
            const lens = R.lensPath(pathForLens);
            let dataItem: (ElementDto | DataItemDto) = R.view(lens, operation.model);
            // @ts-ignore
            if (dataItem.elementList !== undefined || dataItem.dataItemList !== undefined) {
              dataItem = dataItem as ElementDto;
              // R.set(R.lensPath([...pathForLens, 'extraPictures']), dataItem.extraPictures, this.replyElement);
              if(dataItem.elementList) {
                for (let i = 0; i < dataItem.elementList.length; i++) {
                  fn([...pathForLens, 'elementList', i]);
                }
              }
              if(dataItem.dataItemList) {
                for (let i = 0; i < dataItem.dataItemList.length; i++) {
                  fn([...pathForLens, 'dataItemList', i]);
                }
              }
            } else { // @ts-ignore
              if(dataItem.fieldType !== undefined){
                dataItem = dataItem as DataItemDto;
                if (dataItem.fieldType === 'FieldContainer') {
                  for (let i = 0; i < dataItem.dataItemList.length; i++) {
                    fn([...pathForLens, 'dataItemList', i]);
                  }
                }
                if (dataItem.fieldType === 'Picture') {
                  // let oldDataItem = R.view(lens, this.replyElement);
                  // oldDataItem = {...oldDataItem, ...dataItem};
                  this.replyElement = R.set(lens, dataItem, this.replyElement);
                }
              }
            }
          }
          for (let i = 0; i < operation.model.elementList.length; i++){
            fn(['elementList', i]);
          }
        }
      });
  }

  saveCase(navigateToPosts?: boolean) {
    if(this.currentTemplate.isDoneAtEditable && !this.replyElement.doneAt){
      this.toastrService.error('Date is required.', 'Error');
      return;
    }
    this.requestModels = [];
    this.editElements.forEach((x) => {
      x.extractData();
      this.requestModels.push(x.requestModel);
    });
    this.replyRequest.id = this.replyElement.id;
    this.replyRequest.label = this.replyElement.label;
    this.replyRequest.elementList = this.requestModels;
    this.replyRequest.doneAt = this.replyElement.doneAt;
    this.replyRequest.isDoneAtEditable = this.currentTemplate.isDoneAtEditable;
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

  confirmExit(keepData: boolean, modalId: string): void {
    this.dialog.getDialogById(modalId).componentInstance.navigateAwaySelection$.next(true);
    if (keepData) {
      this.saveCase();
    } else {
      this.isNoSaveExitAllowed = true;
    }
  }

  // canDeactivate(): Observable<boolean> | boolean {
  //   if (
  //     !this.isNoSaveExitAllowed &&
  //     this.checkEformPermissions(UserClaimsEnum.caseUpdate)
  //   ) {
  //     const modalId = this.dialog.open(CaseEditConfirmationComponent,
  //       {...dialogConfigHelper(this.overlay), minWidth: 600}).id;
  //     this.onConfirmationPressedSub$ = this.dialog.getDialogById(modalId).componentInstance.onConfirmationPressed
  //       .subscribe(x => this.confirmExit(x, modalId));
  //     return this.dialog.getDialogById(modalId).componentInstance.navigateAwaySelection$;
  //   }
  //   return true;
  // }

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
}
