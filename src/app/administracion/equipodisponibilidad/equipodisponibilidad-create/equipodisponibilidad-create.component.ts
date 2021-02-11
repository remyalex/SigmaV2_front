import { CalendariosUtilitiesService } from './../../recurso/services/calendariosUtilities.service';
import { Component, OnInit } from '@angular/core';
import { Equipodisponibilidad } from '../models/equipodisponibilidad.model';
import { EquipodisponibilidadService } from '../services/equipodisponibilidad.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD } from './../equipodisponibilidad.constant';
import * as _moment from 'moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CalendarEvent } from 'calendar-utils';
import { Equipo } from '../../equipo/models/equipo.model';
import { RecursoService } from '../../recurso/services/recurso.service';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;

/**
 * Componente encargado de gestionar la creación de un registro de
 * disponibilidad de los equipos
 **/
@Component({
  selector: 'sigma-administracion-equipodisponibilidad-create',
  templateUrl: './equipodisponibilidad-create.component.html',
})
export class EquipodisponibilidadCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD;
   /** Variable usada para almacenar la ruta a la que se redirigirá al componente */
  path = this.constants.path_administracion_equipodisponibilidad_equipoId + '?';
  /** Variable usada para gestionar el modelo de la disponibilidad del equipo */
  equipodisponibilidad: Equipodisponibilidad;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Objeto de valor mínimo de la fecha permitida */
  minDate: any = null;
  /** Objeto de valor máximo de la fecha permitida */
  maxDate: any = null;
  /** Tab seleccionado de la vista del usuario */
  selectedTab = 0;
  /** Criterio por el cual se realizará la búsqueda del componente*/
  searchBy: string = 'numeroInterno';
  /** Control de formulario usado para gestionar la fecha Desde */
  fechaDesdeControl = new FormControl(moment());
  /** Control de formulario usado para gestionar el campo intervalo del formulario */
  intervaloControl = new FormControl(moment(null));
  /** Control de formulario usado para gestionar la fecha hasta */
  fechaHastaControl = new FormControl(moment());
  /** Lista para control del calendario de fechas*/
  listaCalendario: any;
  /** Bandera par identificar si el calenadrio se encuentra diligenciado totalmente */
  calendariocompletado = false;
  /** Bandera que permite identificar si el formulario aún esta cargando la disponibilidad */
  cargandoDisponibilidad = false;
  /** Listado de eventos cargados en el calendario */
  events: CalendarEvent[] = [];
  /** Fecha para la cual se desea consultar el calendario */
  fechaConsultaCalendario: string = '';


  /**
   * Método encargado de construir una instancia de la clase
   *
   * @param _servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param servicioRecurso Servicio propio de gestión de Recursos, para control de este.
   * @param calendariosUtilitiesService Servicio para gestión de calendarios SIGMA
   */
  constructor(
    private _servicio: EquipodisponibilidadService,
    private _utilitiesService: UtilitiesService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private servicioRecurso: RecursoService,
    private calendariosUtilitiesService: CalendariosUtilitiesService
  ) {
    this.equipodisponibilidad = new Equipodisponibilidad();
    this.form = this.formBuilder.group({
      'equipoId': [null, Validators.compose([Validators.required])],
      'fechaDesde': [null, Validators.compose([Validators.required])],
      'fechaHasta': [null, Validators.compose([Validators.required])],
      'intervalo': [null, Validators.compose([Validators.required])],
      'turnoId': [null, Validators.compose([Validators.required])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.equipodisponibilidad = new Equipodisponibilidad();
    this.equipodisponibilidad.equipo = new Equipo();
    this.enviada = false;
    this.servicioRecurso.changeSelectedTab(1);
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(new Date());
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.equipodisponibilidad = new Equipodisponibilidad();
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          var result = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 2], 'recurso');
          let urlBack = result.split('/').splice(0, result.split('/').length - 1).join('/') + '/admin';
          this.router.navigate([urlBack]);
        }
      }
    );
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this._servicio.create(this.equipodisponibilidad).subscribe(data => {
      this.snackBar.open(this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      const result = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 2], 'recurso');
      const urlBack = result.split('/').splice(0, result.split('/').length - 1).join('/') + '/admin';
      this.router.navigate([urlBack]);
    }, error => {
      this.disableSubmit = false;
      this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid == true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open(this.constants.errorForm, 'X', {
        duration: 5000,
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
   * Método encargado de actualizar la información de la disponibilidad
   * de un equipo en el modelo.
   *
   * @param _equipo Objeto con la información del equipo a la que se le
   * actualizará la disponibilidad
   */
  public async setEquipoEquipodisponibilidad(_equipo: any) {
    this.calendariocompletado = false;
    this.cargandoDisponibilidad = true;
    this.equipodisponibilidad.equipo = _equipo;
      if (this.equipodisponibilidad.equipo.horaInicioProgramacion !== null
        && this.equipodisponibilidad.equipo.horaInicioProgramacion !== '') {
        this.equipodisponibilidad.equipo.horaInicioProgramacion =
        this.utilitiesService.getHoraClientFormat(this.equipodisponibilidad.equipo.horaInicioProgramacion);
        this.equipodisponibilidad.equipo.horaInicioProgramacion =
        '+00 ' + this.equipodisponibilidad.equipo.horaInicioProgramacion + ':00.000000';
      }
      if (this.equipodisponibilidad.equipo.horaFinProgramacion !== null
        && this.equipodisponibilidad.equipo.horaFinProgramacion !== '') {
        this.equipodisponibilidad.equipo.horaFinProgramacion =
        this.utilitiesService.getHoraClientFormat(this.equipodisponibilidad.equipo.horaFinProgramacion);
        this.equipodisponibilidad.equipo.horaFinProgramacion = '+00 ' + this.equipodisponibilidad.equipo.horaFinProgramacion + ':00.000000';
      }
      this.onChangeAutocompleteForm(_equipo);
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
    this._servicio.listCalendariosByEquipoAndFecha(this.equipodisponibilidad.equipo.id,
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
