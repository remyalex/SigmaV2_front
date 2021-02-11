import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleDialogComponent } from './schedule/schedule-dialog/schedule-dialog.component';
import localeEsCo from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { VisModule } from '../../../node_modules/ngx-vis';

registerLocaleData(localeEsCo);

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

import { SigmaListComponent } from './sigma-list/sigma-list.component';
import { SigmaGeneralListComponent } from './sigma-general-list/sigma-general-list.component';
import { SigmaDetailComponent } from './sigma-detail/sigma-detail.component';
import { SigmaAutocompleteComponent } from './sigma-autocomplete/sigma-autocomplete.component';
import { SigmaConfirmComponent } from './sigma-confirm/sigma-confirm.component';
import { SigmaFileUploadComponent } from './sigma-file-upload/sigma-file-upload.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UpperDirective } from './directives/directiva-mayus';
import { NotAccessComponent } from './not-access/not-access.component';
import { SigmaShowFileComponent } from './sigma-show-file/sigma-show-file.component';
import { DualListComponent } from './dual-list/dual-list.component';
import { SigmaSelectComponent } from './sigma-select/sigma-select.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl } from 'ng-pick-datetime';
import { SigmaBusquedaComponent } from './component/sigma-busqueda/sigma-busqueda.component';
import { SigmaImageComponent } from './component/sigma-image/sigma-image.component';
import { SigmaProcesoDetalleComponent } from './component/sigma-proceso-detalle/sigma-proceso-detalle.component';
import { SigmaInputComponent } from './sigma-input/sigma-input.component';
import { NumericInputDirective } from './directives/numeric-input';
import { MultipleErrorMatSnackbarComponent } from './component/multiple-error-mat-snackbar/multiple-error-mat-snackbar.component';
import { SigmaDatePickerComponent } from './component/sigma-date-picker/sigma-date-picker.component';
import { SigmaFormEmailComponent } from './component/sigma-form-email/sigma-form-email.component';
import { SigmaFormSelectComponent } from './component/sigma-form-select/sigma-form-select.component';
import { SigmaFormInputComponent } from './component/sigma-form-input/sigma-form-input.component';
import { SigmaFormNumberComponent } from './component/sigma-form-number/sigma-form-number.component';
import { SigmaFormCalendarComponent } from './component/sigma-form-calendar/sigma-form-calendar.component';
import { SigmaFormAutocompleteComponent } from './component/sigma-form-autocomplete/sigma-form-autocomplete.component';
import { SigmaFormUploadFileComponent } from './component/sigma-form-upload-file/sigma-form-upload-file.component';
import { SafeResourceUrl } from '../dashboard/safeResourceUrl.pipe';
import { SigmaMantenimientoRecordsComponent } from './component/sigma-mantenimiento-records/sigma-mantenimiento-records.component';
import { SigmaGraphicProcessComponent } from './sigma-graphic-process/sigma-graphic-process.component';
import { SigmaGraphicAllProcessComponent } from './sigma-graphic-allProcess/sigma-graphic-allprocess.component';
import {
  SigmaActividadDocumentosListComponent
} from './sigma-documentos-component/sigma-actividad-documentos-list/sigma-actividad-documentos-list.component';
import {
  SigmaActividadDocumentosCreateComponent
} from './sigma-documentos-component/sigma-actividad-documentos-create/sigma-actividad-documentos-create.component';
import { SigmaFormSelectMultiLabelsComponent } from './component/sigma-form-select-multi-labels/sigma-form-select-multi-labels.component';
import {
  SigmaActividadDocumentosDeleteComponent
} from './sigma-documentos-component/sigma-actividad-documentos-delete/sigma-actividad-documentos-delete.component';
import {
  SigmaActividadDocumentosEditComponent
} from './sigma-documentos-component/sigma-actividad-documentos-edit/sigma-actividad-documentos-edit.component';
import { VisorMapaComponent } from './visor-mapa/visor-mapa.component';
import { GridMantenimientosComponent } from './component/grid-mantenimientos/grid-mantenimientos.component';
import { SeleccionTransicionComponent } from './component/seleccion-transicion/seleccion-transicion.component';
import { SigmaSumatoriasComponent } from './component/sigma-sumatorias/sigma-sumatorias.component';
import { DefaultIntl } from './models/default-intl.model';
import { FotoDiagnosticoPkComponent } from './component/foto-diagnostico-pk/foto-diagnostico-pk.component';
import { SharedRoutingModule } from './shared.routing';
import { SigmaFormSelectDescValorComponent } from './component/sigma-form-select-desc-valor/sigma-form-select-desc-valor.component';
import { SigmaSendMailComponent } from './component/sigma-send-mail/sigma-send-mail.component';
import { MailService } from './component/sigma-send-mail/services/mail.service';
import { SigmaChartTableroControlSigComponent } from './component/sigma-chart-tablero-control-sig/sigma-chart-tablero-control-sig.component';
import { ObjectFormComponent } from './component/sg-object-form/sg-object-form.component';
import { ArrayTableComponent } from './component/sg-array-table/sg-array-table.component';
import { PrevenirMultiplesClicksDirective } from './directives/prevenir-multiples-clicks.directive';
import { SigmaFormTextareaComponent } from './component/sigma-form-textarea/sigma-form-textarea.component';
import { SigmaConfirmFormatToExportComponent } from './component/sigma-confirm-format-to-export/sigma-confirm-format-to-export.component';
import { SigmaFormWebcamComponent } from './component/sigma-form-webcam/sigma-form-webcam.component';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    VisModule,
    SharedRoutingModule,
    WebcamModule
  ],
  exports: [
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    SigmaListComponent,
    SigmaDetailComponent,
    SigmaAutocompleteComponent,
    SigmaConfirmComponent,
    UpperDirective,
    SigmaGeneralListComponent,
    SigmaFileUploadComponent,
    SigmaShowFileComponent,
    ScheduleComponent,
    SigmaBusquedaComponent,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DualListComponent,
    SigmaImageComponent,
    SigmaProcesoDetalleComponent,
    SigmaSelectComponent,
    SigmaFormSelectDescValorComponent,
    NumericInputDirective,
    PrevenirMultiplesClicksDirective,
    SigmaDatePickerComponent,
    SigmaFormEmailComponent,
    SigmaFormSelectComponent,
    SigmaFormSelectMultiLabelsComponent,
    SigmaFormInputComponent,
    SigmaFormNumberComponent,
    SigmaFormCalendarComponent,
    SigmaFormAutocompleteComponent,
    SigmaFormUploadFileComponent,
    SafeResourceUrl,
    SigmaMantenimientoRecordsComponent,
    SigmaActividadDocumentosListComponent,
    VisorMapaComponent,
    GridMantenimientosComponent,
    SeleccionTransicionComponent,
    SigmaSumatoriasComponent,
    FotoDiagnosticoPkComponent,
    SigmaSendMailComponent,
    ObjectFormComponent,
    ArrayTableComponent,
    SigmaChartTableroControlSigComponent,
    SigmaFormTextareaComponent,
    SigmaFormWebcamComponent
  ],
  declarations: [
    SigmaListComponent,
    SigmaConfirmComponent,
    SigmaDetailComponent,
    SigmaAutocompleteComponent,
    UpperDirective,
    NumericInputDirective,
    PrevenirMultiplesClicksDirective,
    SigmaGeneralListComponent,
    SigmaFileUploadComponent,
    NotFoundComponent,
    NotAccessComponent,
    SigmaShowFileComponent,
    ScheduleComponent,
    ScheduleDialogComponent,
    DualListComponent,
    SigmaBusquedaComponent,
    SigmaImageComponent,
    SigmaProcesoDetalleComponent,
    SigmaInputComponent,
    SigmaSelectComponent,
    SigmaFormSelectDescValorComponent,
    MultipleErrorMatSnackbarComponent,
    SigmaDatePickerComponent,
    SigmaFormEmailComponent,
    SigmaFormSelectComponent,
    SigmaFormSelectMultiLabelsComponent,
    SigmaFormInputComponent,
    SigmaFormNumberComponent,
    SigmaFormCalendarComponent,
    SigmaFormAutocompleteComponent,
    SigmaFormUploadFileComponent,
    SafeResourceUrl,
    SigmaMantenimientoRecordsComponent,
    SigmaGraphicProcessComponent,
    SigmaGraphicAllProcessComponent,
    SigmaActividadDocumentosListComponent,
    SigmaActividadDocumentosCreateComponent,
    SigmaActividadDocumentosEditComponent,
    SigmaActividadDocumentosDeleteComponent,
    VisorMapaComponent,
    GridMantenimientosComponent,
    SeleccionTransicionComponent,
    SigmaSumatoriasComponent,
    FotoDiagnosticoPkComponent,
    SigmaSendMailComponent,
    ObjectFormComponent,
    ArrayTableComponent,
    SigmaChartTableroControlSigComponent,
    PrevenirMultiplesClicksDirective,
    SigmaFormTextareaComponent,
    SigmaConfirmFormatToExportComponent,
    SigmaFormWebcamComponent
  ],
  entryComponents: [SigmaConfirmComponent,
    ScheduleDialogComponent,
    ScheduleComponent,
    MultipleErrorMatSnackbarComponent,
    SigmaGraphicProcessComponent,
    SigmaGraphicAllProcessComponent,
    SigmaActividadDocumentosListComponent,
    SigmaActividadDocumentosCreateComponent,
    SigmaActividadDocumentosEditComponent,
    SigmaActividadDocumentosDeleteComponent,
    SigmaConfirmFormatToExportComponent
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'es' },
    { provide: OwlDateTimeIntl, useClass: DefaultIntl },
    ScheduleComponent,
    MailService
  ]
})

export class SharedModule { }
