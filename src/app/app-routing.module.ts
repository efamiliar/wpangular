// @angular modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Routes dispatcher component
import { RoutesDispatcherComponent } from './routes-dispatcher/routes-dispatcher.component';


// Routes with Lazy Load
const routes: Routes = [
  {
  path: '',
  pathMatch: 'full',
  loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
  path: 'login',
  loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
  path: 'logout',
  loadChildren: () => import('./logout/logout.module').then(m => m.LogoutModule)
  },
  {
  path: 'wp-angular/view-post/:id',
  loadChildren: () => import('./view-post/view-post.module').then(m => m.ViewPostModule)
  },
  {
  path: 'wp-angular/view-page/:id',
  loadChildren: () => import('./view-page/view-page.module').then(m => m.ViewPageModule)
  },

  // Catchall route that will be handled by RoutesDispatcherComponent
  {
  path: '**',
  component: RoutesDispatcherComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
