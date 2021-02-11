import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarrioAdminComponent } from './barrio-admin/barrio-admin.component';
import { BarrioCreateComponent } from './barrio-create/barrio-create.component';
import { BarrioEditComponent } from './barrio-edit/barrio-edit.component';
import { BarrioDeleteComponent } from './barrio-delete/barrio-delete.component';
import { BarrioDetailComponent } from './barrio-detail/barrio-detail.component';
import { BarrioListComponent } from './barrio-list/barrio-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [BarrioAdminComponent, BarrioCreateComponent,
     BarrioEditComponent, BarrioDeleteComponent, BarrioDetailComponent, BarrioListComponent],
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
export class BarrioModule { }
