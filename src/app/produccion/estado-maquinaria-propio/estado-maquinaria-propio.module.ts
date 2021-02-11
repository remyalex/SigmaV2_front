import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EstadoMaquinariaPropioAdminComponent } from './estado-maquinaria-propio-admin/estado-maquinaria-propio-admin.component';
import { EstadoMaquinariaPropioListComponent } from './estado-maquinaria-propio-list/estado-maquinaria-propio-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [
    EstadoMaquinariaPropioAdminComponent,
    EstadoMaquinariaPropioListComponent,
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
  exports: [
    EstadoMaquinariaPropioListComponent,
    EstadoMaquinariaPropioAdminComponent,

  ],
  providers: [DatePipe]
})

export class EstadoMaquinariaPropioModule { }
