import { Component, OnInit } from '@angular/core';
import { Lugardisponibilidad } from '../models/lugardisponibilidad.model';
import { LugardisponibilidadService } from '../services/lugardisponibilidad.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_LUGARDISPONIBILIDAD } from './../lugardisponibilidad.constant';
import * as _moment from 'moment';
// Date time completo
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { LugardisponibilidadCriteria } from '../models/lugardisponibilidad-criteria.model';
import { CalendarEvent } from 'calendar-utils';
import { LugardisponibilidadValidator } from 'src/app/shared/form/lugardisponibilidad.validator';
import { RecursoService } from '../../recurso/services/recurso.service';
import { CalendariosUtilitiesService } from '../../recurso/services/calendariosUtilities.service';

/** Clase encargada de la creación del componente */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-lugardisponibilidad-create',
  templateUrl: './lugardisponibilidad-create.component.html'
})
export class LugardisponibilidadCreateComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGARDISPONIBILIDAD;
  /** Objeto usado para enviar al servicio de CRUD*/
  lugardisponibilidad: Lugardisponibilidad = new Lugardisponibilidad();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  /** Objeto que recibe eventos del componente - sigma-schedule */
  listaCalendario: any;
  /** Objeto que para indicar si el botón se muestra */
  calendariocompletado = false;
  /** Objeto que para indicar si el ícono se muestra */
  cargandoDisponibilidad = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new LugardisponibilidadCriteria();
  /** Array que recibe objetos Calendar*/
  events: CalendarEvent[] = [];
  /** Objeto usado para mostrar diferente texto en el botón */
  mostrar = '';
  /** variable que recibe fechas con formato */
  fechaConsultaCalendario = '';

  /** Array que almacena mensaje de error */
  errorsLugar = [
    { name: 'errorDatosNecesariosLugar', message: this.constants.datosNecesarioLugar }
  ];

  /** Array que almacena mensaje de error */
  errorsInterval = [
    { name: 'intervaloNoPermitido', message: this.constants.intervaloNoPermitido }
  ];


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param servicioRecurso Componente Recurso de utilidades de peticiones a servicios
  * @param calendariosUtilitiesService Componente Calendario de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: LugardisponibilidadService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private servicioRecurso: RecursoService,
    private calendariosUtilitiesService: CalendariosUtilitiesService
  ) {
    this.form = this.formBuilder.group({
      'fechaDesde': [null, Validators.compose([Validators.required])],
      'fechaHasta': [null, Validators.compose([Validators.required])],
      'intervalo': [null, Validators.compose([Validators.required])],
      'lugar': [null, Validators.compose([Validators.required])],
      'turnoId': [null, Validators.compose([Validators.required])],
    }, {
      validator: [
        // LugardisponibilidadValidator.datosNecesarios,
        // LugardisponibilidadValidator.intervaloMax
      ]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicioRecurso.changeSelectedTab(2);
    this.lugardisponibilidad = new Lugardisponibilidad();
    this.enviada = false;
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(new Date());
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.lugardisponibilidad = new Lugardisponibilidad();
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
        if (val === 1) {
          const result = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 2], 'recurso');
          const urlBack = result.split('/').splice(0, result.split('/').length - 1).join('/') + '/admin';
          this.router.navigate([urlBack]);
        }
      }
    );
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.lugardisponibilidad).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const result = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 2], 'recurso');
        const urlBack = result.split('/').splice(0, result.split('/').length - 1).join('/') + '/admin';
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
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
    if (this.form.valid === true) {
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

  /** Método encargado de validar el parámetro que sea diferente de indefinido
   *  y llama al método loadCalendarios() 
   * @param lugar Objeto que será validado para permitir cargar calendarios
   * */
  onChangeAutocompleteForm(lugar: any): void {
    if (typeof lugar !== 'undefined' && typeof lugar.id !== 'undefined') {
      this.loadCalendarios();
    }
  }

  /** Método encargado de cargar los calendarios */
  loadCalendarios(): void {
    this.calendariocompletado = false;
    this.cargandoDisponibilidad = true;
    this.events = [];
    this.servicio.listCalendariosByLugarAndFecha(this.lugardisponibilidad.lugar.id,
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

  /** Método encargado de cambiar el formato para la fecha consulta y llama método loadCalendarios()
   * @param dateCalendar objeto fecha que se reemplazará con un nuevo formato de fecha.
  */
  getEventMonthChanged(dateCalendar: any) {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(dateCalendar);
    this.loadCalendarios();
  }
}
