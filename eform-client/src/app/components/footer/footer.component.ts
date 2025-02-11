import {Component, OnInit} from '@angular/core';
import {AppSettingsService} from 'src/app/common/services';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent implements OnInit {
  version: string;
  date = new Date();

  constructor(private settingsService: AppSettingsService) {
  }

  ngOnInit() {
    this.getAssemblyVersion();
  }

  getAssemblyVersion() {
    this.settingsService.getAssemblyVersion().subscribe(operation => {
      if (operation && operation.success) {
        this.version = operation.model;
      }
    });
  }
}
