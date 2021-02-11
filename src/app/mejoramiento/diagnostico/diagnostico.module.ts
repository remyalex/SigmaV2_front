import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerDiagnosticoComponent } from './ver-diagnostico/ver-diagnostico.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EditarDiagnosticoComponent } from './editar-diagnostico/editar-diagnostico.component';

@NgModule({
  declarations: [
    VerDiagnosticoComponent,
    EditarDiagnosticoComponent
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
  ],
  entryComponents: [
    VerDiagnosticoComponent,
    EditarDiagnosticoComponent
  ],
  exports: [
    VerDiagnosticoComponent,
    EditarDiagnosticoComponent
  ]
})
export class DiagnosticoModule { }
