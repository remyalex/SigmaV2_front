import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PlanillaOperacionAdminComponent } from './planilla-operacion-admin/planilla-operacion-admin.component';
import { PlanillaOperacionCreateComponent } from './planilla-operacion-create/planilla-operacion-create.component';
import { PlanillaOperacionDetailComponent } from './planilla-operacion-detail/planilla-operacion-detail.component';
import { PlanillaOperacionEditComponent } from './planilla-operacion-edit/planilla-operacion-edit.component';
import { PlanillaOperacionActividadesComponent } from './planilla-operacion-actividades/planilla-operacion-actividades.component';

import { PlanillaOperacionListComponent } from './planilla-operacion-list/planilla-operacion-list.component';
import { PlanillaOperacionDeleteComponent } from './planilla-operacion-delete/planilla-operacion-delete.component';
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
    PlanillaOperacionAdminComponent,
    PlanillaOperacionCreateComponent,
    PlanillaOperacionDetailComponent,
    PlanillaOperacionEditComponent,
    PlanillaOperacionActividadesComponent,
    PlanillaOperacionListComponent,
    PlanillaOperacionDeleteComponent,
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
    PlanillaOperacionListComponent,
    PlanillaOperacionAdminComponent,
    PlanillaOperacionCreateComponent,
    PlanillaOperacionEditComponent,    
    PlanillaOperacionActividadesComponent,
    PlanillaOperacionDetailComponent,
    PlanillaOperacionDeleteComponent,
  ],
  providers: [DatePipe]
})
export class PlanillaOperacionModule { }
