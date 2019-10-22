import { Component, OnInit, OnDestroy } from '@angular/core';
import { WprestNoAuthService } from './shared/wprest-no-auth.service';
import { WprestWithAuthService } from './shared/wprest-with-auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  private unsubscribeOnDestroy: Subject<void> = new Subject();
  
  title = 'app';
  mainMenu;
  siteName;
  siteDescription;

  constructor(
    private wprestNoAuthSrv: WprestNoAuthService,
    private wprestWithAuthSrv: WprestWithAuthService) { }

  ngOnInit(){
    this.getSiteInfo();
    this.checkAndValidateLogin();
    this.getMainMenu();
  }


  // Get Site Settings
  getSiteInfo(){
    this.wprestNoAuthSrv.getSiteInfo().pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((data)=>{
      this.siteName=data['name'];
      this.siteDescription=data['description'];
    });
  }


  // Check if there is a token and see if it is valid
  checkAndValidateLogin(){

    // Check if user token is set in localstorage
    let authToken = localStorage.getItem("userToken");
    if (authToken !== null) {
      console.log('Current token = ' + authToken);

      //Check it is a valid token
      this.wprestWithAuthSrv.validateToken().pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
        data=>{
        console.log("Token Validation result:");
        console.log(data);
        },
        error=>{
        console.log("Token Validation Error:");
        console.log(error);
        localStorage.removeItem('userToken');
        });
      
    }else{
      console.log('No token found');
    }
  }

  // Get Main Menu
  getMainMenu(){
    this.wprestNoAuthSrv.getMenuAtLocation('main_menu').pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
      data=>{
      this.mainMenu=data['items'];
      },
      error=>{
      console.log(error);  
      });
  }

  ngOnDestroy() {
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

}
