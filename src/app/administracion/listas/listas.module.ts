import { ListasCofirmComponent } from './listas-confirm/listas-confirm.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListasAdminComponent } from './listas-admin/listas-admin.component';
import { ListasEditComponent } from './listas-edit/listas-edit.component';
import { ListasDetailComponent } from './listas-detail/listas-detail.component';
import { ListasListComponent } from './listas-list/listas-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';

import { ListasCreateComponent } from './listas-create/listas-create.component';
import { ListasDeleteComponent } from './listas-delete/listas-delete.component';
// import { ListasItemsListComponent } from '../listas-items/listas-items-list/listas-items-list.component';
import { ListasItemsAdminComponent } from '../listas-items/listas-items-admin/listas-items-admin.component';
import { ListasItemsCreateComponent } from '../listas-items/listas-items-create/listas-items-create.component';
import { ListasItemsEditComponent } from '../listas-items/listas-items-edit/listas-items-edit.component';
import { ListasItemsDetailComponent } from '../listas-items/listas-items-detail/listas-items-detail.component';
import { ListasItemsDeleteComponent } from '../listas-items/listas-items-delete/listas-items-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';


@NgModule({
  
  declarations: [
    ListasAdminComponent,
    ListasCreateComponent, 
    ListasEditComponent, 
    ListasDetailComponent, 
    ListasListComponent, 
    ListasDeleteComponent,
    // ListasItemsListComponent,
    // ListasItemsAdminComponent,
    // ListasItemsCreateComponent,
    // ListasItemsEditComponent,
    // ListasItemsDetailComponent,
    // ListasItemsDeleteComponent,
    ListasCofirmComponent,
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
    ListasAdminComponent,
    ListasDetailComponent,
    ListasCreateComponent,
    ListasEditComponent,
    ListasListComponent,
    ListasDeleteComponent,
    // ListasItemsListComponent,
    // ListasItemsAdminComponent,
    // ListasItemsCreateComponent,
    // ListasItemsEditComponent,
    // ListasItemsDetailComponent,
    // ListasItemsDeleteComponent,
    ListasCofirmComponent
  ],
  providers: [ExcelService]
})
export class ListasModule { }
