// Import modules from @angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components that will be used by this module
import { ViewPostComponent } from './view-post.component';

// Child routes
import { routes } from './view-post-routing.module';


@NgModule({
  declarations: [
    ViewPostComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ViewPostModule { }