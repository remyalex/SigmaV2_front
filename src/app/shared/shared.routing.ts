import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FotoDiagnosticoPkComponent } from './component/foto-diagnostico-pk/foto-diagnostico-pk.component';

export const SHARED_ROUTES: Routes = [
  {
    path: 'diagnostico/fotos/:pk', component: FotoDiagnosticoPkComponent , data: { breadcrumb: 'Fotos del diagnostico' }
  }
];

@NgModule({
  exports: [RouterModule]
})
export class SharedRoutingModule { }
