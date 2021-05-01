import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PairingUpdateModel, PairingsModel } from '../../../models/pairings';

@Component({
  selector: 'app-pairing-grid-table',
  templateUrl: './pairing-grid-table.component.html',
  styleUrls: ['./pairing-grid-table.component.scss'],
})
export class PairingGridTableComponent implements OnInit {
  @Input() pairingsModel: PairingsModel;
  @Output() pairingChanged = new EventEmitter<PairingUpdateModel>();
  @Input() selectedColCheckboxes: Array<{colNumber: number, checked: boolean}>;
  @Input() selectedRowCheckboxes: Array<{rowNumber: number, checked: boolean}>;

  constructor() {}

  ngOnInit(): void {}

  checked(e: any, planningId: number, deviceUserId: number) {
    this.pairingChanged.emit({
      paired: e.target.checked,
      planningId,
      deviceUserId,
    });
  }

  selectDeviceUserColumn($event: any, i: number) {
    this.selectedColCheckboxes[i].checked = $event.target.checked;
    this.pairingsModel.pairings.forEach(pairing =>
      this.checked($event, pairing.planningId, pairing.pairingValues[i].deviceUserId));
  }

  selectPlanningRow($event: any, y: number) {
    this.selectedRowCheckboxes[y].checked = $event.target.checked;
    this.pairingsModel.pairings[y].pairingValues.forEach(pairingValue =>
        this.checked($event, this.pairingsModel.pairings[y].planningId, pairingValue.deviceUserId));
  }
}
