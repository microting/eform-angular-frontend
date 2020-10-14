import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-navigation-menu-page',
  templateUrl: './navigation-menu-page.component.html',
  styleUrls: ['./navigation-menu-page.component.scss'],
})
export class NavigationMenuPageComponent implements OnInit {
  menuItemsCollapsed = false;
  mainAppItems: string[] = [
    'Eforms',
    'Device Users',
    'Sites',
    'Entity Search',
    'Entity Select',
    'Mailing',
    'Plugins',
    'Application Settings',
  ];

  plugins: {
    id: number;
    pluginName: string;
    pluginItems: string[];
  }[] = [
    {
      id: 1,
      pluginName: 'Items Planning',
      pluginItems: ['Plannings', 'Reports'],
    },
    {
      id: 2,
      pluginName: 'Work orders',
      pluginItems: ['Orders', 'Reports'],
    }
  ];


  constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup('MENU_ITEMS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      copy: (el, source) => {
        return source.id === 'mainMenu';
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== 'mainMenu';
      }
    });
  }

  ngOnInit(): void {}
}

