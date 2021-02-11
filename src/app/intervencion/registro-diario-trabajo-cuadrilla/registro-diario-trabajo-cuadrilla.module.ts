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
import { DiagnosticoModule } from '../../mejoramiento/diagnostico/diagnostico.module';
import { WorkCuadrillaAdminComponent } from './work-cuadrilla-admin/work-cuadrilla-admin.component';
import { WorkCuadrillaGeneralComponent } from './work-cuadrilla-general/work-cuadrilla-general.component';
import { WorkCuadrillaObraComponent } from './work-cuadrilla-obra/work-cuadrilla-obra.component';
import { WorkCuadrillaPersonalComponent } from './work-cuadrilla-personal/work-cuadrilla-personal.component';
import { PersonalCreateComponent } from './work-cuadrilla-personal/personal-create/personal-create.component';
import { PersonalEditComponent } from './work-cuadrilla-personal/personal-edit/personal-edit.component';
import { WorkCuadrillaMaterialComponent } from './work-cuadrilla-material/work-cuadrilla-material.component';
import { MaterialCreateComponent } from './work-cuadrilla-material/material-create/material-create.component';
import { MaterialEditComponent } from './work-cuadrilla-material/material-edit/material-edit.component';
import { WorkCuadrillaPetreosRapComponent } from './work-cuadrilla-petreos-rap/work-cuadrilla-petreos-rap.component';
import { PetreosRapCreateComponent } from './work-cuadrilla-petreos-rap/petreos-rap-create/petreos-rap-create.component';
import { PetreosRapEditComponent } from './work-cuadrilla-petreos-rap/petreos-rap-edit/petreos-rap-edit.component';
import { WorkCuadrillaEquipoComponent } from './work-cuadrilla-equipo/work-cuadrilla-equipo.component';
import { EquipoCreateComponent } from './work-cuadrilla-equipo/equipo-create/equipo-create.component';
import { EquipoEditComponent } from './work-cuadrilla-equipo/equipo-edit/equipo-edit.component';
import { WorkCuadrillaRetiroComponent } from './work-cuadrilla-retiro/work-cuadrilla-retiro.component';
import { RetiroCreateComponent } from './work-cuadrilla-retiro/retiro-create/retiro-create.component'; 
import { RetiroEditComponent } from './work-cuadrilla-retiro/retiro-edit/retiro-edit.component';
import { WorkCuadrillaCalidadComponent } from './work-cuadrilla-calidad/work-cuadrilla-calidad.component';
import { CalidadCreateComponent } from './work-cuadrilla-calidad/calidad-create/calidad-create.component';
import { CalidadEditComponent } from './work-cuadrilla-calidad/calidad-edit/calidad-edit.component';
import { WorkCuadrillaObservacionesComponent } from './work-cuadrilla-observaciones/work-cuadrilla-observaciones.component';
import { ObservacionesCreateComponent } from './work-cuadrilla-observaciones/observaciones-create/observaciones-create.component';
import { ObservacionesEditComponent } from './work-cuadrilla-observaciones/observaciones-edit/observaciones-edit.component';
import { WorkCuadrillaAprobacionComponent } from './work-cuadrilla-aprobacion/work-cuadrilla-aprobacion.component';



@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [WorkCuadrillaAdminComponent, WorkCuadrillaGeneralComponent, WorkCuadrillaObraComponent, WorkCuadrillaPersonalComponent, PersonalCreateComponent, PersonalEditComponent, WorkCuadrillaMaterialComponent, MaterialCreateComponent, MaterialEditComponent, WorkCuadrillaPetreosRapComponent, PetreosRapCreateComponent, PetreosRapEditComponent, WorkCuadrillaEquipoComponent, EquipoCreateComponent, EquipoEditComponent, WorkCuadrillaRetiroComponent, RetiroCreateComponent, RetiroEditComponent, WorkCuadrillaCalidadComponent, CalidadCreateComponent, CalidadEditComponent, WorkCuadrillaObservacionesComponent, ObservacionesCreateComponent, ObservacionesEditComponent, WorkCuadrillaAprobacionComponent],
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
  // tslint:disable-next-line: max-line-length
  entryComponents: [PersonalCreateComponent, PersonalEditComponent, MaterialCreateComponent, MaterialEditComponent, PetreosRapCreateComponent, PetreosRapEditComponent, EquipoCreateComponent, EquipoEditComponent, RetiroCreateComponent, RetiroEditComponent, CalidadCreateComponent, CalidadEditComponent, ObservacionesCreateComponent, ObservacionesEditComponent],
  exports: [WorkCuadrillaAdminComponent]
})
export class RegistroDiarioTrabajoCuadrillaModule { }
