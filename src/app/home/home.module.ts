// Import modules from @angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components that will be used by this module
import { HomeComponent } from './home.component';


// Child routes
import { routes } from './home-routing.module';
import { SharedModule } from '../shared/shared-module/shared.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }