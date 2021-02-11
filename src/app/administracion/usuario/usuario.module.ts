import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioAdminComponent } from './usuario-admin/usuario-admin.component';
import { UsuarioCreateComponent } from './usuario-create/usuario-create.component';
import { UsuarioDetailComponent } from './usuario-detail/usuario-detail.component';
import { UsuarioEditComponent } from './usuario-edit/usuario-edit.component';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioDeleteComponent } from './usuario-delete/usuario-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { UsuarioConfirmComponent } from './usuario-confirm/usuario-confirm.component';
import { UsuarioChangePasswordComponent } from './usuario-change-password/usuario-change-password.component';

@NgModule({
  declarations: [
    UsuarioAdminComponent,
    UsuarioCreateComponent,
    UsuarioDetailComponent,
    UsuarioEditComponent,
    UsuarioListComponent,
    UsuarioDeleteComponent,
    UsuarioConfirmComponent,
    UsuarioChangePasswordComponent,
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
    UsuarioListComponent,
    UsuarioAdminComponent,
    UsuarioCreateComponent,
    UsuarioEditComponent,
    UsuarioDetailComponent,
    UsuarioDeleteComponent,
    UsuarioConfirmComponent,
    UsuarioChangePasswordComponent,
  ]
})
export class UsuarioModule { }
