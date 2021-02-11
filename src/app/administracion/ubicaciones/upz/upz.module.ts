import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpzAdminComponent } from './upz-admin/upz-admin.component';
import { UpzCreateComponent } from './upz-create/upz-create.component';
import { UpzEditComponent } from './upz-edit/upz-edit.component';
import { UpzDeleteComponent } from './upz-delete/upz-delete.component';
import { UpzListComponent } from './upz-list/upz-list.component';
import { UpzDetailComponent } from './upz-detail/upz-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [UpzAdminComponent, UpzCreateComponent, UpzEditComponent, UpzDeleteComponent, UpzListComponent, UpzDetailComponent],
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
export class UpzModule { }
