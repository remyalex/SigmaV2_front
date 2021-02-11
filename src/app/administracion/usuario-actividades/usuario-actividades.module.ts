import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { UsuarioActividadesAdminComponent } from './usuario-actividades-admin/usuario-actividades-admin.component';
import { UsuarioActividadesListComponent } from './usuario-actividades-list/usuario-actividades-list.component';

@NgModule({

  declarations: [
    UsuarioActividadesAdminComponent,
    UsuarioActividadesListComponent,
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
    UsuarioActividadesAdminComponent,
    UsuarioActividadesListComponent,
  ],
  providers: [ExcelService]
})

export class UsuarioActividadesModule { }