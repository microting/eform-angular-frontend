import {Component, OnInit, ViewChild} from '@angular/core';
import {UnitDto} from 'src/app/common/models';
import {UnitsService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {Subscription} from 'rxjs';
import {UnitCreateComponent, UnitMoveComponent, UnitsOtpCodeComponent} from './';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
})
export class UnitsComponent implements OnInit {
  @ViewChild('modalUnitsMove', {static: true}) modalUnitsMove;
  unitModels: Array<UnitDto> = [];

  tableHeaders: MtxGridColumn[] = [
    {header: 'Microting UID', field: 'microtingUid'},
    {header: 'Location', field: 'siteName'},
    {header: 'OS', field: 'os',},
    {header: 'OS Version', field: 'osVersion',},
    {header: 'Model', field: 'model'},
    {header: 'InSight Version', field: 'inSightVersion'},
    {header: 'eForm Version', field: 'eFormVersion'},
    {header: 'Customer no & OTP', field: 'otpCode'},
    {header: 'Sync delay', field: 'syncDelay'},
    {header: 'Sync dialog', field: 'syncDialog'},
    {header: 'Push', field: 'push'},
    this.userClaims.sitesDelete || this.userClaims.sitesUpdate
      ? {header: 'Actions', field: 'actions'}
      : undefined,
  ];

  unitCreateComponentAfterClosedSub$: Subscription;
  unitsOtpCodeComponentAfterClosedSub$: Subscription;

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private unitsService: UnitsService,
    private authStateService: AuthStateService,
    public dialog: MatDialog,
    private overlay: Overlay
  ) {
  }

  ngOnInit() {
    this.loadAllUnits();
  }

  loadAllUnits() {
    this.unitsService.getAllUnits().subscribe((operation) => {
      if (operation && operation.success) {
        this.unitModels = operation.model;
      }
    });
  }

  openCreateModal() {
    this.unitCreateComponentAfterClosedSub$ = this.dialog.open(UnitCreateComponent,
      {...dialogConfigHelper(this.overlay, {}), minWidth: 500})
      .afterClosed().subscribe(data => data ? this.loadAllUnits() : undefined);
  }

  openMoveModal(selectedUnitDto: UnitDto) {
    this.unitCreateComponentAfterClosedSub$ = this.dialog.open(UnitMoveComponent,
      {...dialogConfigHelper(this.overlay, selectedUnitDto), minWidth: 500})
      .afterClosed().subscribe(data => data ? this.loadAllUnits() : undefined);
  }

  openModalUnitsOtpCode(selectedUnitDto: UnitDto) {
    this.unitsOtpCodeComponentAfterClosedSub$ = this.dialog.open(UnitsOtpCodeComponent,
      {...dialogConfigHelper(this.overlay, selectedUnitDto)})
      .afterClosed().subscribe(data => data ? this.loadAllUnits() : undefined);
  }
}
