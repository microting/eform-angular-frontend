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

/**
 * Updates the page information for a table based on a given offset.
 *
 * @param {number | null} offset - The offset to be used for the update. If null, the function will return null.
 * @param {PagedEntityRequest} requestModel - The current page request model that needs to be updated.
 *
 * @returns {PagedEntityRequest | null} - Returns an updated request model if the offset is provided, otherwise returns null.
 *
 * @example
 * // returns { offset: 10, pageIndex: 1, pageSize: 10 }
 * updateTablePage(10, { offset: 0, pageIndex: 0, pageSize: 10 });
 *
 * @example
 * // returns null
 * updateTablePage(null, { offset: 0, pageIndex: 0, pageSize: 10 });
 */
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

/**
 * Updates the sorting settings for a table.
 *
 * @param {string} sort - The new column to sort by.
 * @param {string} currentSort - The current column that the table is sorted by.
 * @param {boolean} currentIsSortDsc - The current sorting direction. If true, the sorting is descending.
 *
 * @returns {Object} An object containing the updated sorting column and direction.
 * @returns {string} .sort - The updated column to sort by.
 * @returns {boolean} .isSortDsc - The updated sorting direction. If true, the sorting is descending.
 *
 * @example
 * // returns {sort: 'Id', isSortDsc: false}
 * updateTableSort('Id', 'Id', true);
 *
 * @example
 * // returns {sort: 'Name', isSortDsc: false}
 * updateTableSort('Name', 'Id', true);
 */
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
