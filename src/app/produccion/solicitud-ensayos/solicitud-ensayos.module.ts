import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudEnsayosCreateComponent } from './solicitud-ensayos-create/solicitud-ensayos-create.component';
import { SolicitudEnsayosListComponent } from './solicitud-ensayos-list/solicitud-ensayos-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { SolicitudEnsayosComponent } from './solicitud-ensayos/solicitud-ensayos.component';

@NgModule({
  declarations: [SolicitudEnsayosComponent,
    SolicitudEnsayosCreateComponent,
    SolicitudEnsayosListComponent,    
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
  exports: [SolicitudEnsayosComponent,
    SolicitudEnsayosCreateComponent,
    SolicitudEnsayosListComponent,
  ]
})
export class SolicitudEnsayosModule { }