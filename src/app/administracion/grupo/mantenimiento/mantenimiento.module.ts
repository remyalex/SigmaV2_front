import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoAdminComponent } from './mantenimiento-admin/mantenimiento-admin.component';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { MantenimientoListComponent } from './mantenimiento-list/mantenimiento-list.component';
import { MantenimientoRemoveComponent } from './mantenimiento-remove/mantenimiento-remove.component';
import { MantenimientoAddComponent } from './mantenimiento-add/mantenimiento-add.component';

@NgModule({
  declarations: [
    MantenimientoAdminComponent,
    MantenimientoListComponent,
    MantenimientoAddComponent,
    MantenimientoRemoveComponent,
  ],
  entryComponents: [
    MantenimientoAddComponent,
    MantenimientoRemoveComponent
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
  exports: [
    MantenimientoAdminComponent
  ]
})
export class MantenimientoModule { }
