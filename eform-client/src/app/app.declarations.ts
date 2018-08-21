import {DatePipe, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {AuthGuard} from 'src/app/common/guards';
import {EventBrokerService} from 'src/app/common/helpers';
import {
  EntitySearchService,
  EntitySelectService,
  SitesService,
  UnitsService,
  WorkersService
} from 'src/app/common/services/advanced';
import {AppSettingsService} from 'src/app/common/services/app-settings';
import {AuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';
import {CasesService} from 'src/app/common/services/cases';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {EFormService, EFormTagService} from 'src/app/common/services/eform';
import {AdminService} from 'src/app/common/services/users';
// Guards

export let providers = [
  // Guards
  AuthGuard,
  // Libs services
  ToastrService,
  // Services
  AuthService,
  LocaleService,
  UserSettingsService,
  AppSettingsService,
  DeviceUserService,
  UnitsService,
  SitesService,
  WorkersService,
  AdminService,
  EntitySearchService,
  EntitySelectService,
  EFormService,
  EFormTagService,
  CasesService,
  // Helpers
  EventBrokerService,
  DatePipe,
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }
];
