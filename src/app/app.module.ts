// @angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Cache interceptor
import { CacheInterceptor } from './shared/cache.interceptor';
import { AuthorizationInterceptor } from './shared/authorization.interceptor';
import { RoutesDispatcherComponent } from './routes-dispatcher/routes-dispatcher.component';


@NgModule({
  declarations: [
    AppComponent,
    RoutesDispatcherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
