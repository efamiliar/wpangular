// Import modules from @angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components that will be used by this module
import { LogoutComponent } from './logout.component';
import { SharedModule } from '../shared/shared-module/shared.module';

// Child routes
import { routes } from './logout-routing.module';


@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class LogoutModule { }