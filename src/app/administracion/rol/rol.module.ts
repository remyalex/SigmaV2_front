import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolAdminComponent } from './rol-admin/rol-admin.component';
import { RolCreateComponent } from './rol-create/rol-create.component';
import { RolDetailComponent } from './rol-detail/rol-detail.component';
import { RolEditComponent } from './rol-edit/rol-edit.component';
import { RolListComponent } from './rol-list/rol-list.component';
import { RolDeleteComponent } from './rol-delete/rol-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [RolAdminComponent,
    RolCreateComponent,
    RolDetailComponent,
    RolEditComponent,
    RolListComponent,
    RolDeleteComponent,
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
  exports: [RolListComponent, RolAdminComponent,
    RolCreateComponent,
    RolEditComponent,
    RolDetailComponent,
    RolDeleteComponent
  ]
})
export class RolModule { }
