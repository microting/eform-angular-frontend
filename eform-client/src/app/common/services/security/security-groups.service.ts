import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {
  SecurityGroupModel,
  SecurityGroupsRequestModel,
  SecurityGroupsModel,
  SecurityGroupUpdateModel, SecurityGroupCreateModel
} from 'src/app/common/models/security';
import {BaseService} from 'src/app/common/services/base.service';

const SecurityGroupMethods = {
  SecurityGroups: '/api/security/groups'
};

@Injectable()
export class SecurityGroupsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSecurityGroups(model: SecurityGroupsRequestModel): Observable<OperationDataResult<SecurityGroupsModel>> {
    return this.get<any>(SecurityGroupMethods.SecurityGroups, model);
  }

  getSecurityGroup(id: number): Observable<OperationDataResult<SecurityGroupModel>> {
    return this.get<any>(SecurityGroupMethods.SecurityGroups + '/' + id);
  }

  createSecurityGroup(model: SecurityGroupCreateModel): Observable<OperationResult> {
    return this.post(SecurityGroupMethods.SecurityGroups, model);
  }

  updateSecurityGroup(model: SecurityGroupUpdateModel): Observable<OperationResult> {
    return this.put<any>(SecurityGroupMethods.SecurityGroups, model);
  }

  deleteSecurityGroup(id: number): Observable<OperationResult> {
    return this.delete(SecurityGroupMethods.SecurityGroups + '/' + id);
  }
}
