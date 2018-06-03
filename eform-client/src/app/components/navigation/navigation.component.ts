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
            appendLeftStyles: true,
            submenus: [
              {
                name: 'User Management',
                link: '/account-management/users',
                guard: 'admin'
              },
              {
                name: 'Google Authenticator',
                link: '/account-management/google-authenticator'
              },
              {
                name: 'Change password',
                link: '/account-management/change-password'
              },
              {
                name: 'Sign out',
                link: ''
              }
            ]
          },
          {
            name: 'My eForms',
            link: '/',
            submenus: []
          },
          {
            name: 'Device users',
            link: '/simplesites',
            submenus: []
          },
          {
            name: 'Advanced',
            submenus: [
              {
                name: 'Sites',
                link: '/advanced/sites',
              },
              {
                name: 'Workers',
                link: '/advanced/workers',
              },
              {
                name: 'Units',
                link: '/advanced/units',
              },
              {
                name: 'Searchable list',
                link: '/advanced/entity-search',
              },
              {
                name: 'Selectable list',
                link: '/advanced/entity-select'
              },
              {
                name: 'Settings',
                link: '/settings',
                guard: 'admin'
              }
            ]
          },
          {
            name: 'Example plugin',
            link: '/plugins/example-pn',
            submenus: []
          },
        ];
      });
    }


  }

  signOut() {
    this.authService.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']).then();
    });
  }
}
