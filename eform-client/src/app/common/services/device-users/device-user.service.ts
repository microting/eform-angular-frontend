import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult, DeviceUserModel} from 'src/app/common/models';
import {SiteDto} from 'src/app/common/models/dto';
import {BaseService} from '../base.service';

const DeviceUsersMethods = {
  GetAll: '/api/device-users/index',
  GetSingle: '/api/device-users/edit',
  UpdateSingle: '/api/device-users/update',
  DeleteSingle: '/api/device-users/delete',
  CreateSingle: '/api/device-users/create'
};

@Injectable()
export class DeviceUserService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllDeviceUsers(): Observable<OperationDataResult<Array<SiteDto>>> {
    return this.get<Array<SiteDto>>(DeviceUsersMethods.GetAll);
  }

  getSingleSimpleSite(id: number): Observable<OperationDataResult<SiteDto>> {
    return this.get<SiteDto>(DeviceUsersMethods.GetSingle + '/' + id);
  }

  updateSingleDeviceUser(model: DeviceUserModel): Observable<OperationResult> {
    return this.post<DeviceUserModel>(DeviceUsersMethods.UpdateSingle, model);
  }

  deleteSingleDeviceUser(id: number): Observable<OperationResult> {
    return this.delete(DeviceUsersMethods.DeleteSingle + '/' + id);
  }

  createSingleDeviceUser(model: DeviceUserModel): Observable<OperationResult> {
    return this.put<DeviceUserModel>(DeviceUsersMethods.CreateSingle, model);
  }
}

