import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignarConductoresMaquinariaCreateComponent } from './asignar-conductores-maquinaria-create/asignar-conductores-maquinaria-create.component';
import { AsignarConductoresMaquinariaListComponent } from './asignar-conductores-maquinaria-list/asignar-conductores-maquinaria-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { AsignarConductoresMaquinariaComponent } from './asignar-conductores-maquinaria/asignar-conductores-maquinaria.component';
import { AsignarConductoresMaquinariaEditComponent } from './asignar-conductores-maquinaria-edit/asignar-conductores-maquinaria-edit.component';
import { AsignarConductoresMaquinariaDetalleComponent } from './asignar-conductores-maquinaria-detalle/asignar-conductores-maquinaria-detalle.component';
import { AsignarConductoresMaquinariaDeleteComponent } from './asignar-conductores-maquinaria-delete/asignar-conductores-maquinaria-delete.component';


@NgModule({
  declarations: [AsignarConductoresMaquinariaComponent,
    AsignarConductoresMaquinariaCreateComponent,
    AsignarConductoresMaquinariaListComponent,
    AsignarConductoresMaquinariaEditComponent,
    AsignarConductoresMaquinariaDetalleComponent,
    AsignarConductoresMaquinariaDeleteComponent,
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
  exports: [AsignarConductoresMaquinariaComponent,
    AsignarConductoresMaquinariaCreateComponent,
    AsignarConductoresMaquinariaListComponent,
    AsignarConductoresMaquinariaEditComponent,
    AsignarConductoresMaquinariaDetalleComponent,
    AsignarConductoresMaquinariaDeleteComponent,
  ]
})
export class AsignarConductoresMaquinariaModule { }