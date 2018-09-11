import {Component, OnInit, AfterViewInit} from '@angular/core';
import {AdminSettingsModel} from 'src/app/common/models/settings';
import { AppSettingsService} from '../../common/services/app-settings';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  adminSettingsModel: AdminSettingsModel;
  version: string;
  constructor(private settingsService: AppSettingsService) {
  }
  ngOnInit() {
  this.getAssemblyVersion('AssemblyVersion');
  }
  ngAfterViewInit() {
  }
  getAssemblyVersion(attribute: string) {
    this.settingsService.getOneAdminSetting(attribute).subscribe(operation => {
      if (operation && operation.success) {
        this.adminSettingsModel = operation.model;
      }
      this.version = this.adminSettingsModel.assemblyVersion;
    });
    return this.version;
  }
}
