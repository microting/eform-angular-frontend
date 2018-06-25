import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocaleService} from 'app/services';

@Component({
  selector: 'app-example-pn-page',
  templateUrl: './example-pn-page.component.html'
})
export class ExamplePnPageComponent implements OnInit {

  constructor(private translateService: TranslateService,
              private localeService: LocaleService) {

  }

  ngOnInit() {
    this.setTranslation();
  }

  setTranslation() {
    const lang = this.localeService.getCurrentUserLocale();
    const i18n = require(`../../i18n/${lang}.json`);
    this.translateService.setTranslation(lang, i18n, true);
  }

}
