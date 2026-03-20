import {Component, OnInit, inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {CmsMenuModel, CmsSettingsModel} from 'src/app/common/models';
import {CmsService} from 'src/app/common/services/cms';

@Component({
  standalone: false,
  selector: 'app-cms-settings',
  templateUrl: './cms-settings.component.html',
})
export class CmsSettingsComponent implements OnInit {
  private cmsService = inject(CmsService);
  private toastr = inject(ToastrService);

  settings: CmsSettingsModel = {isCmsEnabled: false, isMenuSticky: false};
  menus: CmsMenuModel[] = [];

  ngOnInit(): void {
    this.loadSettings();
    this.loadMenus();
  }

  loadSettings(): void {
    this.cmsService.getSettings().subscribe((result) => {
      if (result.success) this.settings = result.model;
    });
  }

  loadMenus(): void {
    this.cmsService.getAllMenus().subscribe((result) => {
      if (result.success) this.menus = result.model;
    });
  }

  save(): void {
    this.cmsService.updateSettings(this.settings).subscribe((result) => {
      if (result.success) {
        this.toastr.success('Settings saved');
      } else {
        this.toastr.error(result.message);
      }
    });
  }
}
