import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PairingUpdateModel } from '../../../models/pairings';

@Component({
  selector: 'app-pairing-grid-update',
  templateUrl: './pairing-grid-update.component.html',
  styleUrls: ['./pairing-grid-update.component.scss'],
})
export class PairingGridUpdateComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output() updatePairings: EventEmitter<void> = new EventEmitter<void>();
  pairingsForDeploy: PairingUpdateModel[] = [];
  pairingsForRetract: PairingUpdateModel[] = [];

  constructor() {

  }

  ngOnInit() {}

  show(model: PairingUpdateModel[]) {
    this.pairingsForDeploy = model.filter(x => x.paired === true);
    this.pairingsForRetract = model.filter(x => x.paired === false);
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  update() {
    this.updatePairings.emit();
  }
}
