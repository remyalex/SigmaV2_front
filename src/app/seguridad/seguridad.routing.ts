import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

export const SEGURIDAD_ROUTES: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'logout', component: LogoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(SEGURIDAD_ROUTES)],
  exports: [RouterModule]
})
export class SeguridadRouting { }
