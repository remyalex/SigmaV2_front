import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipocalendarioAdminComponent } from './equipocalendario-admin/equipocalendario-admin.component';
import { EquipocalendarioCreateComponent } from './equipocalendario-create/equipocalendario-create.component';
import { EquipocalendarioDetailComponent } from './equipocalendario-detail/equipocalendario-detail.component';
import { EquipocalendarioEditComponent } from './equipocalendario-edit/equipocalendario-edit.component';
import { EquipocalendarioListComponent } from './equipocalendario-list/equipocalendario-list.component';
import { EquipocalendarioDeleteComponent } from './equipocalendario-delete/equipocalendario-delete.component';
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
  declarations: [
    EquipocalendarioAdminComponent,
    EquipocalendarioCreateComponent,
    EquipocalendarioDetailComponent,
    EquipocalendarioEditComponent,
    EquipocalendarioListComponent,
    EquipocalendarioDeleteComponent,
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
    EquipocalendarioListComponent,
    EquipocalendarioAdminComponent,
    EquipocalendarioCreateComponent,
    EquipocalendarioEditComponent,
    EquipocalendarioDetailComponent,
    EquipocalendarioDeleteComponent,
  ]
})
export class EquipocalendarioModule { }
