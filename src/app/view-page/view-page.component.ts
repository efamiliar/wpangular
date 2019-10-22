import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WprestNoAuthService } from '../shared/wprest-no-auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit, OnDestroy{

  private unsubscribeOnDestroy: Subject<void> = new Subject();

  pageId;
  page;

  constructor(
    private route: ActivatedRoute,
    private wprestNoAuthSrv: WprestNoAuthService) { }

  ngOnInit() {

    // Grab page id from url parameters
    this.pageId = this.route.snapshot.paramMap.get("id");

    // Fetch page via service
    this.wprestNoAuthSrv.getPageById(this.pageId).pipe(takeUntil(this.unsubscribeOnDestroy)).subscribe((data)=>{
      console.log('Page component loded ', data.body);
      this.page=data.body;
    });

  }

  ngOnDestroy() {
    // Unsubscribe from suscriptions
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

}
