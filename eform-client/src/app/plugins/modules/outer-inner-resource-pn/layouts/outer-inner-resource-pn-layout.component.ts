import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocaleService} from 'src/app/common/services/auth';
import {SharedPnService} from '../../shared/services';
import {OuterInnerResourcePnLocalSettings} from '../enums/outer-inner-resource-pn-local-settings.const';
declare var require: any;

@Component({
  selector: 'app-machine-area-pn-layout',
  template: `<router-outlet></router-outlet>`
})
export class OuterInnerResourcePnLayoutComponent implements AfterViewChecked, OnInit {

  constructor(private localeService: LocaleService,
              private translateService: TranslateService,
              private sharedPnService: SharedPnService) {

  }

  ngOnInit() {
    this.sharedPnService.initLocalPageSettings('machinesPnSettings', OuterInnerResourcePnLocalSettings);
  }


  ngAfterViewChecked() {
    setTimeout(() => {
      const lang = this.localeService.getCurrentUserLocale();
      const i18n = require(`../i18n/${lang}.json`);
      this.translateService.setTranslation(lang, i18n, true);
    }, 1000);

  }
}
