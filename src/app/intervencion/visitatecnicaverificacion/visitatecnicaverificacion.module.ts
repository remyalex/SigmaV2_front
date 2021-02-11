import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { SeguridadModule } from '../../seguridad/seguridad.module';
import { VisitaVerificacionAdminComponent } from './visita-verificacion-admin/visita-verificacion-admin.component';
import { VisitaVerificacionBasicosComponent } from './visita-verificacion-basicos/visita-verificacion-basicos.component';
import { VisitaVerificacionFotografiasComponent } from './visita-verificacion-fotografias/visita-verificacion-fotografias.component';
import { VisitaVerificacionObservacionesComponent } from './visita-verificacion-observaciones/visita-verificacion-observaciones.component';
import { VisitaVerificacionObsFotoComponent } from './visita-verificacion-obs-foto/visita-verificacion-obs-foto.component';
import { VisitaVerificacionProgramadasComponent } from './visita-verificacion-programadas/visita-verificacion-programadas.component';
import { VisitaVerificacionDisenioComponent } from './visita-verificacion-disenio/visita-verificacion-disenio.component';
import { RegistroEditComponent } from './registro-edit/registro-edit.component';
import { DiagnosticoModule } from '../../mejoramiento/diagnostico/diagnostico.module';
import { VisitaVerificacionFallasComponent } from './visita-verificacion-fallas/visita-verificacion-fallas.component';
import { IntervencionChequeoEditComponent } from './intervencion-chequeo-edit/intervencion-chequeo-edit.component';
import { VisitaVerificacionAdminDetailComponent } from './visita-verificacion-admin-detail/visita-verificacion-admin-detail.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [VisitaVerificacionAdminComponent, VisitaVerificacionBasicosComponent, VisitaVerificacionFotografiasComponent,
    VisitaVerificacionObservacionesComponent, VisitaVerificacionObsFotoComponent, VisitaVerificacionProgramadasComponent,
     VisitaVerificacionDisenioComponent, RegistroEditComponent, VisitaVerificacionFallasComponent, IntervencionChequeoEditComponent,
     VisitaVerificacionAdminDetailComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PipesModule,
    HttpClientModule,
    NgxDatatableModule,
    SharedModule,
    SeguridadModule,
    DiagnosticoModule
  ],
  entryComponents: [
    VisitaVerificacionDisenioComponent,
    RegistroEditComponent
  ],
  exports: [
    VisitaVerificacionAdminComponent, VisitaVerificacionAdminDetailComponent
  ]
})
export class VisitatecnicaverificacionModule { }
