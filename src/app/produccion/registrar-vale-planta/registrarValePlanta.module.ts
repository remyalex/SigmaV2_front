import { RegistrarValePlantaAttachComponent } from './registrar-vale-planta-attach/registrar-vale-planta-attach.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { RegistrarValePlantaAdminComponent } from './registrar-vale-planta-admin/registrar-vale-planta-admin.component';
import { RegistrarValePlantaCreateComponent } from './registrar-vale-planta-create/registrar-vale-planta-create.component';
import { RegistrarValePlantaDetailComponent } from './registrar-vale-planta-detail/registrar-vale-planta-detail.component';
import { RegistrarValePlantaEditComponent } from './registrar-vale-planta-edit/registrar-vale-planta-edit.component';
import { RegistrarValePlantaListComponent } from './registrar-vale-planta-list/registrar-vale-planta-list.component';
import { RegistrarValePlantaDeleteComponent } from './registrar-vale-planta-delete/registrar-vale-planta-delete.component';

@NgModule({
  declarations: [
    RegistrarValePlantaAdminComponent,
    RegistrarValePlantaCreateComponent,
    RegistrarValePlantaDetailComponent,
    RegistrarValePlantaEditComponent,
    RegistrarValePlantaListComponent,
    RegistrarValePlantaDeleteComponent,
    RegistrarValePlantaAttachComponent,
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
    RegistrarValePlantaListComponent,
    RegistrarValePlantaAdminComponent,
    RegistrarValePlantaCreateComponent,
    RegistrarValePlantaEditComponent,
    RegistrarValePlantaDetailComponent,
    RegistrarValePlantaDeleteComponent,
  ]
})
export class RegistrarValePlantaModule { }
