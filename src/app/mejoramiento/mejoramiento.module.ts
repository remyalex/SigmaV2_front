import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MEJORAMIENTO_ROUTES } from './mejoramiento.routing';
import { HistorialMantenimientoModule } from './historial-mantenimiento/historial-mantenimiento.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';


@NgModule({
  declarations: [],
  imports: [
    HistorialMantenimientoModule,
    DiagnosticoModule,
    CommonModule,
    RouterModule.forChild(MEJORAMIENTO_ROUTES)
  ],
  exports: [
  ]
})
export class MejoramientoModule { }
