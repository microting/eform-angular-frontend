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

  constructor(private authService: AuthService,
              private router: Router,
              private adminService: AdminService) {
  }

  ngOnInit() {
    if (this.authService.isAuth) {
      this.adminService.getCurrentUserInfo().subscribe((result) => {
        this.userInfo = result;
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
