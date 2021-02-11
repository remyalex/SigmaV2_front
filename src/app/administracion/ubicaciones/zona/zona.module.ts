import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZonaAdminComponent } from './zona-admin/zona-admin.component';
import { ZonaCreateComponent } from './zona-create/zona-create.component';
import { ZonaEditComponent } from './zona-edit/zona-edit.component';
import { ZonaDetailComponent } from './zona-detail/zona-detail.component';
import { ZonaListComponent } from './zona-list/zona-list.component';
import { ZonaDeleteComponent } from './zona-delete/zona-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [ZonaAdminComponent, ZonaCreateComponent, ZonaEditComponent, ZonaDetailComponent, ZonaListComponent, ZonaDeleteComponent],
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
export class ZonaModule { }
