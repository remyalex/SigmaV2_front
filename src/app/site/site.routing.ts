import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteHomeComponent } from './site-home/site-home.component';


export const SITE_ROUTES: Routes = [
  {
    path: 'home', component: SiteHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(SITE_ROUTES)],
  exports: [RouterModule]
})
export class SiteRouting { }
