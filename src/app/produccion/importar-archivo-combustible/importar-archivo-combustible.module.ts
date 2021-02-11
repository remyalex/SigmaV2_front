import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportarArchivoCombustibleVehiculoComponent } from './importar-archivo-combustible-vehiculo/importar-archivo-combustible-vehiculo.component';
import { ImportarArchivoCombustibleMaquinariaComponent } from './importar-archivo-combustible-maquinaria/importar-archivo-combustible-maquinaria.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { VehiculoComponent } from './vehiculo/vehiculo.component';
import { MaquinariaComponent } from './maquinaria/maquinaria.component';

@NgModule({
  declarations: [
    ImportarArchivoCombustibleVehiculoComponent,
    ImportarArchivoCombustibleMaquinariaComponent,
    VehiculoComponent,
    MaquinariaComponent,

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
  ],
  entryComponents: [
    ImportarArchivoCombustibleVehiculoComponent,
    ImportarArchivoCombustibleMaquinariaComponent,
    VehiculoComponent,
    MaquinariaComponent,
],
  exports: [
    ImportarArchivoCombustibleVehiculoComponent,
    ImportarArchivoCombustibleMaquinariaComponent,
    VehiculoComponent,
    MaquinariaComponent,
]
})
export class ImportarArchivoCombustibleModule { }
