import { PagedEntityRequest, PageSettingsModel } from 'src/app/common/models';

export const updateTableSorting = (
  sort: string,
  currentPageSettings: PageSettingsModel
): PageSettingsModel => {
  let updatedPageSettings;
  if (currentPageSettings.sort === sort) {
    updatedPageSettings = {
      ...currentPageSettings,
      isSortDsc: !currentPageSettings.isSortDsc,
    };
  } else {
    updatedPageSettings = { ...currentPageSettings, isSortDsc: false };
    updatedPageSettings = { ...currentPageSettings, sort };
  }
  return updatedPageSettings;
};

export const updateTablePage = (
  offset: number | null,
  requestModel: PagedEntityRequest
): PagedEntityRequest | null => {
  if (offset || offset === 0) {
    let updatedRequestModel = { ...requestModel, offset };
    if (offset === 0) {
      updatedRequestModel = { ...updatedRequestModel, pageIndex: 0 };
    } else {
      updatedRequestModel = {
        ...updatedRequestModel,
        pageIndex: Math.floor(offset / requestModel.pageSize),
      };
    }
    return updatedRequestModel;
  } else {
    return null;
  }
};

export const updateTableSort = (
  sort: string,
  currentSort: string,
  currentIsSortDsc: boolean
): { sort: string; isSortDsc: boolean } => {
  let updatedPageSettings: { sort: string; isSortDsc: boolean };
  if (currentSort === sort) {
    updatedPageSettings = {
      sort: currentSort,
      isSortDsc: !currentIsSortDsc,
    };
  } else {
    updatedPageSettings = { isSortDsc: false, sort: sort };
  }
  return updatedPageSettings;
};
