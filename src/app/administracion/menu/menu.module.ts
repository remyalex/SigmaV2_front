import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { MenuCreateComponent } from './menu-create/menu-create.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { MenuEditComponent } from './menu-edit/menu-edit.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuDeleteComponent } from './menu-delete/menu-delete.component';
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
  declarations: [MenuAdminComponent,
    MenuCreateComponent,
    MenuDetailComponent,
    MenuEditComponent,
    MenuListComponent,
    MenuDeleteComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PipesModule,
    HttpClientModule,
    NgxDatatableModule,
    SharedModule,
    SeguridadModule,
  ],
  exports: [MenuListComponent, MenuAdminComponent,
    MenuCreateComponent,
    MenuEditComponent,
    MenuDetailComponent,
    MenuDeleteComponent,
    MatInputModule, MatFormFieldModule
  ]
})
export class MenuModule { }
