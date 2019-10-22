import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { WprestNoAuthService } from '../shared/wprest-no-auth.service';

// Models
import { Post } from '../models/post';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent implements OnInit, OnDestroy{

  private unsubscribeOnDestroy: Subject<void> = new Subject();

  post;
  postId;

  constructor(
    private route: ActivatedRoute,
    private wprestNoAuthSrv: WprestNoAuthService) { }

  ngOnInit(){

    // Grab post id from url parameters
    this.postId = this.route.snapshot.paramMap.get("id");
    console.log("Trying to load component with post id: " + this.postId);

    // Fetch post via service
    this.wprestNoAuthSrv.getPostById(this.postId).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((data)=>{
      console.log('Post component loded ', data.body);
      this.post = <Post>data.body;
    });

  }


  ngOnDestroy() {
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

}
