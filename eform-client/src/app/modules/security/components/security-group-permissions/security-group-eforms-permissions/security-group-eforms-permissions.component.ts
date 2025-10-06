import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  EformPermissionsModel,
  EformsPermissionsModel,
  EformsPermissionsRequestModel,
  TemplateListModel,
  TemplateRequestModel
} from 'src/app/common/models';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {
  SecurityGroupEformsAddComponent,
  SecurityGroupEformsDeleteComponent,
  SecurityGroupEformsEditComponent
} from 'src/app/modules/security/components';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
    selector: 'app-security-group-eforms-permissions',
    templateUrl: './security-group-eforms-permissions.component.html',
    styleUrls: ['./security-group-eforms-permissions.component.scss'],
    standalone: false
})
export class SecurityGroupEformsPermissionsComponent implements OnInit, OnDestroy {
  private securityGroupEformsService = inject(SecurityGroupEformsPermissionsService);
  private route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'templateId', sortable: false},
    {
      header: this.translateService.stream('CreatedAt'),
      field: 'createdAt',
      sortable: false,
      type: 'date',
      typeParameter: {format: 'dd.MM.y HH:mm:ss'}
    },
    {
      header: this.translateService.stream('eForm Name'),
      field: 'label',
      sortable: false,
    },
    {
      header: this.translateService.stream('Actions'),
      field: 'actions',
      type: 'button',
      buttons: [
        {
          color: 'accent',
          type: 'icon',
          icon: 'lock_open',
          tooltip: this.translateService.stream('Eform Permissions'),
          click: (record) => this.openEformEditPermissionsModal(record),
        },
        {
          color: 'warn',
          type: 'icon',
          icon: 'delete',
          tooltip: this.translateService.stream('Delete eForm'),
          click: (record) => this.openEformDeleteFromGroupModal(record),
        },
      ]
    },
  ];
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel;
  templateListModel: TemplateListModel = new TemplateListModel();
  eformSecurityModel: EformsPermissionsModel = new EformsPermissionsModel();
  eformsSecurityRequestModel: EformsPermissionsRequestModel = new EformsPermissionsRequestModel();
  eformBindModalId: string;
  selectedGroupId: number;

  securityGroupEformsDeleteComponentAfterClosedSub$: Subscription;
  onEformBoundSub$: Subscription;
  onSearchInputChangedSub$: Subscription;
  securityGroupEformsAddComponentAfterClosedSub$: Subscription;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedGroupId = params['groupId'];
      if (this.selectedGroupId) {
        this.getAvailableEforms();
        this.getSecurityGroupEfroms();
      }
    });
  }

  getAvailableEforms() {
    this.securityGroupEformsService.getAvailableEformsForGroup(this.templateRequestModel, this.selectedGroupId)
      .subscribe((data) => {
        if (data && data.success) {
          this.templateListModel = data.model;
          if (this.eformBindModalId) {
            this.dialog.getDialogById(this.eformBindModalId).componentInstance.templateListModel = data.model;
          }
        }
      });
  }

  getAvailableEformsWithNameFilter(label: string) {
    this.templateRequestModel.nameFilter = label;
    this.getAvailableEforms();
  }

  getSecurityGroupEfroms() {
    this.eformsSecurityRequestModel = this.selectedGroupId;
    this.securityGroupEformsService.getGroupEforms(this.selectedGroupId).subscribe((data) => {
      if (data && data.success) {
        this.eformSecurityModel = data.model;
      }
    });
  }

  openEformBindModal() {
    this.eformBindModalId = this.dialog.open(SecurityGroupEformsAddComponent,
      {
        ...dialogConfigHelper(this.overlay, {
          templateListModel: this.templateListModel,
          selectedGroupId: this.selectedGroupId,
        }),
        minWidth: 500,
      }).id;
    this.onEformBoundSub$ = this.dialog.getDialogById(this.eformBindModalId).componentInstance.onEformBound
      .subscribe(_ => {
        this.getAvailableEforms();
        this.getSecurityGroupEfroms();
      });
    this.onSearchInputChangedSub$ = this.dialog.getDialogById(this.eformBindModalId).componentInstance.onSearchInputChanged
      .subscribe(x => this.getAvailableEformsWithNameFilter(x));
    this.securityGroupEformsAddComponentAfterClosedSub$ = this.dialog.getDialogById(this.eformBindModalId).afterClosed().subscribe(_ => {
      this.getAvailableEforms();
      this.getSecurityGroupEfroms();
      this.eformBindModalId = '';
    });
  }

  openEformEditPermissionsModal(model: EformPermissionsModel) {
    /*this.securityGroupEformsEditComponentAfterClosedSub$ = */
    this.dialog.open(SecurityGroupEformsEditComponent,
      dialogConfigHelper(this.overlay, model))
    /*.afterClosed().subscribe(data => {
      if(data) {}
    })*/;
  }

  openEformDeleteFromGroupModal(model: EformPermissionsModel) {
    this.securityGroupEformsDeleteComponentAfterClosedSub$ = this.dialog.open(SecurityGroupEformsDeleteComponent,
      dialogConfigHelper(this.overlay, {model, selectedGroupId: this.selectedGroupId}))
      .afterClosed().subscribe(data => {
        if (data) {
          this.getAvailableEforms();
          this.getSecurityGroupEfroms();
        }
      });
  }

  ngOnDestroy(): void {
  }
}
