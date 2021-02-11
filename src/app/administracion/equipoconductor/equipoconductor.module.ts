import { EquipoconductorDeleteComponent } from './equipoconductor-delete/equipoconductor-delete.component';
import { EquipoConductorListComponent } from './equipoconductor-list/equipoconductor-list.component';
import { EquipoConductorDetailComponent } from './equipoconductor-detail/equipoconductor-detail.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipoConductorAdminComponent } from './equipoconductor-admin/equipoconductor-admin.component';
import { EquipoConductorCreateComponent } from './equipoconductor-create/equipoconductor-create.component';
import { EquipoConductorEditComponent } from './equipoconductor-edit/equipoconductor-edit.component';
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
    EquipoConductorAdminComponent,
    EquipoConductorCreateComponent,
    EquipoConductorDetailComponent,
    EquipoConductorEditComponent,
    EquipoConductorListComponent,
    EquipoconductorDeleteComponent,
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
    EquipoConductorAdminComponent,
    EquipoConductorCreateComponent,
    EquipoConductorDetailComponent,
    EquipoConductorEditComponent,
    EquipoConductorListComponent,
    EquipoconductorDeleteComponent,
  ]
})
export class equipoConductorModule { }
