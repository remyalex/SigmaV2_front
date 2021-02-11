import { GestionarRadicadosPqrsfdModule } from './gestionar-radicados-pqrsfd/gestionar-radicados-pqrsfd.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionSocialRouting, GESTION_SOCIAL_ROUTES } from './gestion-social.routing';
import { RouterModule } from '@angular/router';
import { RegistrarActaVecindadVolanteModule } from './registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.module';
import { ActasVecindadModule } from './actas-vecindad/actas-vecindad.module';
import { ACTAS_VECINDAD_ROUTES } from './actas-vecindad/actas-vecindad.routing.module';
import { AprobarActasModule } from './aprobar-actas-vecindad/aprobar-actas.module';
import { EncuestaSatisfaccionModule } from './encuesta-satisfaccion/encuesta-satisfaccion.module';
// tslint:disable-next-line: max-line-length
import { MantenimientosSeleccionadosComponent } from './asignar-residente-social/mantenimientos-seleccionados/mantenimientos-seleccionados.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from '../theme/pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';
import { SeguridadModule } from '../seguridad/seguridad.module';
import { AprobarActasListComponent } from './aprobar-actas-vecindad/aprobar-actas-list/aprobar-actas-list.component';
import { AprobarActasAproveComponent } from './aprobar-actas-vecindad/aprobar-actas-aprove/aprobar-actas-aprove.component';

@NgModule({
  declarations: [MantenimientosSeleccionadosComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    RegistrarActaVecindadVolanteModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PipesModule,
    SharedModule,
    SeguridadModule,
    ActasVecindadModule,
    AprobarActasModule,
    EncuestaSatisfaccionModule,
    GestionarRadicadosPqrsfdModule,
    RouterModule.forChild(GESTION_SOCIAL_ROUTES),
  ],
  exports: [
    MantenimientosSeleccionadosComponent,
    AprobarActasListComponent,
    AprobarActasAproveComponent
  ]
})
export class GestionSocialModule { }