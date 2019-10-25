import { Component, OnInit, OnDestroy } from '@angular/core';
import { WprestNoAuthService } from '../shared/wprest-no-auth.service';
import { DynamicGlobalsService } from '../shared/dynamic-globals.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Post } from '../models/post';
import { Page } from '../models/page';

@Component({
  selector: 'app-routes-dispatcher',
  templateUrl: './routes-dispatcher.component.html',
  styleUrls: ['./routes-dispatcher.component.scss']
})
export class RoutesDispatcherComponent implements OnInit, OnDestroy{

  private unsubscribeOnDestroy: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dynamicGlobals: DynamicGlobalsService,
    private wprestNoAuthSrv: WprestNoAuthService
  ) {}

  ngOnInit(){


    console.log('Dispatcher Component INIT');

    /*
    Info: we are supposing that ROOTSHARED routes are posts and pages, but you may extend this function for extra ROOTSHARED routes dealing
    Truth 1: postPermalinkPieces.length != route.url.length happens if we are visiting a page and the post structure has multiple pieces
    Truth 2: postPermalinkPieces.length == route.url.length can happen if we are visiting a page and the post structure is only %postname% or %post_id%
    Truth 3: cannot decide if it's a page or a post JUST by using that information
    Conclusion: if postPermalinkPieces.length != route.url.length we can be sure that we are visiting a page (or of course the url is wrong)
                but an extra check needs to be done if postPermalinkPieces.length == route.url.length since we don't know if it's post or page
    */
  
      // Posts permalinks
      console.log('Posts permalink: ',this.dynamicGlobals.permalinkStructure['posts_permalink']);
  
      let postPermalinkPieces = this.dynamicGlobals.permalinkStructure['posts_permalink'].split('/').filter(item => { return item }); // Filter to remove empty pieces
  
      console.log('Permalink pieces', postPermalinkPieces);
      
      let maybePostSlugIndex : number = -1;
      let maybePostSlug : string;
  
      let maybePostIdIndex : number = -1;
      let maybePostId : number;
  
  
      if(postPermalinkPieces.length == this.route.snapshot.url.length){
  
        console.log('postPermalinkPieces.length == route.snapshot.url.length');
  
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
          this.route.snapshot.url.forEach( (routePathPiece, index) => {
  
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
      if(1 == this.route.snapshot.url.length){
        // this.router.navigate(['wp-angular/view-page/:id'], { skipLocationChange: true });
        this.wprestNoAuthSrv.getPageBySlug(this.route.snapshot.url[0].path).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
          httpResponse => {
              if(httpResponse.status == 200){
              let page = <Page>httpResponse.body;
              console.log('Retrieved page information ', page);
              this.displayPage(page.id);
              }else{
              console.log('No page found with slug: ' + this.route.snapshot.url[0].path);
              }
          },
          error => {
            console.log('Could not retrieve post ', error);
          }
        );
      }

  }

  ngOnDestroy(){
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

  private displayPost(id): void{
    console.log('Called displayPost with id: ' + id);
    this.router.navigate(['wp-angular/view-post/' + id], { skipLocationChange: true });
  }


  private displayPage(id): void{
    console.log('Called displayPage with id: ' + id);
    this.router.navigate(['wp-angular/view-page/' + id], { skipLocationChange: true });
  }

}
