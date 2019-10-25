import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { WprestNoAuthService } from './shared/wprest-no-auth.service';
import { WprestWithAuthService } from './shared/wprest-with-auth.service';
import { DynamicGlobalsService } from './shared/dynamic-globals.service';

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
    private router: Router,
    private dynamicGlobals: DynamicGlobalsService,
    private wprestNoAuthSrv: WprestNoAuthService,
    private wprestWithAuthSrv: WprestWithAuthService) { }

  ngOnInit(){

    // Check if the WP Permalink structure is cached
    if(localStorage.hasOwnProperty("permalinkStructure")){
      this.dynamicGlobals.permalinkStructure = JSON.parse(localStorage.getItem("permalinkStructure"));
      this.setFixedBaseRoutes();
    }else{
      // Fetch WP Permalink Structure
      this.wprestNoAuthSrv.getPermalinkStructure().pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(        
        data => { 
            console.log('Got permalinks form API');
            this.dynamicGlobals.permalinkStructure = data.body;
            // Save it into localStorage
            localStorage.setItem("permalinkStructure",JSON.stringify(this.dynamicGlobals.permalinkStructure));
            this.setFixedBaseRoutes();
        });
    }


    this.getSiteInfo();
    this.getMainMenu();
    this.checkAndValidateLogin(); 
  }


  // Add the dynamic routes to the routes
  setFixedBaseRoutes(){
    console.log('setRoutes() with this permalink strcuture: ', this.dynamicGlobals.permalinkStructure);

    // Tag base
    console.log('Tag base: ',this.dynamicGlobals.permalinkStructure['tag_base']);
    this.dynamicGlobals.tagBase = this.dynamicGlobals.permalinkStructure['tag_base'];
    this.router.config.unshift({ // Add this path at the beginning of the array to make it take precedence over the catchall
        path: this.dynamicGlobals.permalinkStructure['tag_base'] + '/:tag',
        loadChildren: () => import('./view-tag/view-tag.module').then(m => m.ViewTagModule)
    });


    // Category base
    console.log('Category base: ',this.dynamicGlobals.permalinkStructure['category_base']);
    this.dynamicGlobals.categoryBase = this.dynamicGlobals.permalinkStructure['category_base'];
    this.router.config.unshift({ // Add this path at the beginning of the array to make it take precedence over the catchall
        path: this.dynamicGlobals.permalinkStructure['category_base'] + '/:category',
        loadChildren: () => import('./view-category/view-category.module').then(m => m.ViewCategoryModule)
    });

    
    // Save the new routes config
    this.router.resetConfig(this.router.config);
    console.log('Did a new router config with: ', this.router.config);
    
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
    if (localStorage.hasOwnProperty("userToken")){

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
      httpResponse=>{
      this.mainMenu=httpResponse.body['items'];
      console.log('Menu: ', this.mainMenu);
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
