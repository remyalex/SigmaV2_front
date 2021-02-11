import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ListasItemsListComponent } from './listas-items-list/listas-items-list.component';
import { ListasItemsAdminComponent } from './listas-items-admin/listas-items-admin.component';
import { ListasItemsCreateComponent } from './listas-items-create/listas-items-create.component';
import { ListasItemsEditComponent } from './listas-items-edit/listas-items-edit.component';
import { ListasItemsDetailComponent } from './listas-items-detail/listas-items-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListasItemsDeleteComponent } from './listas-items-delete/listas-items-delete.component';


@NgModule({
  declarations: [ListasItemsListComponent, ListasItemsAdminComponent, ListasItemsCreateComponent, ListasItemsEditComponent, ListasItemsDetailComponent,ListasItemsDeleteComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,     
    FormsModule, 
    ReactiveFormsModule,
    PerfectScrollbarModule, 
    PipesModule,
    HttpClientModule,
    NgxDatatableModule,
    SharedModule
  ],
  exports: [ListasItemsListComponent, ListasItemsAdminComponent, ListasItemsCreateComponent, ListasItemsEditComponent, ListasItemsDetailComponent,ListasItemsDeleteComponent]
})
export class ListasItemsModule { }
