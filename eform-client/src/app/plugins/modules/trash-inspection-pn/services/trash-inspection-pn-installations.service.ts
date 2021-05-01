import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import {
  InstallationPnCreateModel,
  InstallationPnModel,
  InstallationPnRequestModel,
  InstallationPnUpdateModel,
  InstallationsPnModel,
} from '../models';
import { ApiBaseService } from 'src/app/common/services';

export let TrashInspectionPnInstallationMethods = {
  Installations: 'api/trash-inspection-pn/installations',
};

@Injectable()
export class TrashInspectionPnInstallationsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllInstallations(
    model: InstallationPnRequestModel
  ): Observable<OperationDataResult<InstallationsPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnInstallationMethods.Installations,
      model
    );
  }

  getSingleInstallation(
    installationId: number
  ): Observable<OperationDataResult<InstallationPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnInstallationMethods.Installations + '/' + installationId
    );
  }

  updateInstallation(
    model: InstallationPnUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      TrashInspectionPnInstallationMethods.Installations,
      model
    );
  }

  createInstallation(
    model: InstallationPnCreateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionPnInstallationMethods.Installations,
      model
    );
  }

  deleteInstallation(installationId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      TrashInspectionPnInstallationMethods.Installations + '/' + installationId
    );
  }
}
