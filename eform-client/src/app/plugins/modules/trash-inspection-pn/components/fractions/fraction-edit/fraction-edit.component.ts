import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TrashInspectionPnFractionsService } from '../../../services';
import { FractionPnModel } from '../../../models';
import {
  TemplateListModel,
  TemplateRequestModel,
} from '../../../../../../common/models/eforms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EFormService } from 'src/app/common/services/eform';

@Component({
  selector: 'app-trash-inspection-pn-fraction-edit',
  templateUrl: './fraction-edit.component.html',
  styleUrls: ['./fraction-edit.component.scss'],
})
export class FractionEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onFractionUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedFractionModel: FractionPnModel = new FractionPnModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  typeahead = new EventEmitter<string>();
  constructor(
    private trashInspectionPnFractionsService: TrashInspectionPnFractionsService,
    private cd: ChangeDetectorRef,
    private eFormService: EFormService
  ) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe((items) => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {}

  show(fractionModel: FractionPnModel) {
    this.getSelectedFraction(fractionModel.id);
    this.frame.show();
  }

  hide() {
    this.frame.hide();
    this.selectedFractionModel = new FractionPnModel();
  }

  getSelectedFraction(id: number) {
    // debugger;
    this.trashInspectionPnFractionsService
      .getSingleFraction(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.selectedFractionModel = data.model;
        }
      });
  }

  updateFraction() {
    this.trashInspectionPnFractionsService
      .updateFraction(this.selectedFractionModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onFractionUpdated.emit();
          this.hide();
        }
      });
  }

  onSelectedChanged(e: any) {
    // debugger;
    this.selectedFractionModel.eFormId = e.id;
  }
}
