import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
  DeviceUserModel,
  DeviceUserRequestModel,
  CommonDictionaryModel,
  SiteDto,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const DeviceUsersMethods = {
  GetAll: '/api/device-users/index',
  GetSingle: '/api/device-users/read',
  UpdateSingle: '/api/device-users/update',
  DeleteSingle: '/api/device-users/delete',
  CreateSingle: '/api/device-users/create',
  CommonDictionary: '/api/device-users/common-dictionary',
};

@Injectable()
export class DeviceUserService {
  private apiBaseService = inject(ApiBaseService);


  getAllDeviceUsers(): Observable<OperationDataResult<Array<SiteDto>>> {
    return this.apiBaseService.get<Array<SiteDto>>(DeviceUsersMethods.GetAll);
  }

  getDeviceUsersFiltered(
    model: DeviceUserRequestModel
  ): Observable<OperationDataResult<Array<SiteDto>>> {
    return this.apiBaseService.post<Array<SiteDto>>(
      DeviceUsersMethods.GetAll,
      model
    );
  }

  getSingleSimpleSite(id: number): Observable<OperationDataResult<SiteDto>> {
    return this.apiBaseService.get<SiteDto>(
      `${DeviceUsersMethods.GetSingle}/${id}`
    );
  }

  updateSingleDeviceUser(model: DeviceUserModel): Observable<OperationResult> {
    return this.apiBaseService.post<DeviceUserModel>(
      DeviceUsersMethods.UpdateSingle,
      model
    );
  }

  deleteSingleDeviceUser(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      DeviceUsersMethods.DeleteSingle + '/' + id
    );
  }

  createSingleDeviceUser(
    model: DeviceUserModel
  ): Observable<OperationDataResult<number>> {
    return this.apiBaseService.put<DeviceUserModel>(
      DeviceUsersMethods.CreateSingle,
      model
    );
  }

  getCommonDictionarySites(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.apiBaseService.get(DeviceUsersMethods.CommonDictionary);
  }
}
