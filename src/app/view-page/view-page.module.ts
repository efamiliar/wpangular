// Import modules from @angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components that will be used by this module
import { ViewPageComponent } from './view-page.component';
import { SharedModule } from '../shared/shared-module/shared.module';

// Child routes
import { routes } from './view-page-routing.module';


@NgModule({
  declarations: [
    ViewPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ViewPageModule { }