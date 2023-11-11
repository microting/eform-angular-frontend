import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TitleService} from 'src/app/common/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  // title = 'eForm Basic';
  constructor(
    ngTitle: Title,
    titleService: TitleService,
  ) {
    console.log('AppComponent - constructor');
    const defaultTitle = 'eForm Backend';
    titleService.title.subscribe(title => {
      if(title && title !== defaultTitle) {
        ngTitle.setTitle(`${title} - ${defaultTitle}`)
      } else {
        ngTitle.setTitle(defaultTitle)
      }
    });
  }
}
