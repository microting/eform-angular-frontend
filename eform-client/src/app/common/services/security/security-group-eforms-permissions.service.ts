import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const SecurityGroupGeneralPermissionsMethods = {
  SecurityGroupGeneralPermissions: '/api/security/group/general-permissions'
};

@Injectable()
export class SecurityGroupEformsPermissionsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getGroupEforms(groupId: number): Observable<OperationDataResult<any>> {
    return this.get<any>(SecurityGroupGeneralPermissionsMethods.SecurityGroupGeneralPermissions + '/' + groupId);
  }

  addEformToGroup(eformId: number): Observable<OperationResult> {
    return this.post<any>(SecurityGroupGeneralPermissionsMethods.SecurityGroupGeneralPermissions, eformId);
  }
}
