import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceUserService} from 'src/app/common/services';
import {DeviceUsersStateService} from '../store';
import {AuthStateService} from 'src/app/common/store';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {
  EditCreateUserModalComponent,
  NewOtpModalComponent
} from '../';
import {Subscription, zip} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TranslateService} from '@ngx-translate/core';
import {DeleteModalSettingModel, SiteDto} from 'src/app/common/models';
import {DeleteModalComponent} from 'src/app/common/modules/eform-shared/components';
import {Store} from "@ngrx/store";
import {selectCurrentUserClaimsDeviceUsersCreate} from 'src/app/state/auth/auth.selector';

@AutoUnsubscribe()
@Component({
  selector: 'app-device-users-page',
  templateUrl: './device-users-page.component.html',
})
export class DeviceUsersPageComponent implements OnInit, OnDestroy {
  sitesDto: Array<SiteDto>;

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Site ID'), field: 'siteUid'},
    {header: this.translateService.stream('First name'), field: 'firstName'},
    {
      header: this.translateService.stream('Last name'),
      field: 'lastName',
    },
    {
      header: this.translateService.stream('Device ID'),
      field: 'unitId',
    },
    {header: this.translateService.stream('Language'), field: 'language'},
    {header: this.translateService.stream('Customer no & OTP'), field: 'otpCode'},
  ];
  editCreateUserModalComponentAfterClosedSub$: Subscription;
  newOtpModalComponentAfterClosedSub$: Subscription;
  getCurrentUserClaimsAsyncSub$: Subscription;
  deviceUserDeletedSub$: Subscription;
  translatesSub$: Subscription;
  public selectCurrentUserClaimsDeviceUsersCreate$ = this.authStore.select(selectCurrentUserClaimsDeviceUsersCreate);
  public selectCurrentUserClaimsDeviceUsersUpdate$ = this.authStore.select(selectCurrentUserClaimsDeviceUsersCreate);
  public selectCurrentUserClaimsDeviceUsersDelete$ = this.authStore.select(selectCurrentUserClaimsDeviceUsersCreate);

  constructor(
    private authStore: Store,
    private deviceUsersService: DeviceUserService,
    public deviceUsersStateService: DeviceUsersStateService,
    public dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.getDeviceUsersFiltered();
    let actionsEnabled = false;
    this.selectCurrentUserClaimsDeviceUsersUpdate$.subscribe(x => {
      if(x) {
        actionsEnabled = true;
        this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
          {
            header: this.translateService.stream('Actions'),
            field: 'actions',
          },
        ];
      }
    });
    this.selectCurrentUserClaimsDeviceUsersDelete$.subscribe(x => {
      if(x && !actionsEnabled) {
        this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
          {
            header: this.translateService.stream('Actions'),
            field: 'actions',
          },
        ];
      }
    });
    // this.getCurrentUserClaimsAsyncSub$ = this.authStateService.currentUserClaimsAsync.subscribe(x => {
    //   if (x.deviceUsersDelete || x.deviceUsersUpdate) {
    //     this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
    //       {
    //         header: this.translateService.stream('Actions'),
    //         field: 'actions',
    //       },
    //     ];
    //   }
    // });
  }

  openEditModal(simpleSiteDto: SiteDto) {
    this.editCreateUserModalComponentAfterClosedSub$ = this.dialog.open(EditCreateUserModalComponent,
      {
        ...dialogConfigHelper(this.overlay, {
          userFirstName: simpleSiteDto.firstName,
          userLastName: simpleSiteDto.lastName,
          id: simpleSiteDto.siteUid,
          languageCode: simpleSiteDto.languageCode
        }), minWidth: 500
      })
      .afterClosed().subscribe(data => data ? this.getDeviceUsersFiltered() : undefined);
  }

  openCreateModal() {
    this.editCreateUserModalComponentAfterClosedSub$ = this.dialog.open(EditCreateUserModalComponent,
      {...dialogConfigHelper(this.overlay), minWidth: 500})
      .afterClosed().subscribe(data => data ? this.getDeviceUsersFiltered() : undefined);
  }

  getDeviceUsersFiltered() {
    this.deviceUsersStateService.getDeviceUsersFiltered().subscribe((data) => {
      if (data && data.model) {
        this.sitesDto = data.model;
      }
    });
  }

  openOtpModal(siteDto: SiteDto) {
    if (!siteDto.unitId) {
      return;
    }

    this.newOtpModalComponentAfterClosedSub$ = this.dialog.open(NewOtpModalComponent,
      {...dialogConfigHelper(this.overlay, siteDto)})
      .afterClosed().subscribe(data => data ? this.getDeviceUsersFiltered() : undefined);
  }

  openDeleteDeviceUserModal(simpleSiteDto: SiteDto) {
    this.translatesSub$ = zip(
      this.translateService.stream('Are you sure you want to delete'),
      this.translateService.stream('First name'),
      this.translateService.stream('Last name'),
    ).subscribe(([headerText, firstName, lastName]) => {
      const settings: DeleteModalSettingModel = {
        model: simpleSiteDto,
        settings: {
          headerText: `${headerText}?`,
          fields: [
            {header: 'ID', field: 'siteId'},
            {header: firstName, field: 'firstName'},
            {header: lastName, field: 'lastName'},
          ],
          cancelButtonId: 'cancelDeleteBtn',
          deleteButtonId: 'saveDeleteBtn',
        }
      };
      const deviceUserDeleteModal =
        this.dialog.open(DeleteModalComponent, {...dialogConfigHelper(this.overlay, settings)});
      this.deviceUserDeletedSub$ = deviceUserDeleteModal.componentInstance.delete
        .subscribe((model: SiteDto) => {
          this.deviceUsersService.deleteSingleDeviceUser(model.siteUid)
            .subscribe(operation => {
              if (operation && operation.success) {
                deviceUserDeleteModal.close();
                this.getDeviceUsersFiltered();
              }
            });
        });
    });
  }

  onSearchChanged(name: string) {
    this.deviceUsersStateService.updateNameFilter(name);
    this.getDeviceUsersFiltered();
  }

  ngOnDestroy(): void {
  }

  // loadAllSimpleSites() {
  //   this.deviceUsersService.getAllDeviceUsers().subscribe((operation) => {
  //     if (operation && operation.success) {
  //       this.sitesDto = operation.model;
  //     }
  //   });
  // }
}
