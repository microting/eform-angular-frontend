import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';

@Component({
  selector: 'app-navigation-menu-reset',
  templateUrl: './navigation-menu-reset.component.html',
  styleUrls: ['./navigation-menu-reset.component.scss'],
})
export class NavigationMenuResetComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() resetMenuConfirm: EventEmitter<void> = new EventEmitter<void>();

  get menuItemType() {
    return NavigationMenuItemTypeEnum;
  }

  constructor() {}

  ngOnInit(): void {}

  show() {
    this.frame.show();
  }

  resetMenu() {
    this.resetMenuConfirm.emit();
    this.frame.hide();
  }
}
