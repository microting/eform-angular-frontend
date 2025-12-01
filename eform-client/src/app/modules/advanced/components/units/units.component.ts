import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {UnitDto} from 'src/app/common/models';
import {UnitsService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {Subscription} from 'rxjs';
import {UnitCreateComponent, UnitMoveComponent, UnitsOtpCodeComponent} from './';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {selectCurrentUserClaimsSitesCreate} from 'src/app/state/auth/auth.selector';
import {PasswordValidationIcon} from "src/app/common/const";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-units',
    templateUrl: './units.component.html',
    standalone: false
})
export class UnitsComponent implements OnInit {
  private authStore = inject(Store);
  private unitsService = inject(UnitsService);
  dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private translateService = inject(TranslateService);
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('modalUnitsMove', {static: true}) modalUnitsMove;
  unitModels: Array<UnitDto> = [];

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Microting UID'), field: 'microtingUid'},
    {header: this.translateService.stream('Location'), field: 'siteName'},
    {header: this.translateService.stream('OS'), field: 'os',},
    {header: this.translateService.stream('OS Version'), field: 'osVersion',},
    {header: this.translateService.stream('Model'), field: 'model'},
    {header: this.translateService.stream('app Version'), field: 'eFormVersion'},
    {header: this.translateService.stream('Customer no & OTP'), field: 'otpCode'},
    {
      pinned: 'right',
      header: this.translateService.stream('Actions'), field: 'actions'},
  ];

  unitCreateComponentAfterClosedSub$: Subscription;
  unitsOtpCodeComponentAfterClosedSub$: Subscription;

  ngOnInit() {
    this.iconRegistry.addSvgIconLiteral('password-validation', this.sanitizer.bypassSecurityTrustHtml(PasswordValidationIcon));
    this.loadAllUnits();
    // this.getCurrentUserClaimsAsyncSub$ = this.authStateService.currentUserClaimsAsync.subscribe(x => {
    //   if(x.sitesDelete || x.sitesUpdate) {
    //     this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
    //       {
    //         header: this.translateService.stream('Actions'),
    //         field: 'actions',
    //       },
    //     ];
    //   }
    // })

    // let actionsEnabled = false;
    // this.selectCurrentUserClaimsSitesDelete$.subscribe(x => {
    //   if(x) {
    //     actionsEnabled = true;
    //     this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
    //       {
    //         header: this.translateService.stream('Actions'),
    //         field: 'actions',
    //       },
    //     ];
    //   }
    // });
    // this.selectCurrentUserClaimsSitesUpdate$.subscribe(x => {
    //   if(x && !actionsEnabled) {
    //     this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
    //       {
    //         header: this.translateService.stream('Actions'),
    //         field: 'actions',
    //       },
    //     ];
    //   }
    // });
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
