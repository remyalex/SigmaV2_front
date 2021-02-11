import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UplaAdminComponent } from './upla-admin/upla-admin.component';
import { UplaCreateComponent } from './upla-create/upla-create.component';
import { UplaEditComponent } from './upla-edit/upla-edit.component';
import { UplaDeleteComponent } from './upla-delete/upla-delete.component';
import { UplaListComponent } from './upla-list/upla-list.component';
import { UplaDetailComponent } from './upla-detail/upla-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [UplaAdminComponent, UplaCreateComponent, UplaEditComponent, UplaDeleteComponent, UplaListComponent, UplaDetailComponent],
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
export class UplaModule { }
