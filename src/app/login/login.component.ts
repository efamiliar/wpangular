import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WprestWithAuthService } from '../shared/wprest-with-auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{

  private unsubscribeOnDestroy: Subject<void> = new Subject();

  userToken = localStorage.getItem('userToken');
  username; // user
  password; // admin

  constructor(
    private wprestWithAuthSrv: WprestWithAuthService,
    private router: Router) { }

  ngOnInit() {
  }

  doLogin(){
    let userLoginData = {
      username: this.username,
      password: this.password
    }
    this.wprestWithAuthSrv.doLogin(userLoginData).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
      data=>{
        localStorage.setItem('userToken', data['token']);
        
        // Redirect to home
        this.router.navigate(['']);
      },
      error=>{
        console.log(error['error'].code);
      }
      );
  }


  ngOnDestroy() {
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

}
