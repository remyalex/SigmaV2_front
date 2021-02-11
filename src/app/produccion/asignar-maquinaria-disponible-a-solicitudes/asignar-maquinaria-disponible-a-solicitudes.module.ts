import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignarMaquinariaAdminComponent } from './asignar-maquinaria-admin/asignar-maquinaria-admin.component';
import { RouterModule } from '@angular/router';
import { PRODUCCION_ROUTER_ASIGNAR_MAQUINARIA_DISPONIBLE_A_SOLICITUD } from './asignar-maquinaria-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';

@NgModule({
  declarations: [AsignarMaquinariaAdminComponent, ConfirmacionComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterModule.forChild(PRODUCCION_ROUTER_ASIGNAR_MAQUINARIA_DISPONIBLE_A_SOLICITUD)
  ],
  exports: [
    AsignarMaquinariaAdminComponent,
    ConfirmacionComponent
  ]
})
export class AsignarMaquinariaDisponibleASolicitudesModule { }
