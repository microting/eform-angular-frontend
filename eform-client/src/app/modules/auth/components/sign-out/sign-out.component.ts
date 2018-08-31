import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/common/services/auth';


@Component({
  selector: 'sign-out',
  template: ''
})
export class SignOutComponent implements OnInit, AfterViewChecked {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {

  }


  signOut() {
    localStorage.removeItem('currentAuth');
    this.router.navigate(['/auth']).then();
  }

  ngAfterViewChecked(): void {
    this.signOut();
  }
}
