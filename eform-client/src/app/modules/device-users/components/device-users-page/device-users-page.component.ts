import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DeviceUserModel} from 'src/app/common/models/device-users';
import {SiteDto} from 'src/app/common/models/dto';
import {UnitsService} from 'src/app/common/services/advanced';
import {AuthService} from 'src/app/common/services/auth';
import {DeviceUserService} from 'src/app/common/services/device-users';

@Component({
  selector: 'app-device-users-page',
  templateUrl: './device-users-page.component.html',
})
export class DeviceUsersPageComponent implements OnInit {
  @ViewChild('editDeviceUserModal', { static: true }) editDeviceUserModal;
  @ViewChild('newOtpModal', { static: true }) newOtpModal;
  @ViewChild('deleteDeviceUserModal', { static: true }) deleteDeviceUserModal;

  selectedSimpleSiteDto: SiteDto = new SiteDto;
  selectedSimpleSite: DeviceUserModel = new DeviceUserModel;
  spinnerStatus = true;
  sitesDto: Array<SiteDto>;

  get userClaims() { return this.authService.userClaims; }

  constructor(
    private deviceUsersService: DeviceUserService,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.loadAllSimpleSites();
  }

  openEditModal(simpleSiteDto: SiteDto) {
    this.selectedSimpleSite.userFirstName = simpleSiteDto.firstName;
    this.selectedSimpleSite.userLastName = simpleSiteDto.lastName;
    this.selectedSimpleSite.id = simpleSiteDto.siteId;
    this.editDeviceUserModal.show();
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

  loadAllSimpleSites() {
    this.spinnerStatus = true;
    this.deviceUsersService.getAllDeviceUsers().subscribe(operation => {
      if (operation && operation.success) {
        this.sitesDto = operation.model;
      }
      this.spinnerStatus = false;
    });
  }





}
