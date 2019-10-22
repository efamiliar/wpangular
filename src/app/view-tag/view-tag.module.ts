// Import modules from @angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components that will be used by this module
import { ViewTagComponent } from './view-tag.component';

// Child routes
import { routes } from './view-tag-routing.module';


@NgModule({
  declarations: [
    ViewTagComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ViewTagModule { }