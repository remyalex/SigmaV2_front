import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Equipodisponibilidad } from '../models/equipodisponibilidad.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EquipodisponibilidadService } from '../services/equipodisponibilidad.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD } from './../equipodisponibilidad.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { EquipoService } from '../../equipo/services/equipo.service';
import { Equipo } from '../../equipo/models/equipo.model';
import { EquipoDisponibilidadCriteria } from '../models/equipodisponibilidad-criteria.model';
import { CalendarEvent } from 'calendar-utils';
import { CalendariosUtilitiesService } from '../../recurso/services/calendariosUtilities.service';


/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;

/**
 * Componente encargado de gestionar la edición de un registro de
 * disponibilidad del calendario
 **/
@Component({
  selector: 'sigma-administracion-equipodisponibilidad-edit',
  templateUrl: './equipodisponibilidad-edit.component.html'
})
export class EquipodisponibilidadEditComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto de tipo model con el cual se procesará la información */
  equipoDisponibilidad: Equipodisponibilidad;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Objeto de valor mínimo de la fecha permitida */
  private minDate: any = null;
  /** Objeto de valor máxima de la fecha permitida */
  private maxDate: any = null;
  /** Control de Fecha desde del formulario */
  fechaDesdeControl = new FormControl(moment());
  /** Control de formulario usado para gestionar el campo intervalo del formulario */
  intervaloControl = new FormControl(moment());
  /** Control de formulario usado para gestionar la fecha hasta */
  fechaHastaControl = new FormControl(moment());
  /** Bandera que permite identificar si el formulario aún esta cargando la disponibilidad */
  cargandoDisponibilidad = false;
  /** Lista para control del calendario de fechas*/
  listaCalendario: any;
  /** Bandera par identificar si el calenadrio se encuentra diligenciado totalmente */
  calendariocompletado = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoDisponibilidadCriteria();
  /** Listado de eventos cargados en el calendario */
  events: CalendarEvent[] = [];
  /** Variable usada para mostrar mensajes al usuario */
  mostrar = '';
  /** fecha en la cual se realizará la consulta del calendario */
  fechaConsultaCalendario: string = '';


  /**
   * Método encargado de construir una instancia de la clase
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param differs Elemento usado para mantener la información clonada.
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param calendariosUtilitiesService Servicio para gestión de calendarios SIGMA
   **/
  constructor(
    private servicio: EquipodisponibilidadService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EquipodisponibilidadEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Equipodisponibilidad,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
    private calendariosUtilitiesService: CalendariosUtilitiesService,
  ) {
    this.equipoDisponibilidad = data;
    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([Validators.required])],
        'activo': [null, Validators.compose([Validators.required])],
        'equipoId': [{ value: null, disabled: true }, Validators.compose([Validators.required])],
        'fechaDesde': [{ value: null, disabled: false }, Validators.compose([Validators.required])],
        'fechaHasta': [{ value: null, disabled: false }, Validators.compose([Validators.required])],
        'intervalo': [{ value: null, disabled: false }, Validators.compose([Validators.required])],
        'turnoId': [null, Validators.compose([Validators.required])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.equipoDisponibilidad));
    this.customerDiffer = this.differs.find(this.equipoDisponibilidad).create();
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(new Date());
    this.loadCalendarios();
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        for (let key in this.equipoDisponibilidad) {
          this.equipoDisponibilidad[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.equipoDisponibilidad).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disableSubmit = false;
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    if (this.form.valid == true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open(this.constants.errorForm, 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /**
   * Metodo encargado de cargar los calendarios de un equipo específico
   *
   * @param equipo Objeto con la información del equipo a la que se le
   * presentará la disponibilidad
  */
  onChangeAutocompleteForm(equipo: any): void {
    if (typeof equipo !== 'undefined' && typeof equipo.id !== 'undefined') {
      this.loadCalendarios();
    }
  }

  /** Método encargado de cargar los calendarios para el formulario */
  loadCalendarios(): void {
    this.calendariocompletado = false;
    this.cargandoDisponibilidad = true;
    this.events = [];
    this.servicio.listCalendariosByEquipoAndFecha(this.equipoDisponibilidad.equipo.id,
      this.fechaConsultaCalendario).subscribe((calendarios: any) => {
        this.events = this.calendariosUtilitiesService.obtenerEventosDeCalendario(calendarios);
        this.cargandoDisponibilidad = false;
        this.calendariocompletado = true;
      }
        , error => {
          this.cargandoDisponibilidad = false;
          this.calendariocompletado = true;
        }
      );
  }

  /**
  * Método encargado de actualizar la información de los meses del calendario espeficado
  *
  * @param dateCalendar Fecha del calendario sobre la que se cargará el calendario
  */
  getEventMonthChanged(dateCalendar: any) {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(dateCalendar);
    this.loadCalendarios();
  }
}
