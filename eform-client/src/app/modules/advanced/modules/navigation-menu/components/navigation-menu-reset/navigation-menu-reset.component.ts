import {
  Component,
  OnInit,
} from '@angular/core';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-navigation-menu-reset',
    templateUrl: './navigation-menu-reset.component.html',
    styleUrls: ['./navigation-menu-reset.component.scss'],
    standalone: false
})
export class NavigationMenuResetComponent implements OnInit {
  get menuItemType() {
    return NavigationMenuItemTypeEnum;
  }

  constructor(
    public dialogRef: MatDialogRef<NavigationMenuResetComponent>,
    ) {}

  ngOnInit(): void {}


  hide(result = false) {
    this.dialogRef.close(result);
  }

  resetMenu() {
    this.hide(true);
  }
}
