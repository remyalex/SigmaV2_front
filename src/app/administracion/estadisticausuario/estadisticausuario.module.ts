import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { EstadisticaUsuarioDetailComponent } from './estadistica-usuario-detail/estadistica-usuario-detail.component';
import { EstadisticaUsuarioDetailWidgetComponent } from './estadistica-usuario-detail-widget/estadistica-usuario-detail-widget.component';

@NgModule({
  declarations: [
    EstadisticaUsuarioDetailComponent,
    EstadisticaUsuarioDetailWidgetComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    PipesModule,
    HttpClientModule,
    SharedModule,
    SeguridadModule,
  ],
  exports: [
    EstadisticaUsuarioDetailComponent,
    EstadisticaUsuarioDetailWidgetComponent
  ]
})
export class EstadisticausuarioModule { }
