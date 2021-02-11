import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoModule } from 'src/app/mejoramiento/mantenimiento/mantenimiento.module';
import { RouterModule } from '@angular/router';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ADMINISTRACION_GESTIONARPROCESOS_ROUTES } from './gestionarprocesos.routing';
import { GestionarprocesosAdminComponent } from './gestionarprocesos-admin/gestionarprocesos-admin.component';
import { GestionarprocesosListComponent } from './gestionarprocesos-list/gestionarprocesos-list.component';
import { GestionarprocesosEditComponent } from './gestionarprocesos-edit/gestionarprocesos-edit.component';
import { MantenimientoinfoComponent } from './mantenimientoinfo/mantenimientoinfo.component';
import { AccionesComponent } from './acciones/acciones.component';
import { DocumentosProcesoComponent } from './documentos-proceso/documentos-proceso.component';

@NgModule({
  declarations: [
    GestionarprocesosAdminComponent,
    GestionarprocesosListComponent,
    GestionarprocesosEditComponent,
    MantenimientoinfoComponent,
    AccionesComponent,
    DocumentosProcesoComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PipesModule,
    HttpClientModule,
    NgxDatatableModule,
    SharedModule,
    SeguridadModule,
    RouterModule.forChild(ADMINISTRACION_GESTIONARPROCESOS_ROUTES),
    MantenimientoModule,
  ],
  entryComponents: [
    GestionarprocesosEditComponent,
    MantenimientoinfoComponent
  ]
})
export class GestionarprocesosModule { }
