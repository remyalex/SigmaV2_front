import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GESTION_AMBIENTAL_ROUTES } from './gestion-ambiental.routing';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { ConsultarCierreComponent } from './registrar-cierre-ambiental/consultar-cierre/consultar-cierre.component';
import { RegistrarBaniosComponent } from './registrar-banios-portatiles/registrar-banios/registrar-banios.component';
import { RegistrarCierreComponent } from './registrar-cierre-ambiental/registrar-cierre/registrar-cierre.component';
import { RegistrarInspeccionComponent } from './registrar-inspeccion-ambiental/registrar-inspeccion/registrar-inspeccion.component';
import { ConsultarInspeccionComponent } from './registrar-inspeccion-ambiental/consultar-inspeccion/consultar-inspeccion.component';
import { EditarInspeccionComponent } from './registrar-inspeccion-ambiental/editar-inspeccion/editar-inspeccion.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from '../theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SeguridadModule } from '../seguridad/seguridad.module';
// tslint:disable-next-line: max-line-length
import { MantenimientosSeleccionadosAmbientalComponent } from './gestionar-asignacion-residentes-ambientales/mantenimientos-seleccionados-ambiental/mantenimientos-seleccionados-ambiental.component';
// tslint:disable-next-line: max-line-length
import { MantenimientosSeleccionadosSstComponent } from './gestionar-asignacion-residentes-sst/mantenimientos-seleccionados-sst/mantenimientos-seleccionados-sst.component';
// tslint:disable-next-line: max-line-length
import { ConsultarInventarioComponent } from './registrar-inventario-ambiental/consultar-inventario/consultar-inventario.component';
// tslint:disable-next-line: max-line-length
import { ConsultarConsolidadoBanosComponent } from './registrar-banios-portatiles/consultar-consolidado-banos/consultar-consolidado-banos.component';

@NgModule({
  declarations: [
    RegistrarBaniosComponent,
    ConsultarConsolidadoBanosComponent,
    RegistrarInspeccionComponent,
    ConsultarInspeccionComponent,
    EditarInspeccionComponent,
    MantenimientosSeleccionadosAmbientalComponent,
    MantenimientosSeleccionadosSstComponent,
    ConsultarCierreComponent,
    RegistrarCierreComponent,
    ConsultarInventarioComponent,
  ],
  entryComponents: [
    RegistrarBaniosComponent,
    ConsultarConsolidadoBanosComponent,
    ConsultarCierreComponent,
    RegistrarCierreComponent
  ],
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
    MatFormFieldModule,
    SeguridadModule,
    RouterModule.forChild(GESTION_AMBIENTAL_ROUTES)
  ],
  exports: [
    RegistrarBaniosComponent,
    ConsultarConsolidadoBanosComponent,
    ConsultarCierreComponent,
    RegistrarInspeccionComponent,
    ConsultarInspeccionComponent,
    EditarInspeccionComponent,
    MantenimientosSeleccionadosAmbientalComponent,
    MantenimientosSeleccionadosSstComponent,
    RegistrarCierreComponent,
    ConsultarInventarioComponent
  ]
})
export class GestionAmbientalModule { }
