import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve} from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { WprestNoAuthService } from './shared/wprest-no-auth.service';
import { DynamicGlobalsService } from './shared/dynamic-globals.service';

// Models
import { Post } from './models/post';
import { Page } from './models/page';
import { takeUntil } from 'rxjs/operators';



/* 

This service gets the current WP permalink structure and sets the routing accordingly

First, we use the resolver to allow the service to jump in and let us know what kind of content we are dealing with

Then, we silently redirect to the associated component with Lazy Load

*/

@Injectable({
  providedIn: 'root'
})
export class RoutesResolver implements Resolve<any>, OnDestroy{

  private unsubscribeOnDestroy: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private dynamicGlobals: DynamicGlobalsService,
    private wprestNoAuthSrv: WprestNoAuthService) {}

  private permalinkStructure;



  /*

  Since this resolver may seem a little strange at a first glance, let's give a good explanation

  - WP allows custom permalink structures
  - So we must find out what the WP settings are with this.wprestNoAuthSrv.getPermalinkStructure()
  - From there on, we have two main situations:
  - A: we have fixed category and tag bases, which allow us to just create a path for them and set the right routes config
  - B: but we also have routes share a top-level slug not knowing if it's a normal post, a custom post type or a page
       example 1: example.com/whatever-page-slug
       example 2: example.com/whatever-post-slug
       example 3: example.com/whatever-custom-post-type-slug
       example 4: example.com/author-name/post-slug          
  - The solution for A is trivial thanks to this.router.resetConfig() which allows creating routes on the fly
  - The solution for B is not trivial, since we will definitely be using independent components for pages and posts to allow full customization
  - For the moment, we will call the A type a FIXEDBASE routing and the B type a ROOTSHARED routing
  - The routing design must still allow other special routing customization, such as woocommerce or whatever-features

  SO core question: https://stackoverflow.com/questions/58468758/resolve-path-and-load-a-specific-component-based-on-condition

  */
  
  resolve(route: ActivatedRouteSnapshot): Observable<any>|any{

    console.log('Resolve', route.url);
    console.log('Router config', this.router.config);
    


    /*

    The custom permalink field on the settings->permalink screen only applies to Posts. Not to Pages.

    WordPress Pages always live at the "top" of the URL tree. /about /whatever /etc.
    
    Posts live wherever the custom permalink string defines them to be, but of course they could also live at the "top".

    FOR the POSTNAME

    %year% - The year of the post, four digits, for example 2018

    %monthnum% - Month of the year, for example 05

    %day% - Day of the month, for example 28

    %hour% - Hour of the day, for example 15

    %minute% - Minute of the hour, for example 43

    %second% - Second of the minute, for example 33

    %post_id% - The unique ID of the post, for example 423

    %postname% - Post slug

    %category% - Category slug

    %author% - Author name slug

    Example url: whatever/%author%/somethingelse/%postname%
    Example url: whatever/%author%/somethingelse/%postname%/other
    Example url: whatever/%author%/somethingelse/%post_id%/just-whatever-really

    Most natural thing, split from slashes. That is already done by the ActivatedRouteSnapshot, route has property url as an array of path pieces

    
    FOR the CATEGORY and TAG, WP does not provide native no-base urls
  
    Since there will always be a base, we use that base and generate a new routes config

    */

    console.log('permalinkStructure ', this.permalinkStructure);

    if(this.permalinkStructure == undefined){


      // Fetch WP Permalink Structure
      this.wprestNoAuthSrv.getPermalinkStructure().pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
          
          data => {

          this.permalinkStructure = data.body; // Save it into the resolver service for reuse

          console.log('--> returned: ', this.permalinkStructure);

          // First we set up FIXEDBASE routes

          // Tag base
          console.log('Tag base: ',this.permalinkStructure['tag_base']);
          this.dynamicGlobals.tagBase = this.permalinkStructure['tag_base'];
          this.router.config.unshift({ // Add this path at the beginning of the array to make it take precedence over the catchall
              path: this.permalinkStructure['tag_base'] + '/:tag',
              loadChildren: () => import('./view-tag/view-tag.module').then(m => m.ViewTagModule)
          });


          // Category base
          console.log('Category base: ',this.permalinkStructure['category_base']);
          this.dynamicGlobals.categoryBase = this.permalinkStructure['category_base'];
          this.router.config.unshift({ // Add this path at the beginning of the array to make it take precedence over the catchall
              path: this.permalinkStructure['category_base'] + '/:category',
              loadChildren: () => import('./view-category/view-category.module').then(m => m.ViewCategoryModule)
          });


          // Whatever-else base - customize for your own needs (wp/permalinks rest endpoint is located in functions.php)
          /*
          console.log('Whatever-else base: ',permalinkStructure['whateverelse_base']);
          let whateverelseBase;
          if(permalinkStructure['whateverelse_base'].length == 0){
              whateverelseBase = 'category';
          }else{
              whateverelseBase = permalinkStructure['whateverelse_base'];
          }
          routes.unshift({ // Add this path at the beginning of the array to make it take precedence over the catchall
              path: whateverelseBase + '/:whateverelsedata',
              loadChildren: () => import('./feature-whateverelse/feature-whateverelse.module').then(m => m.FeatureWhateverElseModule)
          });
          */

          
          // Save the new routes config
          this.router.resetConfig(this.router.config);

          console.log('Did a new router config with: ', this.router.config);

          // For the ROOTSHARED cases, since those routes have a shared structure, we must resolve those everytime
          if(route.url[0]==this.permalinkStructure['tag_base'] || route.url[0]==this.permalinkStructure['category_base']){
          this.router.navigate([route.url[0].path, route.url[1].path]);
          }else{
          this.manageRootSharedRoutes(route);
          }

      }); // subscribe ends

    }else{

    // this.permalinkStructure already exists and tag and category routes are already defined routes, so this IS PostOrPage
    this.manageRootSharedRoutes(route);

    }


    return Observable.create(observer => {
      setTimeout(() => {
        observer.next("data to send can be object or anything");
        console.log("resolver is done");
        observer.complete(); // to show we are done with our processing
       // observer.error(new Error("error message"));
      }, 3000);
    });
    
  }



  private manageRootSharedRoutes(route){

  console.log('Called manageRootSharedRoutes');

  /*
  Info: we are supposing that ROOTSHARED routes are posts and pages, but you may extend this function for extra ROOTSHARED routes dealing
  Truth 1: postPermalinkPieces.length != route.url.length happens if we are visiting a page and the post structure has multiple pieces
  Truth 2: postPermalinkPieces.length == route.url.length can happen if we are visiting a page and the post structure is only %postname% or %post_id%
  Truth 3: cannot decide if it's a page or a post JUST by using that information
  Conclusion: if postPermalinkPieces.length != route.url.length we can be sure that we are visiting a page (or of course the url is wrong)
              but an extra check needs to be done if postPermalinkPieces.length == route.url.length since we don't know if it's post or page
  */

    // Posts permalinks
    console.log('Posts permalink: ',this.permalinkStructure['posts_permalink']);

    let postPermalinkPieces = this.permalinkStructure['posts_permalink'].split('/').filter(item => { return item }); // Filter to remove empty pieces

    console.log('Permalink pieces', postPermalinkPieces);
    
    let maybePostSlugIndex : number = -1;
    let maybePostSlug : string;

    let maybePostIdIndex : number = -1;
    let maybePostId : number;


    if(postPermalinkPieces.length == route.url.length){

      console.log('postPermalinkPieces.length == route.url.length');

        // Recognize where each permalink piece is located in the string
        postPermalinkPieces.forEach( (postPermalinkPiece, index) => {

          // Only id and slug identify a specific content

          if(postPermalinkPiece == '%post_id%'){
            maybePostIdIndex = index;
          }

          if(postPermalinkPiece == '%postname%'){
            maybePostSlugIndex = index;
            console.log('%postname% holder found at position ' + index);
          }

        });

        // Get the requested value for each permalink piece checking against the now known positions
        route.url.forEach( (routePathPiece, index) => {

          // Check for post given ID
          // -- replicate SLUG
          if(index == maybePostIdIndex){
            maybePostId = +routePathPiece.path; // + unary operator to make the string become numeric
            // wprestNoAuthSrv.getPostById();
            //this.displayPost(post.id);
          }

          
          // Check for post given SLUG
          if(index == maybePostSlugIndex){
            maybePostSlug = routePathPiece.path;
            console.log('Found corresponding value for %postname% is: ' + maybePostSlug);
            
            // See if there really exists a post with this slug
            this.wprestNoAuthSrv.getPostBySlug(maybePostSlug).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
              httpResponse => {
                  console.log('getPostBySlug result data is: ', httpResponse);
                  if(httpResponse.status == 200){
                  let post = <Post>httpResponse.body;
                  console.log('Retrieved post information ', post);
                  this.displayPost(post.id);
                  }else{
                  console.log('No post found with slug: ' + maybePostSlug);
                  }
              },
              error => {
                console.log('Could not retrieve post ', error);
              }
            );   
          }

        });

    }

    // In parallel to checking if we are visiting a post, we will also check if it corresponds to a page slug if there is only one piece
    if(1 == route.url.length){
      // this.router.navigate(['wp-angular/view-page/:id'], { skipLocationChange: true });
      this.wprestNoAuthSrv.getPageBySlug(route.url[0].path).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
        httpResponse => {
            if(httpResponse.status == 200){
            let page = <Page>httpResponse.body;
            console.log('Retrieved page information ', page);
            this.displayPage(page.id);
            }else{
            console.log('No page found with slug: ' + route.url[0].path);
            }
        },
        error => {
          console.log('Could not retrieve post ', error);
        }
      );
    }
  
  }




  private displayPost(id): void{
    console.log('Called displayPost with id: ' + id);
    this.router.navigate(['wp-angular/view-post/' + id], { skipLocationChange: true });
  }


  private displayPage(id): void{
    console.log('Called displayPage with id: ' + id);
    this.router.navigate(['wp-angular/view-page/' + id], { skipLocationChange: true });
  }



  ngOnDestroy() {
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }



}