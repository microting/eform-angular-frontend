import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'app/services';


@Component({
  selector: 'sign-out',
  template: ''
})
export class SignOutComponent implements OnInit, AfterViewChecked {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

  }


  signOut() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('currentAuth');
      this.router.navigate(['/login']).then();
    });
  }

  ngAfterViewChecked(): void {
    this.signOut();
  }
}
