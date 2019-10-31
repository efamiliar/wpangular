// Import modules from @angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components that will be used by this module
import { ViewCategoryComponent } from './view-category.component';
import { SharedModule } from '../shared/shared-module/shared.module';

// Child routes
import { routes } from './view-category-routing.module';


@NgModule({
  declarations: [
    ViewCategoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ViewCategoryModule { }