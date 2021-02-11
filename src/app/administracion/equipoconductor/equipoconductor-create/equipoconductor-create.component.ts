import { EquipoConductor } from './../models/equipoconductor.model';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { EquipoConductorDia } from './../models/equipoconductordia.model';
import { CalendariosUtilitiesService } from './../../recurso/services/calendariosUtilities.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EQUIPOCONDUCTOR } from './../equipoconductor.constant';
import * as _moment from 'moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CalendarEvent } from 'calendar-utils';
import { RecursoService } from '../../recurso/services/recurso.service';
import { EquipoConductorService } from '../services/equipoconductor.service';
import { Persona } from '../../persona/models/persona.model';
import { MY_CUSTOM_FORMATS } from 'src/app/shared/schedule/schedule.component';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;

/** Componente encargado de gestionar la creación de los conductores de un equipo */
@Component({
  selector: 'sigma-administracion-equipoconductor-create',
  templateUrl: './equipoconductor-create.component.html'
})
export class EquipoConductorCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCONDUCTOR;
  /** Variable usada para gestionar el modelo del conductor del equipo */
  equipoConductor: EquipoConductor;
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
  /** Máxima fecha hasta permitida */
  maxFechaHasta: any = null;
  /** Fecha desde final  */
  desdeFinal: any = null;
  /** Tab seleccionado de la vista del usuario */
  selectedTab = 0;
  /** Criterio por el cual se realizará la búsqueda del componente*/
  searchBy: string = 'numeroInterno';
  /** Control de formulario usado para gestionar la fecha Desde */
  fechaDesdeControl = new FormControl(moment(null));
  /** Control de formulario usado para gestionar el campo intervalo del formulario */
  intervaloControl = new FormControl(moment(null));
  /** Control de formulario usado para gestionar la fecha hasta */
  fechaHastaControl = new FormControl(moment());
  /** Valor por el cual se realizará el ordenamiento de la lista de días */
  ordenDias = 'valor';
  /** Bandera para controlar si los botones Sumbits del formulario estarán habilitados o no */
  disableFormsCalendarios = true;
  /**
   * Listado de valores de los días habiles
   * De lunes a viernes de forma predeterminada
  */
  diasHabiles = [1, 2, 3, 4, 5];
  /** Lista para control del calendario de fechas*/
  listaCalendario: any;
  /** Bandera par identificar si el calenadrio se encuentra diligenciado totalmente */
  calendariocompletado = false;
  /** Bandera que permite identificar si el formulario aún esta cargando la disponibilidad */
  cargandoDisponibilidad = false;
  /** Listado de eventos cargados en el calendario */
  events: CalendarEvent[] = [];
  /** Objeto on la informaccón de placa, movil y numero interno del equipo */
  equipoInfo = {
    placa: this.constants.placa,
    movil: this.constants.movil,
    numeroInterno: this.constants.numeroInterno,
  };


  /**
   * Método encargado de construir una instancia de la clase
   *
   * @param _servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param _utilitiesService Componente de utilidades de peticiones a servicios
   * @param servicioRecurso Servicio propio de gestión de Recursos, para control de este.
   */
  constructor(
    private _servicio: EquipoConductorService,
    private _utilitiesService: UtilitiesService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private servicioRecurso: RecursoService,
    private calendariosUtilitiesService: CalendariosUtilitiesService
  ) {
    this.equipoConductor = new EquipoConductor();
    this.form = this.formBuilder.group({
      'equipoId': [null, Validators.compose([Validators.required])],
      'conductorId': [null, Validators.compose([Validators.required])],
      'celular': [null,
        Validators.compose([
          Validators.pattern('^[0-9]{10}?$'),
          Validators.required
        ])],
      'placa': [{value: null, disabled: true}, null],
      'diasSemana': [null, Validators.compose([Validators.required])],
      'tipoVehiculoContratadoId': [null, Validators.compose([Validators.required])],
      'fechaDesde': [null, Validators.compose([Validators.required])],
      'fechaHasta': [null, Validators.compose([Validators.required])],
      'maxFinSemana': [null, null],
      'desdeFinal': [null, null],
      'minHoy': [null, null],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.equipoConductor = new EquipoConductor();
    // this.equipoconductor.equipo = new Equipo();
    this.enviada = false;
    this.minDate = this._utilitiesService.convertStringToDate(null);
    this.equipoConductor.minHoy = this._utilitiesService.getFechaServerFormat_ddMMaaaa(new Date());
    this.maxFechaHasta = this._utilitiesService.getSundayDateFromStringDate(this.equipoConductor.minHoy);
    this.desdeFinal = this.minDate ;
    this.equipoConductor.desdeFinal =  this._utilitiesService.getFechaServerFormat_ddMMaaaa(new Date());
    this.equipoConductor.maxFinSemana = this._utilitiesService.getFechaServerFormat_ddMMaaaa(this.maxFechaHasta);
    this.servicioRecurso.changeSelectedTab(1);
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.equipoConductor = new EquipoConductor();
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
          var result = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 2], 'equipoconductor');
          let urlBack = result.split('/').splice(0, result.split('/').length - 1).join('/') + '/admin';
          this.router.navigate([urlBack]);
        }
      }
    );
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this._servicio.create(this.equipoConductor).subscribe(data => {
      this.snackBar.open(this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      const result = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 2], 'equipoconductor');
      const urlBack = result.split('/').splice(0, result.split('/').length - 1).join('/') + '/admin';
      this.router.navigate([urlBack]);
    }, error => {
      this.disableSubmit = false;
      this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      this.onChangeFechaDesde(this.equipoConductor.hasta);
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    if (typeof this.equipoConductor.diasSemana === 'undefined' || this.equipoConductor.diasSemana === null) {
      this.equipoConductor.diasSemana = null;
      this.markAndValidateAllInputs(this.form);
      this.snackBar.open(this.constants.errorForm, 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
      return;
    }
    this.parseDiasToDiasConductor();
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    this.form.controls['maxFinSemana'].setErrors(null);
    this.form.controls['minHoy'].setErrors(null);
    this.form.controls['desdeFinal'].setErrors(null);

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

  /** Método encagrado de identificar los dias de la semana */
  cambioDiasSemana(dias: any) {
    if (typeof(dias) !== 'undefined') {
        this.diasHabiles = [];
        const diasSeleccionados = dias.map(function (p) { return p.descripcion; });

        diasSeleccionados.forEach(diaSeleccionado => {
          const indexDia = this.obtenerDiaSemanaEntero(diaSeleccionado);
          this.diasHabiles.push(indexDia);
        });

    }
  }

  /**
   * Método encargado de returnar el núnero del día
   * de la semana según el texto que ingresa
   *
   * @param nombreDia texto con el nombre del dia a convertir
   **/
  obtenerDiaSemanaEntero(nombreDia: string) {
    switch (nombreDia) {
      case 'DOMINGO':
        return 0;
      case 'LUNES':
        return 1;
      case 'MARTES':
        return 2;
      case 'MIÉRCOLES':
        return 3;
      case 'JUEVES':
        return 4;
      case 'VIERNES':
        return 5;
      case 'SABADO':
        return 6;
    }
  }

  /**
   * Método encargado de identificar el día y estado
   * del día según el arreglo de los dias del equipo conductor
   **/
  parseDiasToDiasConductor() {
      this.equipoConductor.dias = [];
      this.equipoConductor.diasSemana.forEach(element => {
        const itemDia: EquipoConductorDia = new EquipoConductorDia();
        itemDia.dia = element;
        itemDia.activo = true;
        this.equipoConductor.dias.push(itemDia );
      });
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de actualizar el dato de persona conductor en el modelo */
  onChangeConductorSeleccionado(personaConductor: Persona): void {
    if (typeof personaConductor !== 'undefined' && typeof personaConductor.id !== 'undefined') {
      this.disableFormsCalendarios = false;
      // this.equipoConductor.celular = personaConductor.telefono;
    }
  }

  /** Método encargado habilitar o deshabilitar las fechas según equipo seleccionado*/
  onChangeEquipoSeleccionado(equipo: Equipo): void {
    if (typeof equipo !== 'undefined' && typeof equipo.id !== 'undefined') {
      this.equipoConductor.placa = equipo.placa;
      this.form.controls['fechaDesde'].enable();
      this.form.controls['fechaHasta'].enable();
      this.form.controls['diasSemana'].enable();
    } else {
      this.form.controls['fechaDesde'].disable();
      this.form.controls['fechaHasta'].disable();
      this.form.controls['diasSemana'].disable();
    }
  }

  /** Método encargado de actualizar los datos del equipo
   * conductor cuando cambia la fecha del formulario
   *
   * @param fecha Fecha en la cual se desea crear la relación
   * entre el equipo y el conductor
   **/
  onChangeFechaDesde(fecha: any): void {
    if (typeof fecha !== 'undefined') {
      if (this.equipoConductor.hasta !== '') {
        this.equipoConductor.hasta = '';
      }
      this.equipoConductor.hasta = '';
      this.form.get('fechaHasta').setValue(null);
      this.maxFechaHasta = this._utilitiesService.getSundayDateFromStringDate(fecha);
      this.desdeFinal = this._utilitiesService.convertStringToDate(fecha);
      this.equipoConductor.maxFinSemana = this._utilitiesService.getFechaServerFormat_ddMMaaaa(this.maxFechaHasta);
      this.equipoConductor.desdeFinal = this._utilitiesService.getFechaServerFormat_ddMMaaaa(this.desdeFinal);
    }
  }

}
