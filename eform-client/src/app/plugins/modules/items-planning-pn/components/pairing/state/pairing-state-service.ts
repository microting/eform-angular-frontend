import { Injectable } from '@angular/core';
import { PairingStore } from './pairing-store';
import { Observable } from 'rxjs';
import { OperationDataResult } from 'src/app/common/models';
import { PairingQuery } from './pairing-query';
import { arrayToggle } from '@datorama/akita';
import { PairingsModel } from 'src/app/plugins/modules/items-planning-pn/models/pairings';
import { ItemsPlanningPnPairingService } from 'src/app/plugins/modules/items-planning-pn/services';

@Injectable({ providedIn: 'root' })
export class PairingStateService {
  constructor(
    private store: PairingStore,
    private service: ItemsPlanningPnPairingService,
    private query: PairingQuery
  ) {}

  getAllPairings(): Observable<OperationDataResult<PairingsModel>> {
    return this.service.getAllPairings({
      tagIds: this.query.pageSetting.tagIds,
    });
  }

  getTagIds(): Observable<number[]> {
    return this.query.selectTagIds$;
  }

  addOrRemoveTagId(id: number) {
    this.store.update(({ tagIds }) => ({
      tagIds: arrayToggle(tagIds, id),
    }));
  }
}
