import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  SecurityGroupModel,
  SecurityGroupSettingsUpdateModel,
  Paged, PaginationModel,
} from 'src/app/common/models';
import {SecurityGroupsService} from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {SecurityStateService} from '../store';
import {Sort} from '@angular/material/sort';
import { MtxGridColumn, MtxGrid } from '@ng-matero/extensions/grid';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {SecurityGroupRemoveComponent, SecurityGroupSettingsComponent} from '../';
import {Store} from "@ngrx/store";
import {
  selectSecurityIsSortDsc,
  selectSecurityNameFilter, selectSecurityPagination,
  selectSecuritySort
} from "src/app/state/security/security.selector";
import { EformNewSubheaderComponent } from '../../../../common/modules/eform-shared/components/eform-new-subheader/eform-new-subheader.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { EformPaginationComponent } from '../../../../common/modules/eform-shared/components/eform-pagination/eform-pagination.component';
import { AsyncPipe } from '@angular/common';

@AutoUnsubscribe()
@Component({
    selector: 'app-security-page',
    templateUrl: './security-page.component.html',
    styleUrls: ['./security-page.component.scss'],
    imports: [EformNewSubheaderComponent, RouterLink, MatTooltip, MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, MtxGrid, MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, EformPaginationComponent, AsyncPipe, TranslatePipe]
})
export class SecurityPageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private securityGroupsService = inject(SecurityGroupsService);
  securityStateService = inject(SecurityStateService);
  private translateService = inject(TranslateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('GroupName'), sortProp: {id: 'GroupName'}, field: 'groupName', sortable: true},
    {
      header: this.translateService.stream('UserAmount'),
      field: 'userAmount',
      sortable: true,
      sortProp: {id: 'UserAmount'}
    },
    {
      pinned: 'right',
      header: this.translateService.stream('Actions'),
      field: 'actions',
    },
  ];
  securityGroups: Paged<SecurityGroupModel> = new Paged<SecurityGroupModel>();

  getSecurityGroups$: Subscription;
  updateSecurityGroupSettings$: Subscription;
  onSecurityGroupRemovedSub$: Subscription;
  settingsUpdateSub$: Subscription;
  public selectSecurityNameFilter$ = this.store.select(selectSecurityNameFilter);
  public selectSecuritySort$ = this.store.select(selectSecuritySort);
  public selectSecurityIsSortDsc$ = this.store.select(selectSecurityIsSortDsc);
  public selectSecurityPagination$ = this.store.select(selectSecurityPagination);

  ngOnInit() {
    this.getSecurityGroups();
  }

  getSecurityGroups() {
    this.getSecurityGroups$ = this.securityStateService
      .getAllSecurityGroups()
      .subscribe((data) => {
        if (data && data.success) {
          this.securityGroups = data.model;
        }
      });
  }

  openDeleteModal(securityGroup: SecurityGroupModel) {
    const modalId = this.dialog.open(SecurityGroupRemoveComponent,
      {...dialogConfigHelper(this.overlay, securityGroup), maxWidth: 500, minWidth: 500}).id;
    this.onSecurityGroupRemovedSub$ = this.dialog.getDialogById(modalId).componentInstance.onSecurityGroupRemoved
      .subscribe(x => this.onDeleteSecurityGroup(x, modalId));
  }

  openSettingsModal(securityGroup: SecurityGroupModel) {

    const modalId = this.dialog.open(SecurityGroupSettingsComponent,
      {...dialogConfigHelper(this.overlay, securityGroup)}).id;
    this.settingsUpdateSub$ = this.dialog.getDialogById(modalId).componentInstance.settingsUpdate
      .subscribe(x => this.updateSecurityGroupSettings(x, modalId));
  }

  updateSecurityGroupSettings(
    settingsUpdateModel: SecurityGroupSettingsUpdateModel,
    modalId: string,
  ) {
    this.updateSecurityGroupSettings$ = this.securityGroupsService
      .updateSecurityGroupSettings(settingsUpdateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.getSecurityGroups();
          this.dialog.getDialogById(modalId).close();
        }
      });
  }

  onDeleteSecurityGroup(id: number, modalId: string) {
    this.securityGroupsService.deleteSecurityGroup(id).subscribe((data) => {
      if (data && data.success) {
        this.dialog.getDialogById(modalId).close();
        this.securityStateService.onDelete();
        this.getSecurityGroups();
      }
    });
  }

  onLabelInputChanged(label: string) {
    this.securityStateService.updateNameFilter(label);
    this.getSecurityGroups();
  }

  onSortTable(sort: Sort) {
    this.securityStateService.onSortTable(sort.active);
    this.getSecurityGroups();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.securityStateService.updatePagination(paginationModel);
    this.getSecurityGroups();
  }

  ngOnDestroy(): void {
  }
}
