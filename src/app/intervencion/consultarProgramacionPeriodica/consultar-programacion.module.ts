import { ConsultarListComponent } from './consultar-list/consultar-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { DiagnosticoModule } from 'src/app/mejoramiento/diagnostico/diagnostico.module';
import { WorkflowModule } from 'src/app/workflow/workflow.module';
import { ConsultaTotalesComponent } from './consulta-totales/consulta-totales.component';
import { ConsultarViewComponent } from './consultar-view/consultar-view.component';

@NgModule({
    declarations: [
        ConsultarListComponent,
        ConsultaTotalesComponent,
        ConsultarViewComponent
    ],
    entryComponents: [
        ConsultarListComponent,
        ConsultarViewComponent
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
        SeguridadModule
    ],
    exports: [
        ConsultarListComponent
    ]

})
export class ConsultarProgramacionModule { }