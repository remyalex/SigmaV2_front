import { SigmaFormCalendarComponent } from './../../../shared/component/sigma-form-calendar/sigma-form-calendar.component';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Equipo } from './../../equipo/models/equipo.model';
import { ListaItem } from './../../listas-items/models/listas-items.model';
import { EquipoConductorDia } from './../models/equipoconductordia.model';
import { EquipoConductorCriteria } from './../models/equipoconductor-criteria.model';
import { Component, OnInit, Inject, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EQUIPOCONDUCTOR } from './../equipoconductor.constant';
import * as _moment from 'moment';
// Date time completo
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CalendarEvent } from 'calendar-utils';
import { EquipoConductor } from '../models/equipoconductor.model';
import { EquipoConductorService } from '../services/equipoconductor.service';
import { Persona } from '../../persona/models/persona.model';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'sigma-administracion-equipoconductor-edit',
  templateUrl: './equipoconductor-edit.component.html',
})
export class EquipoConductorEditComponent implements  OnInit  {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCONDUCTOR;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Variable usada para gestionar el modelo del conductor del equipo */
  equipoConductor: EquipoConductor;
  /** Lista de conductores antes de la edición */
  equipoConductorDiasBackUp: EquipoConductorDia[] = [];
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
  /** Máxima fecha hasta permitida */
  maxFechaHasta: any = null;
  /** Mínima fecha hasta permitida */
  minFechaHasta: any = null;
   /** Variable auxiliar para almacenar la fecha hasta permitida */
  fechaHastaAux: Date;
  /** Valor por el cual se realizará el ordenamiento de la lista de días */
  ordenDias = 'valor';
  /** Objeto de valor mínimo de la fecha permitida */
  minDate: any = null;
  /** Control de formulario usado para gestionar la fecha Desde */
  fechaDesdeControl = new FormControl(moment(null));
  /** Control de formulario usado para gestionar el campo intervalo del formulario */
  intervaloControl = new FormControl(moment());
  /** Control de formulario usado para gestionar la fecha hasta */
  fechaHastaControl = new FormControl(moment());
  /** Bandera usada para identificar si la vista esta cargando actualmente */
  loadingView = true;
  /** Fecha desde final  */
  desdeFinal: any = null;
  /**
   * Listado de valores de los días habiles
   * De lunes a viernes de forma predeterminada
  */
  diasHabiles = [1, 2, 3, 4, 5];    // De lunes a viernes de forma predeterminada
  /** Bandera usada para identificar si el sistema se encuentra cargando disponibilidad */
  cargandoDisponibilidad = false;
  /** Lista para control del calendario de fechas*/
  listaCalendario: any;
  /** Bandera par identificar si el calenadrio se encuentra diligenciado totalmente */
  calendariocompletado = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoConductorCriteria();
  /** Listado de eventos cargados en el calendario */
  events: CalendarEvent[] = [];
  /** Variable usada para presentar el mensaje a mostrar al usuario */
  mostrar = '';
  /** Objeto on la informaccón de placa, movil y numero interno del equipo */
  equipoInfo = {
    placa: this.constants.placa,
    movil: this.constants.movil,
    numeroInterno: this.constants.numeroInterno,
  };
  /** Vista desde la cual se seleccionara la fecha desde */
  @ViewChild('fechaDesde') fechaDesde: SigmaFormCalendarComponent;
  /** Vista desde la cual se seleccionara la fecha hasta */
  @ViewChild('fechaHasta') fechaHasta: SigmaFormCalendarComponent;

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
   * @param differs Elemento usado para mantener la información clonada.
   */
  constructor(
    private servicio: EquipoConductorService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EquipoConductorEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: EquipoConductor,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private _utilitiesService: UtilitiesService
  ) {
    this.equipoConductor = data;
    this.equipoConductor.placa = data.equipo.placa;
    this.equipoConductorDiasBackUp = data.dias;
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
    this.clone = JSON.parse(JSON.stringify(this.equipoConductor));
    this.parseDiasConductorToDias();
    this.customerDiffer = this.differs.find(this.equipoConductor).create();
    const thisLocal = this;
    this.minDate = this._utilitiesService.convertStringToDate(null);
    this.equipoConductor.minHoy = this._utilitiesService.getFechaServerFormat_ddMMaaaa(new Date());
    this.maxFechaHasta = this._utilitiesService.getSundayDateFromStringDate(this.equipoConductor.minHoy);
    this.desdeFinal = this.minDate ;
    this.equipoConductor.desdeFinal =  this._utilitiesService.getFechaServerFormat_ddMMaaaa(new Date());
    this.equipoConductor.maxFinSemana = this._utilitiesService.getFechaServerFormat_ddMMaaaa(this.maxFechaHasta);

    setTimeout(function() {
      thisLocal.loadingView = false;
      thisLocal.fechaHasta.minDate = thisLocal._utilitiesService.getFechaClientFormat(thisLocal.equipoConductor.desde).toDate() ;
      thisLocal.fechaHasta.maxDate = thisLocal._utilitiesService.getSundayDateFromStringDate(thisLocal.equipoConductor.desde);
    }, 2000);
    }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        for (let key in this.equipoConductor) {
          this.equipoConductor[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.equipoConductor).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
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
      return;
    }
    this.parseDiasToDiasConductor();
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.form.controls['minHoy'].setErrors(null);
    this.form.controls['desdeFinal'].setErrors(null);
    this.form.controls['maxFinSemana'].setErrors(null);
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
   * Método encargado de identificar el día y estado
   * del día según el arreglo de los dias del equipo conductor
   **/
  parseDiasConductorToDias() {
      this.equipoConductor.diasSemana = [];
      this.equipoConductor.dias.forEach((element: EquipoConductorDia) => {
        let itemDiaSemana: ListaItem = new ListaItem();
        itemDiaSemana = element.dia;
        this.equipoConductor.diasSemana.push(itemDiaSemana );
      });
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
        const itemDia: EquipoConductorDia[] =  this.equipoConductorDiasBackUp.filter( w => w.dia.id === element.id) ;
        if (itemDia.length > 0 ) {
          this.equipoConductor.dias.push(itemDia[0]);
        } else {
          const itemDiaNuevo: EquipoConductorDia = new EquipoConductorDia();
          itemDiaNuevo.dia = element;
          itemDiaNuevo.activo = true;
          this.equipoConductor.dias.push(itemDiaNuevo );
        }
      });
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

  /** Método encargado de actualizar el dato de persona conductor en el modelo */
  onChangeConductorSeleccionado(personaConductor: Persona): void {
    if (typeof personaConductor !== 'undefined' && typeof personaConductor.id !== 'undefined') {
      // this.equipoConductor.celular = personaConductor.telefono;
    }
  }

   /** Método encargado habilitar o deshabilitar las fechas según equipo seleccionado*/
   onChangeEquipoSeleccionado(equipo: Equipo): void {
    if (typeof equipo !== 'undefined' && typeof equipo.id !== 'undefined') {
      this.equipoConductor.placa = equipo.placa;
    }
  }

   /** Método encargado habilitar o deshabilitar las fechas según equipo seleccionado*/
  onChangeFechaDesde(fecha: any): void {
    if (typeof fecha !== 'undefined' && this.loadingView === false) {
      this.fechaHasta.minDate = this._utilitiesService.getFechaClientFormat(this.equipoConductor.desde) ;
      this.fechaHasta.maxDate = this._utilitiesService.getSundayDateFromStringDate(fecha);
      this.fechaHasta.clearInputCalendar();
      this.fechaHasta.setFocusInput();
      this.desdeFinal = this._utilitiesService.convertStringToDate(fecha);
      this.equipoConductor.desdeFinal = this._utilitiesService.getFechaServerFormat_ddMMaaaa(this.desdeFinal);
    }
  }

}
