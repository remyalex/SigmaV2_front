import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PersonalPlantaAdminComponent } from './personal-planta-admin/personal-planta-admin.component';
import { PersonalPlantaCreateComponent } from './personal-planta-create/personal-planta-create.component';
import { PersonalPlantaDetailComponent } from './personal-planta-detail/personal-planta-detail.component';
import { PersonalPlantaEditComponent } from './personal-planta-edit/personal-planta-edit.component';
import { PersonalPlantaActividadesComponent } from './personal-planta-actividades/personal-planta-actividades.component';
import { PersonalPlantaListComponent } from './personal-planta-list/personal-planta-list.component';
import { PersonalPlantaDeleteComponent } from './personal-planta-delete/personal-planta-delete.component';
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
    PersonalPlantaAdminComponent,
    PersonalPlantaCreateComponent,
    PersonalPlantaDetailComponent,
    PersonalPlantaEditComponent,
    PersonalPlantaActividadesComponent,
    PersonalPlantaListComponent,
    PersonalPlantaDeleteComponent,
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
    PersonalPlantaListComponent,
    PersonalPlantaAdminComponent,
    PersonalPlantaCreateComponent,
    PersonalPlantaEditComponent,    
    PersonalPlantaActividadesComponent,
    PersonalPlantaDetailComponent,
    PersonalPlantaDeleteComponent,
  ],
  providers: [DatePipe]
})
export class PersonalPlantaModule { }
