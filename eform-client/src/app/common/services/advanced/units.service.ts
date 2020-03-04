import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult, UnitDto, UnitModel} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const UnitsMethods = {
  GetAll: '/api/units/index',
  RequestOtp: '/api/units/requestotp',
  CreateUnit: '/api/units/create',
  MoveUnit: '/api/units/update'
};

@Injectable()
export class UnitsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllUnits(): Observable<OperationDataResult<Array<UnitDto>>> {
    return this.get<Array<UnitDto>>(UnitsMethods.GetAll);
  }

  createUnit(model: UnitModel): Observable<OperationResult> {
    return this.post<UnitModel>(UnitsMethods.CreateUnit, model);
  }

  moveUnit(model: UnitModel): Observable<OperationResult> {
    return this.put<UnitModel>(UnitsMethods.MoveUnit, model);
  }

  requestOtp(id: number): Observable<OperationDataResult<UnitDto>> {
    return this.get<UnitDto>(UnitsMethods.RequestOtp + '/' + id.toString());
  }
}
