import { Component, OnInit, inject } from '@angular/core';
import {SiteDto, UnitModel} from 'src/app/common/models';
import {UnitsService} from 'src/app/common/services';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {DeviceUserRequestModel} from 'src/app/common/models';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MtxSelect } from '@ng-matero/extensions/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-unit-create',
    templateUrl: './unit-create.component.html',
    styleUrls: ['./unit-create.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MtxSelect, ReactiveFormsModule, FormsModule, MatDialogActions, MatButton, TranslatePipe]
})
export class UnitCreateComponent implements OnInit {
  private simpleSitesService = inject(DeviceUserService);
  private unitsService = inject(UnitsService);
  dialogRef = inject<MatDialogRef<UnitCreateComponent>>(MatDialogRef);

  unitModel: UnitModel = new UnitModel;
  simpleSites: Array<SiteDto> = [];

  ngOnInit() {
    this.loadAllSimpleSites();
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  loadAllSimpleSites() {
    this.simpleSitesService.getDeviceUsersFiltered( new DeviceUserRequestModel).subscribe((data => {
      this.simpleSites = data.model.map((i) => { i.fullName = i.siteName; return i; });
      // this.simpleSites = data.model.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
    }));
  }

  createUnit() {
    // this.newWorkerModel.customerNo =
    // this.simpleSites.find(x => x.siteId === this.newWorkerModel.siteId).customerNo;
    this.unitsService.createUnit(this.unitModel).subscribe((data => {
      if (data && data.success) {
        //this.newWorkerModel = new WorkerCreateModel;
        this.hide(true);
      }
    }));
  }
}
