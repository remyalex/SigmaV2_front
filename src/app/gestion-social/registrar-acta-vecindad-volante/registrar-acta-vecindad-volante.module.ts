import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { RegistrarActaVecindadVolanteListComponent } from './registrar-acta-vecindad-volante-list/registrar-acta-vecindad-volante-list.component';
// tslint:disable-next-line: max-line-length
import { RegistrarActaVecindadVolanteEditComponent } from './registrar-acta-vecindad-volante-edit/registrar-acta-vecindad-volante-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
// tslint:disable-next-line: max-line-length
import { RegistrarActaVecindadVolanteCreateComponent } from './registrar-acta-vecindad-volante-create/registrar-acta-vecindad-volante-create.component';
// tslint:disable-next-line: max-line-length
import { RegistrarActaVecindadVolanteAdminComponent } from './registrar-acta-vecindad-volante-admin/registrar-acta-vecindad-volante-admin.component';
import { ActaAficheListComponent } from './acta-afiche-list/acta-afiche-list.component';
import { ActaAficheCreateComponent } from './acta-afiche-create/acta-afiche-create.component';
import { ActaAficheEditComponent } from './acta-afiche-edit/acta-afiche-edit.component';
import { ArchivoActaAficheComponent } from './archivo-acta-afiche/archivo-acta-afiche.component';
import { ActaVolanteListExpComponent } from './acta-volante-list-exp/acta-volante-list-exp.component';
import { ArchivoActaVolanteComponent } from './archivo-acta-volante/archivo-acta-volante.component';

@NgModule({
  declarations: [
    RegistrarActaVecindadVolanteListComponent,
    RegistrarActaVecindadVolanteEditComponent,
    RegistrarActaVecindadVolanteCreateComponent,
    RegistrarActaVecindadVolanteAdminComponent,
    ActaAficheListComponent,  
    ActaAficheCreateComponent,
    ActaAficheEditComponent,
    ArchivoActaAficheComponent,
    ArchivoActaVolanteComponent,
    ActaVolanteListExpComponent
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
    SeguridadModule
  ],
  entryComponents: [
    RegistrarActaVecindadVolanteListComponent,
    RegistrarActaVecindadVolanteEditComponent,
    RegistrarActaVecindadVolanteCreateComponent,
    RegistrarActaVecindadVolanteAdminComponent,
    ActaAficheListComponent,
    ArchivoActaAficheComponent,
    ArchivoActaVolanteComponent,
    ActaVolanteListExpComponent
  ],
  exports: [
    RegistrarActaVecindadVolanteListComponent,
    RegistrarActaVecindadVolanteEditComponent,
    RegistrarActaVecindadVolanteCreateComponent,
    RegistrarActaVecindadVolanteAdminComponent,
    ActaAficheListComponent,
    ArchivoActaAficheComponent,
    ArchivoActaVolanteComponent,
    ActaVolanteListExpComponent
  ]

})
export class RegistrarActaVecindadVolanteModule { }
