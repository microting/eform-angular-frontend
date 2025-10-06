import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
  UnitDto,
  UnitModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const UnitsMethods = {
  GetAll: '/api/units/index',
  RequestOtp: '/api/units/requestotp',
  CreateUnit: '/api/units/create',
  MoveUnit: '/api/units/update',
};

@Injectable()
export class UnitsService {
  private apiBaseService = inject(ApiBaseService);


  getAllUnits(): Observable<OperationDataResult<Array<UnitDto>>> {
    return this.apiBaseService.get<Array<UnitDto>>(UnitsMethods.GetAll);
  }

  createUnit(model: UnitModel): Observable<OperationResult> {
    return this.apiBaseService.post<UnitModel>(UnitsMethods.CreateUnit, model);
  }

  moveUnit(model: UnitModel): Observable<OperationResult> {
    return this.apiBaseService.put<UnitModel>(UnitsMethods.MoveUnit, model);
  }

  requestOtp(id: number): Observable<OperationDataResult<UnitDto>> {
    return this.apiBaseService.get<UnitDto>(
      UnitsMethods.RequestOtp + '/' + id.toString()
    );
  }
}
