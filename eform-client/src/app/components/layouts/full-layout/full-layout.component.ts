import {Component, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-full-layout-root',
  templateUrl: `./full-layout.component.html`
})
export class FullLayoutComponent implements OnInit {
  darkTheme: boolean;

  constructor(private renderer: Renderer2) {

  }


  ngOnInit() {
    this.darkTheme = localStorage.getItem('darkTheme') === 'true';
    if (this.darkTheme) {
      this.renderer.addClass(document.body, 'theme-dark');
    }
  }
}
