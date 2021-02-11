import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TarjetaOperacionAdminComponent } from './tarjeta-operacion-admin/tarjeta-operacion-admin.component';
import { TarjetaOperacionListComponent } from './tarjeta-operacion-list/tarjeta-operacion-list.component';
import { TarjetaOperacionCreateComponent } from './tarjeta-operacion-create/tarjeta-operacion-create.component';
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
    TarjetaOperacionAdminComponent,
    TarjetaOperacionListComponent,
    TarjetaOperacionCreateComponent,
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
    TarjetaOperacionListComponent,
    TarjetaOperacionAdminComponent,
    TarjetaOperacionCreateComponent
  ],
  providers: [DatePipe]
})

export class TarjetaOperacionModule { }
