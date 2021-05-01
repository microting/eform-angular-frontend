import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface ProducersReportPreviewTableState {
  pagination: CommonPaginationState;
}

export function createInitialState(): ProducersReportPreviewTableState {
  return <ProducersReportPreviewTableState>{
    pagination: {
      sort: 'Name',
      isSortDsc: false,
    },
  };
}

const producersReportPreviewTablePersistStorage = persistState({
  include: ['trashInspectionsProducersReportPreviewTable'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'trashInspectionsProducersReportPreviewTable',
  resettable: true,
})
export class ProducersReportPreviewTableStore extends Store<ProducersReportPreviewTableState> {
  constructor() {
    super(createInitialState());
  }
}

export const producersReportPreviewTablePersistProvider = {
  provide: 'persistStorage',
  useValue: producersReportPreviewTablePersistStorage,
  multi: true,
};
