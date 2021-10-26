import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceUserModel } from 'src/app/common/models/device-users';
import { SiteDto } from 'src/app/common/models/dto';
import { DeviceUserService } from 'src/app/common/services/device-users';
import { DeviceUsersStateService } from '../store';
import { TableHeaderElementModel } from 'src/app/common/models';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-device-users-page',
  templateUrl: './device-users-page.component.html',
})
export class DeviceUsersPageComponent implements OnInit {
  @ViewChild('editDeviceUserModal', { static: true }) editDeviceUserModal;
  @ViewChild('newOtpModal', { static: true }) newOtpModal;
  @ViewChild('deleteDeviceUserModal', { static: true }) deleteDeviceUserModal;

  selectedSimpleSiteDto: SiteDto = new SiteDto();
  selectedSimpleSite: DeviceUserModel = new DeviceUserModel();
  sitesDto: Array<SiteDto>;

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Site ID', sortable: false, elementId: '' },
    { name: 'First name', sortable: false, elementId: '' },
    { name: 'Last name', sortable: false, elementId: '' },
    { name: 'Device ID', sortable: false, elementId: '' },
    { name: 'Language', sortable: false, elementId: '' },
    { name: 'Customer no & OTP', sortable: false, elementId: '' },
    this.authStateService.currentUserClaims.deviceUsersDelete ||
    this.authStateService.currentUserClaims.deviceUsersDelete
      ? { name: 'Actions', sortable: false, elementId: '' }
      : null,
  ];

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private deviceUsersService: DeviceUserService,
    private authStateService: AuthStateService,
    public deviceUsersStateService: DeviceUsersStateService
  ) {}

  ngOnInit() {
    this.getDeviceUsersFiltered();
  }

  openEditModal(simpleSiteDto: SiteDto) {
    this.selectedSimpleSite.userFirstName = simpleSiteDto.firstName;
    this.selectedSimpleSite.userLastName = simpleSiteDto.lastName;
    this.selectedSimpleSite.id = simpleSiteDto.siteUid;
    this.selectedSimpleSite.languageCode = simpleSiteDto.languageCode;
    this.editDeviceUserModal.show();
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
    this.selectedSimpleSiteDto = simpleSiteDto;
    this.deleteDeviceUserModal.show();
  }

  onSearchChanged(name: string) {
    this.deviceUsersStateService.updateNameFilter(name);
    this.getDeviceUsersFiltered();
  }

  // loadAllSimpleSites() {
  //   this.deviceUsersService.getAllDeviceUsers().subscribe((operation) => {
  //     if (operation && operation.success) {
  //       this.sitesDto = operation.model;
  //     }
  //   });
  // }
}
