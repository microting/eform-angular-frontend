import { Injectable, inject } from '@angular/core';
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
  Sites: '/api/sites',
  GetAllDictionary: '/api/sites/dictionary',
  GetAllSitesForPairing: '/api/sites/pairing',
};

@Injectable()
export class SitesService {
  private apiBaseService = inject(ApiBaseService);


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

  getSingleSite(id: number): Observable<OperationDataResult<SiteNameModel>> {
    return this.apiBaseService.get<SiteNameModel>(SitesMethods.Sites, {
      id: id,
    });
  }

  updateSingleSite(model: SiteNameModel): Observable<OperationResult> {
    return this.apiBaseService.put<SiteNameModel>(SitesMethods.Sites, model);
  }

  deleteSingleSite(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(SitesMethods.Sites, { id: id });
  }
}
