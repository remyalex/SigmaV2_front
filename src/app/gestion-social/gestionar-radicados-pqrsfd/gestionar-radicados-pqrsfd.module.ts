import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { GestionarRadicadosPqrsfdComponent } from '../gestionar-radicados-pqrsfd/gestionar-radicados-pqrsfd/gestionar-radicados-pqrsfd.component';

@NgModule({
  declarations: [
    GestionarRadicadosPqrsfdComponent,
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
    SeguridadModule
  ],
  exports: [
    GestionarRadicadosPqrsfdComponent,
  ]

})
export class GestionarRadicadosPqrsfdModule { }
