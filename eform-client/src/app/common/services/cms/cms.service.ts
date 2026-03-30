import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CmsMenuItemSaveModel,
  CmsMenuModel,
  CmsPageListModel,
  CmsPageModel,
  CmsPublicConfigModel,
  CmsPublicLandingModel,
  CmsSettingsModel,
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import {ApiBaseService} from 'src/app/common/services';

const CmsMethods = {
  PublicConfig: 'api/cms/public/config',
  PublicLanding: 'api/cms/public/landing',
  PublicPages: 'api/cms/public/pages',
  Settings: 'api/cms/settings',
  Pages: 'api/cms/pages',
  Menus: 'api/cms/menus',
};

@Injectable()
export class CmsService {
  private apiBaseService = inject(ApiBaseService);

  getPublicConfig(): Observable<OperationDataResult<CmsPublicConfigModel>> {
    return this.apiBaseService.get(CmsMethods.PublicConfig);
  }

  getPublicLanding(): Observable<OperationDataResult<CmsPublicLandingModel>> {
    return this.apiBaseService.get(CmsMethods.PublicLanding);
  }

  getPublicPage(slug: string): Observable<OperationDataResult<CmsPublicLandingModel>> {
    return this.apiBaseService.get(`${CmsMethods.PublicPages}/${slug}`);
  }

  getSettings(): Observable<OperationDataResult<CmsSettingsModel>> {
    return this.apiBaseService.get(CmsMethods.Settings);
  }

  updateSettings(model: CmsSettingsModel): Observable<OperationResult> {
    return this.apiBaseService.put(CmsMethods.Settings, model);
  }

  getAllPages(): Observable<OperationDataResult<CmsPageListModel[]>> {
    return this.apiBaseService.get(CmsMethods.Pages);
  }

  getPage(id: number): Observable<OperationDataResult<CmsPageModel>> {
    return this.apiBaseService.get(`${CmsMethods.Pages}/${id}`);
  }

  createPage(model: CmsPageModel): Observable<OperationResult> {
    return this.apiBaseService.post(CmsMethods.Pages, model);
  }

  updatePage(id: number, model: CmsPageModel): Observable<OperationResult> {
    return this.apiBaseService.put(`${CmsMethods.Pages}/${id}`, model);
  }

  deletePage(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(`${CmsMethods.Pages}/${id}`);
  }

  getAllMenus(): Observable<OperationDataResult<CmsMenuModel[]>> {
    return this.apiBaseService.get(CmsMethods.Menus);
  }

  getMenu(id: number): Observable<OperationDataResult<CmsMenuModel>> {
    return this.apiBaseService.get(`${CmsMethods.Menus}/${id}`);
  }

  createMenu(model: CmsMenuModel): Observable<OperationResult> {
    return this.apiBaseService.post(CmsMethods.Menus, model);
  }

  deleteMenu(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(`${CmsMethods.Menus}/${id}`);
  }

  saveMenuItems(menuId: number, items: CmsMenuItemSaveModel[]): Observable<OperationResult> {
    return this.apiBaseService.put(`${CmsMethods.Menus}/${menuId}/items`, items);
  }
}
