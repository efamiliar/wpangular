import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WprestNoAuthService } from '../shared/wprest-no-auth.service';

// Models
import { Tag } from '../models/tag';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-tag',
  templateUrl: './view-tag.component.html',
  styleUrls: ['./view-tag.component.scss']
})
export class ViewTagComponent implements OnInit, OnDestroy{

  private unsubscribeOnDestroy: Subject<void> = new Subject();

  tagSlug;
  tagId;
  posts;
  currentPage : number = 1;
  displayMoreButton = true;

  constructor(
    private route: ActivatedRoute,
    private wprestNoAuthSrv: WprestNoAuthService) { }

  ngOnInit() {

    // Grab category slug from url parameters
    this.tagSlug = this.route.snapshot.paramMap.get("tag");

    // Get category by slug
    this.wprestNoAuthSrv.getTagBySlug(this.tagSlug).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe(
      httpResponse=>{
        if(httpResponse.status == 200){
        let tag = <Tag>httpResponse.body;
        this.tagId = tag.id;
        console.log('Tag id: ' + this.tagId);

        // Find posts in this category
        this.listPostsInTag();
        }
      },
      error=>{
        console.log(error);
      }
      );

  }



  // List posts in selected category starting at page one
  listPostsInTag(){

    this.wprestNoAuthSrv.getPostsInTag(this.tagId,this.currentPage).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((data)=>{
      
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

  // Run listPostsInTag() again with increased page number and append result to posts object
  listMorePostsInTag(){
    this.currentPage++;
    this.listPostsInTag();
  }


  ngOnDestroy() {
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

}
