import { Component, OnInit, OnDestroy } from '@angular/core';
import { WprestNoAuthService } from '../shared/wprest-no-auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicGlobalsService } from '../shared/dynamic-globals.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private unsubscribeOnDestroy: Subject<void> = new Subject();

  posts;
  categories;
  tags;
  pages;
  currentPage : number = 1;
  displayMoreButton = true;

  constructor(
    public dynamicGlobals: DynamicGlobalsService,
    private wprestNoAuthSrv: WprestNoAuthService) { }

  ngOnInit(){
    this.listPosts();
    this.listCategories();
    this.listTags();
    this.listPages();
  }


  // List posts starting at page one
  listPosts(){
    this.wprestNoAuthSrv.getPosts(this.currentPage).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((data)=>{
      
      console.log('Total results: '+data.headers.get('x-wp-total'));
      console.log('Total pages: '+data.headers.get('x-wp-totalpages'));

      // Remove "More" button?
      if(Number(data.headers.get('x-wp-totalpages')) <= this.currentPage){
        this.displayMoreButton = false;
      }

      // Initialize posts or concatenate existing results
      if(1 == this.currentPage){
        this.posts = data.body;
      }else{
        this.posts = this.posts.concat(data.body);
      }

    });
  }

  // Run listPosts() again with increased page number and append result to posts object
  listMorePosts(){
    this.currentPage++;
    this.listPosts();
  }

  // List all categories
  listCategories(){
    this.wprestNoAuthSrv.getCategories().pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((data)=>{
      this.categories = data.body;
    });
  }

  // List all tags
  listTags(){
    this.wprestNoAuthSrv.getTags().pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((data)=>{
      this.tags = data.body;
    });
  }

  // List all pages
  listPages(){
    this.wprestNoAuthSrv.getPages().pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((data)=>{
      this.pages = data.body;
    });
  }


  ngOnDestroy() {
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

}
