import {Component, Inject, OnInit} from '@angular/core';
import {SiteDto} from 'src/app/common/models/dto';
import {UnitsService} from 'src/app/common/services/advanced';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-new-otp-modal',
  templateUrl: './new-otp-modal.component.html',
  styleUrls: ['./new-otp-modal.component.scss']
})
export class NewOtpModalComponent implements OnInit {
  constructor(
    private unitsService: UnitsService,
    public dialogRef: MatDialogRef<NewOtpModalComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedSimpleSite: SiteDto = new SiteDto()) { }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  requestOtp() {
    this.unitsService.requestOtp(this.selectedSimpleSite.unitId).subscribe(operation => {
      if (operation && operation.success) {
        this.hide(true);
      }
    });
  }
}
