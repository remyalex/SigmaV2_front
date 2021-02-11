import { SeguridadModule } from './../../seguridad/seguridad.module';
import { PipesModule } from './../../theme/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { GestionSocialAdelantadaComponent } from './gestion-social-adelantada/gestion-social-adelantada.component';
import { GestionSocialAdelantadaListComponent } from './gestion-social-adelantada-list/gestion-social-adelantada-list.component';
import { GestionSocialAdelantadaEditComponent } from './gestion-social-adelantada-edit/gestion-social-adelantada-edit.component';
import { GestionSocialAdelantadaCreateComponent } from './gestion-social-adelantada-create/gestion-social-adelantada-create.component';

@NgModule({
  declarations: [GestionSocialAdelantadaComponent,
    GestionSocialAdelantadaListComponent,
    GestionSocialAdelantadaCreateComponent,
    GestionSocialAdelantadaEditComponent,
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
  exports: [GestionSocialAdelantadaComponent,
    GestionSocialAdelantadaListComponent,
    GestionSocialAdelantadaCreateComponent,
    GestionSocialAdelantadaEditComponent,
  ]
})
export class GestionSocialAdelantadaModule { }
