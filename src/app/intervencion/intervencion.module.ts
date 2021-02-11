import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipesModule } from '../theme/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { RouterModule } from '@angular/router';
import { INTERVENCION_ROUTES } from './intervencion.routing';
import { VerificarProgramacionComponent } from './programar-visita/verificar-programacion/verificar-programacion.component';
import { VerProgramacionComponent } from './programar-visita/ver-programacion/ver-programacion.component';
import { ResumenDirectorObraComponent } from './programar-visita/resumen-director-obra/resumen-director-obra.component';
import { DiagnosticoModule } from '../mejoramiento/diagnostico/diagnostico.module';
import { FotosComponent } from './shared/fotos/fotos.component';
// tslint:disable-next-line: max-line-length
import { IntervencionChequeoEditComponent } from './visitatecnicaverificacion/intervencion-chequeo-edit/intervencion-chequeo-edit.component';
import { MejoramientoModule } from '../mejoramiento/mejoramiento.module';
import { DisenioInformacionModule } from '../mejoramiento/disenio-informacion/disenio-informacion.module';
import { DisenioModule } from '../mejoramiento/disenio/disenio.module';
import { PredisenioModule } from '../mejoramiento/predisenio/predisenio.module';
import { ConsultarProgramacionModule } from './consultarProgramacionPeriodica/consultar-programacion.module';
import { FiltrosComponent } from './tablero-control-infomacion-sig/filtros/filtros.component';
import { ConProgDiariaTrabajoListComponent } from './programacion-diaria-trabajo/consolidado.component';
import { ArrayTableComponent } from '../shared/component/sg-array-table/sg-array-table.component';
import { ObjectFormComponent } from '../shared/component/sg-object-form/sg-object-form.component';

@NgModule({
  declarations: [
    VerProgramacionComponent,
    ResumenDirectorObraComponent,
    VerificarProgramacionComponent,
    FotosComponent,
    FiltrosComponent,
    // Componentes para la programación diaria de trabajo
    ConProgDiariaTrabajoListComponent,
//    ArrayTableComponent,
//    ObjectFormComponent,
//    EditableArrayTableComponent,

  ],
  entryComponents: [
    VerProgramacionComponent,
    ResumenDirectorObraComponent,
    VerificarProgramacionComponent,
    FotosComponent,
    IntervencionChequeoEditComponent,
  ],
  exports: [
    VerProgramacionComponent,
    ResumenDirectorObraComponent,
    VerificarProgramacionComponent,
  ],
  imports: [
    BrowserAnimationsModule,
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
    RouterModule.forChild(INTERVENCION_ROUTES),
    DiagnosticoModule,
    DisenioInformacionModule,
    PredisenioModule,
    ConsultarProgramacionModule,
    DisenioModule,
  ]
})
export class IntervencionModule { }
