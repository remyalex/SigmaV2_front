import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResgistroMezclaInsumosCreateComponent } from './registro-mezcla-insumos-create/registro-mezcla-insumos-create.component';
import { ResgistroMezclaInsumosListComponent } from './registro-mezcla-insumos-list/registro-mezcla-insumos-list.component';
import { ResgistroMezclaInsumosSolicitudesComponent } from './registro-mezcla-insumos-solicitudes/registro-mezcla-insumos-solicitudes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { RegistroMezclaInsumoComponent } from './registro-mezcla-insumos/registro-mezcla-insumos.component';
import { RegistroMezclaInsumosEditComponent } from './registro-mezcla-insumos-edit/registro-mezcla-insumos-edit.component';
import { RegistroMezclaInsumosDetalleComponent } from './registro-mezcla-insumos-detalle/registro-mezcla-insumos-detalle.component';
import { RegistroMezclaInsumosDeleteComponent } from './registro-mezcla-insumos-delete/registro-mezcla-insumos-delete.component';


@NgModule({
  declarations: [RegistroMezclaInsumoComponent,
    ResgistroMezclaInsumosCreateComponent,
    ResgistroMezclaInsumosListComponent,
    ResgistroMezclaInsumosSolicitudesComponent,
    RegistroMezclaInsumosEditComponent,
    RegistroMezclaInsumosDetalleComponent,
    RegistroMezclaInsumosDeleteComponent    
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
  exports: [RegistroMezclaInsumoComponent,
    ResgistroMezclaInsumosCreateComponent,
    ResgistroMezclaInsumosListComponent,
    ResgistroMezclaInsumosSolicitudesComponent,
    RegistroMezclaInsumosEditComponent,
    RegistroMezclaInsumosDetalleComponent,
    RegistroMezclaInsumosDeleteComponent
  ]
})
export class RegistroMezclaInsumosModule { }