import { ProduccionModule } from './produccion/produccion.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdministracionModule } from './administracion/administracion.module';
import { routes } from './app.service';
import { WorkflowModule } from './workflow/workflow.module';
import { GestionSocialModule } from './gestion-social/gestion-social.module';

@NgModule({
  imports: [
    AdministracionModule,
    ProduccionModule,
    GestionSocialModule,
    WorkflowModule,
    GestionSocialModule,
    RouterModule.forRoot(routes)
  ],

  exports: [RouterModule]
})
export class AppRoutingModule {
}
