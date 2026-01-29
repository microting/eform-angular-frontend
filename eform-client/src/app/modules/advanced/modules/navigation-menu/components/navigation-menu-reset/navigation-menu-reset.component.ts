import { Component, OnInit, inject } from '@angular/core';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import { MatDialogRef, MatDialogTitle, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-navigation-menu-reset',
    templateUrl: './navigation-menu-reset.component.html',
    styleUrls: ['./navigation-menu-reset.component.scss'],
    imports: [MatDialogTitle, MatDialogActions, MatButton, TranslatePipe]
})
export class NavigationMenuResetComponent implements OnInit {
  dialogRef = inject<MatDialogRef<NavigationMenuResetComponent>>(MatDialogRef);

  get menuItemType() {
    return NavigationMenuItemTypeEnum;
  }

  ngOnInit(): void {}


  hide(result = false) {
    this.dialogRef.close(result);
  }

  resetMenu() {
    this.hide(true);
  }
}
