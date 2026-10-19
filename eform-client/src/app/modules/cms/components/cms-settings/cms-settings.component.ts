import {Component, OnInit, inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {CmsMenuModel, CmsSettingsModel} from 'src/app/common/models';
import {CmsService} from 'src/app/common/services/cms';
import {NgFor} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatButton} from '@angular/material/button';

@Component({
  imports: [NgFor, FormsModule, MatSlideToggle, MatFormField, MatLabel, MatSelect, MatOption, MatButton],
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
