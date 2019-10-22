// Import modules from @angular
import { Routes } from '@angular/router';

// Components that will be used by this module
import { LogoutComponent } from './logout.component';

// Export this module routes to allow Lazy Loading
export const routes: Routes = [
  {
    path: '',
    component: LogoutComponent
  }
];