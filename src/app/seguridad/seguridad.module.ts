import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../theme/layout/base/base.component';
import { LoginModule } from './login/login.module';
import { httpInterceptorProviders } from './interceptors/auth-interceptor';
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './logout/logout.component';
import { IsGrantedDirective } from './directives/isgranted.directive';


@NgModule({
  declarations: [
    IsGrantedDirective,
    LogoutComponent],
  imports: [
    CommonModule,
    LoginModule,
    HttpClientModule
  ],
  exports: [IsGrantedDirective],
  bootstrap: [BaseComponent],
  providers: [
    httpInterceptorProviders
  ]
})
export class SeguridadModule { }
