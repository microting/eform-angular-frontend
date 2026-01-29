import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import {Router} from '@angular/router';
import {EventBrokerService} from 'src/app/common/helpers';
import {HeaderSettingsModel} from 'src/app/common/models/settings';
import {AppSettingsService} from 'src/app/common/services/settings';
import { NgIf, AsyncPipe } from '@angular/common';
import { AuthImagePipe } from 'src/app/common/pipes';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [NgIf, AsyncPipe, AuthImagePipe]
})
export class HeaderComponent implements OnInit {
  private eventBrokerService = inject(EventBrokerService);
  private settingsService = inject(AppSettingsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  headerSettingsModel: HeaderSettingsModel = new HeaderSettingsModel;
  logoImage: any;

  private brokerListener: any;
  constructor() {
    const eventBrokerService = this.eventBrokerService;


    this.brokerListener = eventBrokerService.listen<void>('get-header-settings',
      () => {
        this.getSettings();
      });
  }

  ngOnInit() {
    this.getSettings();
  }

  getSettings() {
    this.settingsService.connectionStringExist().subscribe((result) => {
      if (result && result.success === true) {
        this.settingsService.getHeaderSettings().subscribe((data => {
          if (data && data.success) {
            this.headerSettingsModel = data.model;
            if (this.headerSettingsModel.imageLink && this.headerSettingsModel.imageLinkVisible) {
              this.logoImage = 'api/images/eform-images?fileName=' + this.headerSettingsModel.imageLink;
            } else if (!this.headerSettingsModel.imageLink) {
              this.logoImage = '../../../assets/images/logo.png';
            }
            // Trigger change detection after async update
            this.cdr.detectChanges();
          }
        }));
      } else {
        this.logoImage = '../../../assets/images/logo.png';
        this.headerSettingsModel.imageLinkVisible = true;
        this.headerSettingsModel.mainTextVisible = true;
        this.headerSettingsModel.secondaryTextVisible = true;
        this.headerSettingsModel.mainText = 'eForm Backend';
        this.headerSettingsModel.secondaryText = 'No more paper-forms and back-office data entry';
        // Trigger change detection after sync update
        this.cdr.detectChanges();
        this.router.navigate(['/connection-string']).then();
      }
    });
  }

}
