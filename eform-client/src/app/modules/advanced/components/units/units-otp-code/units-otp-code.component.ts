import {Component, Inject, OnInit} from '@angular/core';
import {UnitDto} from 'src/app/common/models/dto';
import {UnitsService} from 'src/app/common/services/advanced';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-units-otp-code',
    templateUrl: './units-otp-code.component.html',
    styleUrls: ['./units-otp-code.component.scss'],
    standalone: false
})
export class UnitsOtpCodeComponent implements OnInit {
  constructor(private unitsService: UnitsService,
  public dialogRef: MatDialogRef<UnitsOtpCodeComponent>,
  @Inject(MAT_DIALOG_DATA) public selectedUnitModel: UnitDto = new UnitDto()) { }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  requestOtp() {
    this.unitsService.requestOtp(this.selectedUnitModel.microtingUid).subscribe(operation => {
      if (operation && operation.success) {
        this.hide(true);
      }
    });
  }

}
