import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipodisponibilidadAdminComponent } from './equipodisponibilidad-admin/equipodisponibilidad-admin.component';
import { EquipodisponibilidadCreateComponent } from './equipodisponibilidad-create/equipodisponibilidad-create.component';
import { EquipodisponibilidadDetailComponent } from './equipodisponibilidad-detail/equipodisponibilidad-detail.component';
import { EquipodisponibilidadEditComponent } from './equipodisponibilidad-edit/equipodisponibilidad-edit.component';
import { EquipodisponibilidadListComponent } from './equipodisponibilidad-list/equipodisponibilidad-list.component';
import { EquipodisponibilidadDeleteComponent } from './equipodisponibilidad-delete/equipodisponibilidad-delete.component';
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
    EquipodisponibilidadAdminComponent,
    EquipodisponibilidadCreateComponent,
    EquipodisponibilidadDetailComponent,
    EquipodisponibilidadEditComponent,
    EquipodisponibilidadListComponent,
    EquipodisponibilidadDeleteComponent,
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
    EquipodisponibilidadListComponent,
    EquipodisponibilidadAdminComponent,
    EquipodisponibilidadCreateComponent,
    EquipodisponibilidadEditComponent,
    EquipodisponibilidadDetailComponent,
    EquipodisponibilidadDeleteComponent,
  ]
})
export class EquipodisponibilidadModule { }
