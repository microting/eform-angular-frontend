import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface FractionsReportPreviewTableState {
  pagination: CommonPaginationState;
}

export function createInitialState(): FractionsReportPreviewTableState {
  return <FractionsReportPreviewTableState>{
    pagination: {
      sort: 'Name',
      isSortDsc: false,
    },
  };
}

const fractionsReportPreviewTablePersistStorage = persistState({
  include: ['trashInspectionsFractionsReportPreviewTable'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'trashInspectionsFractionsReportPreviewTable',
  resettable: true,
})
export class FractionsReportPreviewTableStore extends Store<FractionsReportPreviewTableState> {
  constructor() {
    super(createInitialState());
  }
}

export const fractionsReportPreviewTablePersistProvider = {
  provide: 'persistStorage',
  useValue: fractionsReportPreviewTablePersistStorage,
  multi: true,
};
