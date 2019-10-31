import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { WprestNoAuthService } from './shared/wprest-no-auth.service';
import { WprestWithAuthService } from './shared/wprest-with-auth.service';
import { DynamicGlobalsService } from './shared/dynamic-globals.service';
import { ConstantGlobals } from './shared/constant-globals';

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

  constructor(
    public dynamicGlobals: DynamicGlobalsService,
    private router: Router,
    private wprestNoAuthSrv: WprestNoAuthService,
    private wprestWithAuthSrv: WprestWithAuthService) { }

  ngOnInit(){
    this.getSiteInfo();
    this.getPermalinksStructure();
    this.getMainMenu();
    this.checkAndValidateLogin(); 
  }


  // Get Permalinks Structure
  getPermalinksStructure(){

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

  }


  // Add the dynamic routes to the routes [this function will be called from getPermalinksStructure() when data is ready]
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


  // Get Site Information (name and description)
  getSiteInfo(){

    // Check if this info is cached on LocalStorage
    if(localStorage.hasOwnProperty("siteInfo")){
      let cachedSiteInfo = JSON.parse(localStorage.getItem("siteInfo"));
      this.dynamicGlobals.siteName=cachedSiteInfo['name'];
      this.dynamicGlobals.siteDescription=cachedSiteInfo['description'];
    }else{ // Retrieve it from backend and cache it for next time
      
      this.wprestNoAuthSrv.getSiteInfo().pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((httpResponse)=>{
        // Save this basic information into localStorage for later use
        localStorage.setItem("siteInfo",JSON.stringify(httpResponse.body));
        this.dynamicGlobals.siteName=httpResponse.body['name'];
        this.dynamicGlobals.siteDescription=httpResponse.body['description'];
      });
    }

  }


  // Check if there is a token (from previous JWT Authentication) and see if it is valid
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

    // Check if the Menu is cached on LocalStorage
    if(localStorage.hasOwnProperty("mainMenu")){
      let cachedMenu = JSON.parse(localStorage.getItem("mainMenu"));
      this.dynamicGlobals.mainMenu = this.reMapMenu(cachedMenu);
    }else{ // Retrieve it from backend and cache it for next time

    this.wprestNoAuthSrv.getMenuAtLocation('main_menu').pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
      httpResponse=>{
        // Save menu into localStorage for later use
        localStorage.setItem("mainMenu",JSON.stringify(httpResponse.body['items']));
        this.dynamicGlobals.mainMenu=this.reMapMenu(httpResponse.body['items']);
      },
      error=>{
        console.log(error);  
      });
    
    }

  }

  // Re-Map Menu links to strip WP_ROOT_URL (http://...) from internal urls
  reMapMenu(menuItems){

    // Remove the WP_ROOT_URL from the internal urls
    menuItems.map((item) => {

      if(item.url.includes(ConstantGlobals.WP_ROOT_URL)){
        console.log(item.url + ' is an internal URL');
        item.url = item.url.replace(ConstantGlobals.WP_ROOT_URL+'/','');
      }else{
        console.log(item.url + ' is an external URL');
      }

      return item;

    });

    return menuItems;

  }
  

  ngOnDestroy() {
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

}
