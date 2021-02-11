import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuadranteAdminComponent } from './cuadrante-admin/cuadrante-admin.component';
import { CuadranteCreateComponent } from './cuadrante-create/cuadrante-create.component';
import { CuadranteEditComponent } from './cuadrante-edit/cuadrante-edit.component';
import { CuadranteDeleteComponent } from './cuadrante-delete/cuadrante-delete.component';
import { CuadranteListComponent } from './cuadrante-list/cuadrante-list.component';
import { CuadranteDetailComponent } from './cuadrante-detail/cuadrante-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [CuadranteAdminComponent, CuadranteCreateComponent, CuadranteEditComponent,
    CuadranteDeleteComponent, CuadranteListComponent, CuadranteDetailComponent],
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
export class CuadranteModule { }
