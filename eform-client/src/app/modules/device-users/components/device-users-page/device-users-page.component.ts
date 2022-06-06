import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { DeviceUserModel } from 'src/app/common/models/device-users';
import { SiteDto } from 'src/app/common/models/dto';
import { DeviceUserService } from 'src/app/common/services/device-users';
import { DeviceUsersStateService } from '../store';
import { AuthStateService } from 'src/app/common/store';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {DeleteDeviceUserModalComponent, EditCreateUserModalComponent} from 'src/app/modules/device-users/components';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-device-users-page',
  templateUrl: './device-users-page.component.html',
})
export class DeviceUsersPageComponent implements OnInit, OnDestroy {
  @ViewChild('newOtpModal', { static: true }) newOtpModal;

  selectedSimpleSiteDto: SiteDto = new SiteDto();
  selectedSimpleSite: DeviceUserModel = new DeviceUserModel();
  sitesDto: Array<SiteDto>;

  tableHeaders: MtxGridColumn[] = [
    {header: 'Site ID', field: 'siteUid'},
    {header: 'First name', field: 'firstName'},
    {
      header: 'Last name',
      field: 'lastName',
    },
    {
      header: 'Device ID',
      field: 'unitId',
    },
    {header: 'Language', field: 'language'},
    {header: 'Customer no & OTP', field: 'otpCode'},
    this.authStateService.currentUserClaims.deviceUsersDelete ||
    this.authStateService.currentUserClaims.deviceUsersDelete
      ? {header: 'Actions', field: 'actions'}
      : undefined,
  ];
  deleteDeviceUserModalComponentAfterClosedSub$: Subscription;
  editCreateUserModalComponentAfterClosedSub$: Subscription;

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private deviceUsersService: DeviceUserService,
    private authStateService: AuthStateService,
    public deviceUsersStateService: DeviceUsersStateService,
    public dialog: MatDialog,
    private overlay: Overlay
  ) {}

  ngOnInit() {
    this.getDeviceUsersFiltered();
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
    this.selectedSimpleSiteDto = siteDto;
    this.newOtpModal.show();
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
