import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {EventBrokerService} from 'src/app/common/helpers';
import {HeaderSettingsModel} from 'src/app/common/models/settings';
import {AppSettingsService} from 'src/app/common/services/settings';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  headerSettingsModel: HeaderSettingsModel = new HeaderSettingsModel;
  logoImage: any;

  private brokerListener: any;
  constructor(private eventBrokerService: EventBrokerService,
              private settingsService: AppSettingsService,
              private router: Router) {

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
          }
        }));
      } else {
        this.logoImage = '../../../assets/images/logo.png';
        this.headerSettingsModel.imageLinkVisible = true;
        this.headerSettingsModel.mainTextVisible = true;
        this.headerSettingsModel.secondaryTextVisible = true;
        this.headerSettingsModel.mainText = 'eForm Backend';
        this.headerSettingsModel.secondaryText = 'No more paper-forms and back-office data entry';
        this.router.navigate(['/connection-string']).then();
      }
    });
  }

}
