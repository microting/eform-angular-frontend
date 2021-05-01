import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from '../../../../common/models';
import { TrashInspectionBaseSettingsModel } from '../models';
import { ApiBaseService } from 'src/app/common/services';

export let TrashInspectionSettingsMethods = {
  TrashInspectionSettings: 'api/trash-inspection-pn/settings',
  TrashInspectionToken: 'api/trash-inspection-pn/token',
};
@Injectable()
export class TrashInspectionPnSettingsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllSettings(): Observable<
    OperationDataResult<TrashInspectionBaseSettingsModel>
  > {
    return this.apiBaseService.get(
      TrashInspectionSettingsMethods.TrashInspectionSettings
    );
  }
  updateSettings(
    model: TrashInspectionBaseSettingsModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionSettingsMethods.TrashInspectionSettings,
      model
    );
  }

  getToken(): Observable<OperationDataResult<string>> {
    return this.apiBaseService.get(
      TrashInspectionSettingsMethods.TrashInspectionToken
    );
  }
}
