import { Component, OnInit, ViewChild } from '@angular/core';
import { FractionPnModel } from '../../../models';
import { PluginClaimsHelper } from 'src/app/common/helpers';
import { TrashInspectionPnClaims } from '../../../enums';
import { Paged, TableHeaderElementModel } from 'src/app/common/models';
import { FractionsStateService } from '../store/fractions-state-service';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-trash-inspection-pn-fractions-page',
  templateUrl: './fractions-page.component.html',
  styleUrls: ['./fractions-page.component.scss'],
})
export class FractionsPageComponent implements OnInit {
  @ViewChild('createFractionModal') createFractionModal;
  @ViewChild('editFractionModal') editFractionModal;
  @ViewChild('deleteFractionModal') deleteFractionModal;
  fractionsModel: Paged<FractionPnModel> = new Paged<FractionPnModel>();

  get trashInspectionPnClaims() {
    return TrashInspectionPnClaims;
  }

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    {
      name: 'ItemNumber',
      elementId: 'itemNumberTableHeader',
      sortable: true,
      visibleName: 'Item number',
    },
    { name: 'Name', elementId: 'nameTableHeader', sortable: true },
    {
      name: 'Description',
      elementId: 'descriptionTableHeader',
      sortable: true,
    },
    {
      name: 'LocationCode',
      elementId: 'locationCodeTableHeader',
      sortable: true,
      visibleName: 'Location code',
    },
    {
      name: 'eFormId',
      elementId: 'eFormTableHeader',
      sortable: true,
      visibleName: 'eForm',
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    public fractionsStateService: FractionsStateService,
    public authStateService: AuthStateService
  ) {}

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllFractions();
  }

  getAllFractions() {
    this.fractionsStateService.getAllFractions().subscribe((data) => {
      if (data && data.success) {
        this.fractionsModel = data.model;
      }
    });
  }
  showEditFractionModal(fraction: FractionPnModel) {
    this.editFractionModal.show(fraction);
  }

  showDeleteFractionModal(fraction: FractionPnModel) {
    this.deleteFractionModal.show(fraction);
  }

  showCreateFractionModal() {
    this.createFractionModal.show();
  }

  sortTable(sort: string) {
    this.fractionsStateService.onSortTable(sort);
    this.getAllFractions();
  }

  changePage(offset: number) {
    this.fractionsStateService.changePage(offset);
    this.getAllFractions();
  }

  onFractionDeleted() {
    this.fractionsStateService.onDelete();
    this.getAllFractions();
  }

  onPageSizeChanged(pageSize: number) {
    this.fractionsStateService.updatePageSize(pageSize);
    this.getAllFractions();
  }
}
