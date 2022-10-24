import {Component, OnDestroy, OnInit} from '@angular/core';
import { SiteDto } from 'src/app/common/models/dto';
import { DeviceUserService } from 'src/app/common/services/device-users';
import { DeviceUsersStateService } from '../store';
import { AuthStateService } from 'src/app/common/store';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {DeleteDeviceUserModalComponent, EditCreateUserModalComponent, NewOtpModalComponent} from 'src/app/modules/device-users/components';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import { TranslateService } from '@ngx-translate/core';

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
  deleteDeviceUserModalComponentAfterClosedSub$: Subscription;
  editCreateUserModalComponentAfterClosedSub$: Subscription;
  newOtpModalComponentAfterClosedSub$: Subscription;
  getCurrentUserClaimsAsyncSub$: Subscription;

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private deviceUsersService: DeviceUserService,
    private authStateService: AuthStateService,
    public deviceUsersStateService: DeviceUsersStateService,
    public dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.getDeviceUsersFiltered();
    this.getCurrentUserClaimsAsyncSub$ = this.authStateService.currentUserClaimsAsync.subscribe(x => {
      if(x.deviceUsersDelete || x.deviceUsersUpdate) {
        this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
          {
            header: this.translateService.stream('Actions'),
            field: 'actions',
          },
        ];
      }
    })
  }

  openEditModal(simpleSiteDto: SiteDto) {
    this.editCreateUserModalComponentAfterClosedSub$ = this.dialog.open(EditCreateUserModalComponent,
      {...dialogConfigHelper(this.overlay, {
        userFirstName: simpleSiteDto.firstName,
        userLastName: simpleSiteDto.lastName,
        id: simpleSiteDto.siteUid,
        languageCode: simpleSiteDto.languageCode}), minWidth: 500})
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
    this.deleteDeviceUserModalComponentAfterClosedSub$ = this.dialog.open(DeleteDeviceUserModalComponent,
      dialogConfigHelper(this.overlay, simpleSiteDto))
      .afterClosed().subscribe(data => data ? this.getDeviceUsersFiltered() : undefined);
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
