import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  OperationDataResult,
  OperationResult, SecurityGroupGeneralPermissionsModel,
  SecurityGroupGeneralPermissionsUpdateModel
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const SecurityGroupGeneralPermissionsMethods = {
  SecurityGroupGeneralPermissions: '/api/security/permissions'
};

@Injectable()
export class SecurityGroupGeneralPermissionsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getGeneralPermissions(groupId: number): Observable<OperationDataResult<SecurityGroupGeneralPermissionsModel>> {
    return this.get(SecurityGroupGeneralPermissionsMethods.SecurityGroupGeneralPermissions + '/' + groupId);
  }

  updateGeneralPermissions(model: SecurityGroupGeneralPermissionsUpdateModel): Observable<OperationResult> {
    return this.put(SecurityGroupGeneralPermissionsMethods.SecurityGroupGeneralPermissions, model);
  }
}
