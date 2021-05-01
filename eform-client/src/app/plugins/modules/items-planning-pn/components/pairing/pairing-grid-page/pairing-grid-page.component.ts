import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ItemsPlanningPnPairingService,
  ItemsPlanningPnPlanningsService,
  ItemsPlanningPnTagsService,
} from '../../../services';
import { SitesService } from 'src/app/common/services/advanced';
import { Subscription } from 'rxjs';
import { CommonDictionaryModel, SiteNameDto } from 'src/app/common/models';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {
  PairingUpdateModel,
  PairingsModel,
} from 'src/app/plugins/modules/items-planning-pn/models/pairings';
import * as R from 'ramda';
import { PairingGridUpdateComponent } from '../pairing-grid-update/pairing-grid-update.component';
import { PairingStateService } from 'src/app/plugins/modules/items-planning-pn/components/pairing/state/pairing-state-service';

@AutoUnsubscribe()
@Component({
  selector: 'app-pairing-grid-page',
  templateUrl: './pairing-grid-page.component.html',
  styleUrls: ['./pairing-grid-page.component.scss'],
})
export class PairingGridPageComponent implements OnInit, OnDestroy {
  @ViewChild('updatePairingsModal')
  updatePairingsModal: PairingGridUpdateComponent;
  getAllSites$: Subscription;
  getAllPairings$: Subscription;
  getTagsSub$: Subscription;
  updatePairings$: Subscription;
  sitesDto: SiteNameDto[] = [];
  pairings: PairingsModel = new PairingsModel();
  availableTags: CommonDictionaryModel[] = [];
  selectedColCheckboxes = new Array<{ colNumber: number; checked: boolean }>();
  selectedRowCheckboxes = new Array<{ rowNumber: number; checked: boolean }>();

  pairingsForUpdate: PairingUpdateModel[] = [];

  constructor(
    private pairingService: ItemsPlanningPnPairingService,
    private planningService: ItemsPlanningPnPlanningsService,
    private sitesService: SitesService,
    private tagsService: ItemsPlanningPnTagsService,
    public pairingStateService: PairingStateService
  ) {}

  ngOnInit(): void {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllSites();
    this.getAllPairings();
    this.getTags();
  }

  getAllSites() {
    this.getAllSites$ = this.sitesService
      .getAllSitesForPairing()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
      });
  }

  getTags() {
    this.getTagsSub$ = this.tagsService.getPlanningsTags().subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
    });
  }

  getAllPairings() {
    this.getAllPairings$ = this.pairingStateService
      .getAllPairings()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.pairings = operation.model;
          this.setSelectedColCheckboxes();
          this.setSelectedRowCheckboxes();
          this.pairingsForUpdate.splice(0, this.pairingsForUpdate.length);
        }
      });
  }

  updatePairings() {
    this.updatePairings$ = this.pairingService
      .updatePairings(this.pairingsForUpdate)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.updatePairingsModal.hide();
          this.getAllPairings();
        }
      });
  }

  saveTag(e: any) {
    this.pairingStateService.addOrRemoveTagId(e.id);
    this.getAllPairings();
  }

  removeSavedTag(e: any) {
    this.pairingStateService.addOrRemoveTagId(e.id);
    this.getAllPairings();
  }

  ngOnDestroy(): void {}

  onPairingChanged(model: PairingUpdateModel) {
    const foundObject = this.pairingsForUpdate.findIndex(
      (x) =>
        x.deviceUserId === model.deviceUserId &&
        x.planningId === model.planningId
    );
    // If pairing found in updates and clicked again - remove from updates
    if (foundObject > -1) {
      // Value does not need to be deleted if the pairing property is equal.
      if (this.pairingsForUpdate[foundObject].paired !== model.paired) {
        this.pairingsForUpdate = R.remove(
          foundObject,
          1,
          this.pairingsForUpdate
        );
      }
    } else {
      // Check whether we need to add an update to the array, because the object may not need to be updated if the same object was passed
      const i = this.pairings.pairings.findIndex(
        (x) =>
          x.planningId === model.planningId &&
          x.pairingValues.findIndex(
            (y) =>
              y.deviceUserId === model.deviceUserId && y.paired !== model.paired
          ) !== -1
      );
      if (i > -1) {
        this.pairingsForUpdate = [...this.pairingsForUpdate, model];
      }
    }
    // Set the checkboxes to true or false, so when you select a row or column, these values will not change automatically
    this.pairings.pairings.forEach((pairing) => {
      if (pairing.planningId === model.planningId) {
        pairing.pairingValues.forEach((pairingValue) => {
          if (pairingValue.deviceUserId === model.deviceUserId) {
            pairingValue.paired = model.paired;
          }
        });
      }
    });
  }

  showUpdatePairingsModal() {
    this.updatePairingsModal.show(this.pairingsForUpdate);
  }

  setSelectedColCheckboxes() {
    this.selectedColCheckboxes.splice(
      0,
      this.selectedColCheckboxes.length || 0
    );
    if (this.pairings.pairings[0]) {
      for (let i = 0; i < this.pairings.pairings[0].pairingValues.length; i++) {
        this.selectedColCheckboxes.push({ checked: false, colNumber: i });
      }
    }
  }

  setSelectedRowCheckboxes() {
    this.selectedRowCheckboxes.splice(
      0,
      this.selectedRowCheckboxes.length || 0
    );
    if (this.pairings.pairings) {
      for (let i = 0; i < this.pairings.pairings.length; i++) {
        this.selectedRowCheckboxes.push({ checked: false, rowNumber: i });
      }
    }
  }
}
