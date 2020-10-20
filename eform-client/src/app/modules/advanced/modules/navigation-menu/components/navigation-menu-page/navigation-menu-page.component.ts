import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { NavigationMenuModel } from 'src/app/common/models/navigation-menu';

@Component({
  selector: 'app-navigation-menu-page',
  templateUrl: './navigation-menu-page.component.html',
  styleUrls: ['./navigation-menu-page.component.scss'],
})
export class NavigationMenuPageComponent implements OnInit {
  testActualMenu: any = [];
  navigationMenuModel: NavigationMenuModel = {
    actualMenu: [
      // {
      //   id: 1,
      //   isDropdown: false,
      //   position: 0,
      //   link: 'eforms',
      //   name: 'Eforms',
      //   relatedPluginId: null,
      //   children: [],
      //   relatedTemplateItemId: 1,
      //   parentId: null,
      //   collapsed: false,
      // },
      // {
      //   id: 2,
      //   isDropdown: true,
      //   position: 1,
      //   link: null,
      //   name: 'Advanced',
      //   relatedPluginId: null,
      //   children: [
      //     {
      //       id: 3,
      //       isDropdown: false,
      //       position: 0,
      //       link: 'sites',
      //       name: 'Sites',
      //       relatedPluginId: null,
      //       children: [],
      //       relatedTemplateItemId: 3,
      //       parentId: 2,
      //       collapsed: false,
      //     },
      //     {
      //       id: 4,
      //       isDropdown: false,
      //       position: 1,
      //       link: 'mailing',
      //       name: 'Mailing',
      //       relatedPluginId: null,
      //       children: [],
      //       relatedTemplateItemId: 4,
      //       parentId: 2,
      //       collapsed: false,
      //     },
      //   ],
      //   relatedTemplateItemId: null,
      //   parentId: null,
      //   collapsed: false,
      // },
    ],
    menuTemplates: [
      {
        id: 1,
        name: 'Main application',
        pluginId: null,
        items: [
          { id: 1, link: 'eforms', name: 'Eforms', collapsed: false },
          {
            id: 2,
            link: 'device-users',
            name: 'Device users',
            collapsed: false,
          },
          { id: 3, link: 'sites', name: 'Sites', collapsed: false },
          {
            id: 4,
            link: 'entity-select',
            name: 'Entity select',
            collapsed: false,
          },
          {
            id: 5,
            link: 'entity-search',
            name: 'Entity search',
            collapsed: false,
          },
          { id: 6, link: 'mailing', name: 'Mailing', collapsed: false },
        ],
        collapsed: false,
      },
      {
        id: 2,
        pluginId: 1,
        name: 'Items planning',
        items: [
          { id: 1, link: 'plannings', name: 'Plannings', collapsed: false },
          { id: 2, link: 'reports', name: 'Reports', collapsed: false },
        ],
        collapsed: false,
      },
    ],
  };
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
    },
  ];

  constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup('MENU_ITEMS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      copy: (el, source) => {
        return source.id === 'mainMenu' || source.id === 'pluginMenu';
      },
      copyItem: (data: any) => {
        return data;
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== 'mainMenu' && target.id !== 'pluginMenu';
      },
    });
  }

  ngOnInit(): void {}

  updateNavigationMenu() {
    debugger;
    const x = this.navigationMenuModel.actualMenu;
  }
}
