import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  InstallationsPnModel,
  TrashInspectionPnModel,
  TrashInspectionPnUpdateModel,
} from '../../../models';
import { TrashInspectionPnTrashInspectionsService } from '../../../services';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-edit',
  templateUrl: './trash-inspection-edit.component.html',
  styleUrls: ['./trash-inspection-edit.component.scss'],
})
export class TrashInspectionEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input()
  mappingInstallations: InstallationsPnModel = new InstallationsPnModel();
  @Output()
  onTrashInspectionUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedTrashInspectionModel: TrashInspectionPnModel = new TrashInspectionPnModel();
  constructor(
    private trashInspectionPnTrashInspectionsService: TrashInspectionPnTrashInspectionsService
  ) {}

  ngOnInit() {}

  show(trashInspectionModel: TrashInspectionPnModel) {
    this.getSelectedTrashInspection(trashInspectionModel.id);
    this.frame.show();
  }

  getSelectedTrashInspection(id: number) {
    this.trashInspectionPnTrashInspectionsService
      .getSingleTrashInspection(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.selectedTrashInspectionModel = data.model;
        }
      });
  }

  updateTrashInspection() {
    this.trashInspectionPnTrashInspectionsService
      .updateTrashInspection(
        new TrashInspectionPnUpdateModel(this.selectedTrashInspectionModel)
      )
      .subscribe((data) => {
        if (data && data.success) {
          this.onTrashInspectionUpdated.emit();
          this.selectedTrashInspectionModel = new TrashInspectionPnModel();
          this.frame.hide();
        }
      });
  }

  addToEditMapping(e: any, installationId: number) {
    if (e.target.checked) {
      this.selectedTrashInspectionModel.relatedAreasIds.push(installationId);
    } else {
      this.selectedTrashInspectionModel.relatedAreasIds = this.selectedTrashInspectionModel.relatedAreasIds.filter(
        (x) => x !== installationId
      );
    }
  }

  isChecked(installationId: number) {
    if (
      this.selectedTrashInspectionModel.relatedAreasIds &&
      this.selectedTrashInspectionModel.relatedAreasIds.length > 0
    ) {
      return (
        this.selectedTrashInspectionModel.relatedAreasIds.findIndex(
          (x) => x === installationId
        ) !== -1
      );
    }
    return false;
  }
}
