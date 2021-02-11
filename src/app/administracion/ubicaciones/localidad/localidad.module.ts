import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalidadAdminComponent } from './localidad-admin/localidad-admin.component';
import { LocalidadCreateComponent } from './localidad-create/localidad-create.component';
import { LocalidadEditComponent } from './localidad-edit/localidad-edit.component';
import { LocalidadDeleteComponent } from './localidad-delete/localidad-delete.component';
import { LocalidadDetailComponent } from './localidad-detail/localidad-detail.component';
import { LocalidadListComponent } from './localidad-list/localidad-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [LocalidadAdminComponent, LocalidadCreateComponent,
    LocalidadEditComponent, LocalidadDeleteComponent, LocalidadDetailComponent, LocalidadListComponent],
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
  ]
})
export class LocalidadModule { }
