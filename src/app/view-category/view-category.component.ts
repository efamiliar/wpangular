import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WprestNoAuthService } from '../shared/wprest-no-auth.service';

// Models
import { Category } from '../models/category';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss']
})
export class ViewCategoryComponent implements OnInit, OnDestroy{

  private unsubscribeOnDestroy: Subject<void> = new Subject();

  categorySlug;
  categoryId;
  posts;
  currentPage : number = 1;
  displayMoreButton = true;

  constructor(
    private route: ActivatedRoute,
    private wprestNoAuthSrv: WprestNoAuthService) { }

  ngOnInit(){

    // Grab category slug from url parameters
    this.categorySlug = this.route.snapshot.paramMap.get("category");

    // Get category by slug
    this.wprestNoAuthSrv.getCategoryBySlug(this.categorySlug).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
      httpResponse=>{
        if(httpResponse.status == 200){
        let category = <Category>httpResponse.body;
        this.categoryId = category.id;
        console.log('Category id: ' + this.categoryId);

        // Find posts in this category
        this.listPostsInCategory();
        }
      },
      error=>{
        console.log(error);
      }
      );

  }



 
  // List posts in selected category starting at page one
  listPostsInCategory(){

    this.wprestNoAuthSrv.getPostsInCategory(this.categoryId,this.currentPage).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((data)=>{
      
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

  // Run listPostsInCategory() again with increased page number and append result to posts object
  listMorePostsInCategory(){
    this.currentPage++;
    this.listPostsInCategory();
  }


  ngOnDestroy() {
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

}
