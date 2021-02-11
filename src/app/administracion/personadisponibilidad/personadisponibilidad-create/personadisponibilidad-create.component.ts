import { CalendariosUtilitiesService } from './../../recurso/services/calendariosUtilities.service';
import { Component, OnInit } from '@angular/core';
import { Personadisponibilidad } from '../models/personadisponibilidad.model';
import { PersonadisponibilidadService } from '../services/personadisponibilidad.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PERSONADISPONIBILIDAD } from './../personadisponibilidad.constant';
import * as _moment from 'moment';
// Date time completo
// import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
// import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { PersonadisponibilidadCriteria } from '../models/personadisponibilidad-criteria.model';
import { CalendarEvent } from 'calendar-utils';
import { RecursoService } from '../../recurso/services/recurso.service';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;

/** Componente encargado de gestionar la creación de persona disponibilidad */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-personadisponibilidad-create',
  templateUrl: './personadisponibilidad-create.component.html'
})
export class PersonadisponibilidadCreateComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONADISPONIBILIDAD;
  /** Objeto usado para enviar al servicio de CRUD*/
  personadisponibilidad: Personadisponibilidad = new Personadisponibilidad();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera usada para mantener habilitado o desabilitado el ícono del botón */
  cargandoDisponibilidad = false;
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  /** lista que recibe datos del componente sigma-schedule */
  listaCalendario: any;
  /** Bandera usada para mantener habilitado o desabilitado el botón -Ocultar o Disponibilidad*/
  calendariocompletado = false;
  /** Objeto fecha Desde control usada en el componente */
  fechaDesdeControl = new FormControl(moment(null));
  /** Objeto intervalo control usada en el componente */
  intervaloControl = new FormControl(moment(null));
  /** Objeto fecha Hasta control usada en el componente */
  fechaHastaControl = new FormControl(moment(null));
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new PersonadisponibilidadCriteria();
  /** Valor mínimo permitido para la fecha  */
  public minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  public maxDate: any = null;
  /** objeto array CalendarEvents */
  events: CalendarEvent[] = [];
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mostrar = '';
  /** variable tipo String usada en el componente */
  fechaConsultaCalendario: string = '';

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param servicioRecurso Servicio Recurso usado en el componente para gestionar las peticiones
  * @param calendariosUtilitiesService Servicio calendarios utilities usado en el componente
  * para gestionar las peticiones
  */
  constructor(
    private servicio: PersonadisponibilidadService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private servicioRecurso: RecursoService,
    private calendariosUtilitiesService: CalendariosUtilitiesService
  ) {
    this.form = this.formBuilder.group({
      fechaDesde: [null, Validators.compose([Validators.required])],
      fechaHasta: [null, Validators.compose([Validators.required])],
      intervalo: [null, Validators.compose([Validators.required])],
      persona: [null, Validators.compose([Validators.required])],
      turnoId: [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicioRecurso.changeSelectedTab(0);
    this.listaCalendario = '';
    this.personadisponibilidad = new Personadisponibilidad();
    this.enviada = false;
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(new Date());
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.personadisponibilidad = new Personadisponibilidad();
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        const result = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 2], 'recurso');
        const urlBack =
          result
            .split('/')
            .splice(0, result.split('/').length - 1)
            .join('/') + '/admin';
        this.router.navigate([urlBack]);
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.personadisponibilidad).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const result = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 2], 'recurso');
        const urlBack =
          result
            .split('/')
            .splice(0, result.split('/').length - 1)
            .join('/') + '/admin';
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
        if (error.status == 500 || error.status == 0) {
          this.snackBar.open(this.constants.error500, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
      }
    );
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
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de validar dato persona del formulario y cargar calendarios
  * @param persona objeto que será validado
  */
  onChangeAutocompleteForm(persona: any): void {
    if (typeof persona !== 'undefined' && typeof persona.id !== 'undefined') {
      if (persona.estado.valor === 'NUEVO' || persona.estado.valor === 'ACTIVO') {
        this.loadCalendarios();
      } else {
        this.snackBar.open(this.constants.estadoIncorrectoPersona, 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    }
  }

  /** Método encargado de cargar los calendarios */
  loadCalendarios(): void {
    this.calendariocompletado = false;
    this.cargandoDisponibilidad = true;
    this.events = [];
    this.servicio.listCalendariosByPersonaAndFecha(this.personadisponibilidad.persona.id,
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

  /** Método encargado para retornar fecha con formato y cargar calendarios
   * @param dateCalendar fecha seleccionada
   */
  getEventMonthChanged(dateCalendar: any) {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(dateCalendar);
    this.loadCalendarios();
  }

}
