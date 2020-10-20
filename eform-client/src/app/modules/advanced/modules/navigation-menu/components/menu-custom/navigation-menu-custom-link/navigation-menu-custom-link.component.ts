import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-menu-custom-link',
  templateUrl: './navigation-menu-custom-link.component.html',
  styleUrls: ['./navigation-menu-custom-link.component.scss']
})
export class NavigationMenuCustomLinkComponent implements OnInit {
  collapsed = true;
  constructor() { }

  ngOnInit(): void {
  }

}
