import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserInfoModel} from 'app/models/user';
import {AdminService} from 'app/services';
import {AuthService} from 'app/services/accounts/auth.service';

@Component({
  selector: 'eform-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  userInfo: UserInfoModel = new UserInfoModel;
  navigationMenu: any;
  constructor(private authService: AuthService,
              private router: Router,
              private adminService: AdminService) {
  }

  ngOnInit() {
    if (this.authService.isAuth) {
      this.adminService.getCurrentUserInfo().subscribe((result) => {
        this.userInfo = result;

        this.navigationMenu = [
          {
            name: this.userInfo.firstName + ' ' + this.userInfo.lastName || 'name',
            e2eId: 'sign-out-dropdown',
            appendLeftStyles: true,
            submenus: [
              {
                name: 'User Management',
                e2eId: 'user-management-menu',
                link: '/account-management/users',
                guard: 'admin'
              },
              {
                name: 'Google Authenticator',
                e2eId: '',
                link: '/account-management/google-authenticator'
              },
              {
                name: 'Change password',
                e2eId: '',
                link: '/account-management/change-password'
              },
              {
                name: 'Sign out',
                e2eId: 'sign-out',
                link: '/login/sign-out'
              }
            ]
          },
          {
            name: 'My eForms',
            e2eId: '',
            link: '/',
            submenus: []
          },
          {
            name: 'Device users',
            e2eId: '',
            link: '/simplesites',
            submenus: []
          },
          {
            name: 'Advanced',
            e2eId: '',
            submenus: [
              {
                name: 'Sites',
                e2eId: '',
                link: '/advanced/sites',
              },
              {
                name: 'Workers',
                e2eId: '',
                link: '/advanced/workers',
              },
              {
                name: 'Units',
                e2eId: '',
                link: '/advanced/units',
              },
              {
                name: 'Searchable list',
                e2eId: '',
                link: '/advanced/entity-search',
              },
              {
                name: 'Selectable list',
                e2eId: '',
                link: '/advanced/entity-select'
              },
              {
                name: 'Settings',
                e2eId: '',
                link: '/settings',
                guard: 'admin'
              }
            ]
          },
          {
            name: 'Example plugin',
            e2eId: '',
            link: '/plugins/example-pn',
            submenus: []
          },
        ];
      });
    }


  }
}
