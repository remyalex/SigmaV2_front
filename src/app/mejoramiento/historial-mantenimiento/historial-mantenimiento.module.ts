import { SeguridadModule } from './../../seguridad/seguridad.module';
import { SharedModule } from './../../shared/shared.module';
import { PipesModule } from './../../theme/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialListComponent } from './historial-list/historial-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DiagnosticoModule } from '../diagnostico/diagnostico.module';
import { WorkflowModule } from 'src/app/workflow/workflow.module';
import { HistorialDetalleComponent } from './historial-detalle/historial-detalle.component';
import { VisitatecnicaverificacionModule } from 'src/app/intervencion/visitatecnicaverificacion/visitatecnicaverificacion.module';
import { HistorialMantenimientoDocumentoComponent } from './historial-mantenimiento-documento/historial-mantenimiento-documento.component';

@NgModule({
  declarations: [
    HistorialListComponent,
    HistorialDetalleComponent,
    HistorialMantenimientoDocumentoComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PipesModule,
    HttpClientModule,
    NgxDatatableModule,
    SharedModule,
    SeguridadModule,
    DiagnosticoModule,
    WorkflowModule,
    VisitatecnicaverificacionModule
  ],
  entryComponents: [
    HistorialDetalleComponent,
    HistorialMantenimientoDocumentoComponent    
  ],
  exports: [
    HistorialDetalleComponent,
    HistorialListComponent,
    HistorialMantenimientoDocumentoComponent    
  ]
})
export class HistorialMantenimientoModule { }
