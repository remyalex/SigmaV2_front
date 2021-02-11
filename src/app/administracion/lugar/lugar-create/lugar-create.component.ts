import { Component, OnInit } from '@angular/core';
import { Lugar } from '../models/lugar.model';
import { LugarService } from '../services/lugar.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_LUGAR } from './../lugar.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { TimeValidator } from 'src/app/shared/form/time.validator';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY-MM-DD',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

/** Clase encargada de la creación del componente */
@Component({
  selector: 'sigma-administracion-lugar-create',
  templateUrl: './lugar-create.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})
export class LugarCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGAR;
  /** Objeto usado para enviar al servicio de CRUD*/
  lugar: Lugar = new Lugar();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** Valor mínimo permitido para la fecha  */
  public minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  public maxDate: any = null;
  /** Valor tipo Date Desde permitido para la fecha  */
  public fechaDesdeControl = new FormControl(moment(null));
  /** Valor tipo Date Hasta permitido para la fecha  */
  public fechaHastaControl = new FormControl(moment(null));
  /** Valor tipo Date Inicial permitido para la fecha  */
  public horaInicioControl = new FormControl(moment(null));
  /** Valor tipo Date Final permitido para la fecha  */
  public horaFinControl = new FormControl(moment(null));


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: LugarService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.form = this.formBuilder.group({
      'nombre': [null, Validators.compose([
        Validators.required,
        Validators.maxLength(300)
      ])],
      'descripcion': [null, Validators.compose([
        Validators.maxLength(600),
      ])],
      'contactoNombre': [null, Validators.compose([
        Validators.maxLength(100),
      ])],
      'contactoTelefono': [null, Validators.compose([
        Validators.maxLength(20),
      ])],
      'contactoCorreo': [null, Validators.compose([
        Validators.maxLength(100), Validators.email,
      ])],
      direccion: [null, Validators.compose([
        Validators.maxLength(100),
      ])],
      tipoLugarId: [null, Validators.compose([Validators.required])],
      origenLugarId: [null, Validators.compose([Validators.required])],
      estadoLugarId: [null, Validators.compose([Validators.required])],
      fechaDesde: [null, null],
      fechaHasta: [null, null],
      horaInicio: [null, null],
      horaFin: [null, null],
    }, { validator: TimeValidator.timeMin });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.lugar = new Lugar();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.lugar = new Lugar();
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
          const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin')
          this.router.navigate([urlBack]);
        }
      }
    );
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.lugar).subscribe(
      data => {
        this.disabledBtn_Login = false;
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_lugar);
        this.router.navigateByUrl('/administracion/lugar/admin');
      },
      error => {
        this.disabledBtn_Login = false;
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
    this.disabledBtn_Login = true;
    if (this.form.valid == true) {
      this.save();
    } else {
      this.disabledBtn_Login = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
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

  /** Método para reasignar el estadoLugar del objeto lugar
   * @param object objeto estadoLugar seleccionado
   */
  setEstadoLugarLugar(object: any) {
    this.lugar.estadoLugar = object;
  }

  /** Método para reasignar el origenLugar del objeto lugar
   * @param object objeto origenLugar seleccionado
   */
  setOrigenLugarLugar(object: any) {
    this.lugar.origenLugar = object;
  }

  /** Método para reasignar el tipoLugar del objeto lugar
   * @param object objeto tipoLugar seleccionado
   */
  setTipoLugarLugar(object: any) {
    this.lugar.tipoLugar = object;
  }

  /**
   * Método encargado de actualizar el formato a las fechas del formulario actualizadas
   *
   * @param atributo Nombre del atributo que se va a actualizar
   * @param event Evento con el valor actualizado por el usuario
   * @param tipo Tipo de atributo a actualizar
   * */
  changeDate(atributo: any, event: any, tipo: string) {
    this.lugar[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInput);

    if (tipo == 'min') {
      this.minDate = event.value;
    } else if (tipo == 'max') {
      this.maxDate = event.value;
    }
  }

  /** 
   * Método encargado de actualizar el valor la hora del atributo indicado en el modelo
   * @param atributo Nombre del atributo que se va a actualizar del modelo
   * @param event Evento realizado por el usuario con el valor modificado
   **/
  changeTime(atributo, event) {
    this.lugar[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInputHours);
  }

  /** Método encargado de limpiar el valor Fecha Desde del componente */
  clearFechaDesdeValue() {
    this.fechaDesdeControl.setValue([null, null]);
    this.lugar.fechaDesde = '';
    this.minDate = null;
  }

  /** Método encargado de limpiar el valor Fecha Hasta del componente */
  clearFechaHastaValue() {
    this.fechaHastaControl.setValue([null, null]);
    this.lugar.fechaHasta = '';
    this.maxDate = null;
  }

}
