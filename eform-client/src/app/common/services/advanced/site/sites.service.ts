import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult,
  SiteNameDto,
  SiteNameModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const SitesMethods = {
  GetAll: '/api/sites/index',
  GetAllDictionary: '/api/sites/dictionary',
  GetAllSitesForPairing: '/api/sites/pairing',
  GetSingle: '/api/sites/edit',
  UpdateSingle: '/api/sites/update',
  DeleteSingle: '/api/sites/delete',
};

@Injectable()
export class SitesService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllSites(): Observable<OperationDataResult<Array<SiteNameDto>>> {
    return this.apiBaseService.get<Array<SiteNameDto>>(SitesMethods.GetAll);
  }

  getAllSitesDictionary(): Observable<
    OperationDataResult<Array<CommonDictionaryModel>>
  > {
    return this.apiBaseService.get<Array<CommonDictionaryModel>>(
      SitesMethods.GetAllDictionary
    );
  }

  getAllSitesForPairing(): Observable<OperationDataResult<Array<SiteNameDto>>> {
    return this.apiBaseService.get<Array<SiteNameDto>>(
      SitesMethods.GetAllSitesForPairing
    );
  }

  getSingleSite(id: number): Observable<OperationDataResult<SiteNameDto>> {
    return this.apiBaseService.get<SiteNameDto>(
      SitesMethods.GetSingle + '/' + id
    );
  }

  updateSingleSite(model: SiteNameModel): Observable<OperationResult> {
    return this.apiBaseService.post<SiteNameModel>(
      SitesMethods.UpdateSingle,
      model
    );
  }

  deleteSingleSite(id: number): Observable<OperationResult> {
    return this.apiBaseService.get(SitesMethods.DeleteSingle + '/' + id);
  }
}
