import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Lugar } from '../models/lugar.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LugarService } from '../services/lugar.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_LUGAR } from './../lugar.constant';
import * as moment from 'moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { TimeValidator } from 'src/app/shared/form/time.validator';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY-MM-DD',
  formatoDateControl: 'YYYY-MM-DD HH:mm:ss'
};

/** Clase encargada de la edición del componente */
@Component({
  selector: 'sigma-administracion-lugar-edit',
  templateUrl: './lugar-edit.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})

export class LugarEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGAR;
  /** Objeto usado para enviar al servicio de CRUD*/
  lugar: Lugar;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Valor mínimo permitido para la fecha  */
  public minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  public maxDate: any = null;
  /** Valor tipo Date Desde permitido para la fecha  */
  public fechaDesdeControl = new FormControl(moment(null));
  /** Valor tipo Date Hasta permitido para la fecha  */
  public fechaHastaControl = new FormControl(moment(null));
  /** Valor tipo Date Inicio permitido para la fecha  */
  public horaInicioControl = new FormControl(moment(null));
  /** Valor tipo Date Fin permitido para la fecha  */
  public horaFinControl = new FormControl(moment(null));


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: LugarService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LugarEditComponent>,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService,
    @Inject(MAT_DIALOG_DATA) data: Lugar,
    private dialog: MatDialog
  ) {
    this.lugar = data;
    this.formatoFechas();
    this.minDate = this.utilitiesService.convertStringToDate(this.lugar.fechaDesde, MY_CUSTOM_FORMATS.parseInput);
    this.maxDate = this.utilitiesService.convertStringToDate(this.lugar.fechaHasta, MY_CUSTOM_FORMATS.parseInput);

    this.form = this.formBuilder.group({
      id: [this.lugar.id, Validators.compose([
        Validators.required
      ])],
      'nombre': [this.lugar.nombre, Validators.compose([
        Validators.required,
        Validators.maxLength(300)
      ])],
      'descripcion': [this.lugar.descripcion, Validators.compose([
        Validators.maxLength(600),
      ])],
      'contactoNombre': [this.lugar.contactoNombre, Validators.compose([
        Validators.maxLength(100),
      ])],
      'contactoTelefono': [this.lugar.contactoTelefono, Validators.compose([
        Validators.maxLength(20),
      ])],
      'contactoCorreo': [this.lugar.contactoCorreo, Validators.compose([
        Validators.maxLength(100), Validators.email,
      ])],
      direccion: [this.lugar.direccion, Validators.compose([
        Validators.maxLength(100),
      ])],
      tipoLugarId: [this.lugar.tipoLugar, Validators.compose([Validators.required])],
      origenLugarId: [this.lugar.origenLugar, Validators.compose([Validators.required])],
      estadoLugarId: [this.lugar.estadoLugar, Validators.compose([Validators.required])],
      fechaDesde: [null, null],
      fechaHasta: [null, null],
      horaInicio: [null, null],
      horaFin: [null, null],
      activo: [this.lugar.activo, null],
    }, { validator: TimeValidator.timeMin });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.lugar));
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
        for (let key in this.lugar) {
          this.lugar[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.lugar).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.disabledBtn_Login = false;
      this.enviada = false;
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_lugar);
      this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disabledBtn_Login = false;
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
      this.disabledBtn_Login = true;
      this.save();
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
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

  /** Método encargado de gestionar las fechas y horas del formulario */
  formatoFechas() {
    const replaces = ['+00 ', '+00', '0 ', '.0', , ' 0 '];
    this.lugar.fechaDesdeDate = this.lugar.fechaDesde;
    this.lugar.fechaHastaDate = this.lugar.fechaHasta;

    this.lugar.horaFinTime = '2019/01/01 ' + this.lugar.horaFin;
    this.lugar.horaInicioTime = '2019/01/01 ' + this.lugar.horaInicio;
    replaces.map(data => {
      this.lugar.horaFinTime = this.lugar.horaFinTime.replace(data, '');
      this.lugar.horaInicioTime = this.lugar.horaInicioTime.replace(data, '');
    });

    this.fechaDesdeControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.lugar.fechaDesdeDate, 
        MY_CUSTOM_FORMATS.parseInput), MY_CUSTOM_FORMATS.parseInput)
    );

    this.fechaHastaControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.lugar.fechaHastaDate,
         MY_CUSTOM_FORMATS.parseInput), MY_CUSTOM_FORMATS.parseInput)
    );

    this.horaFinControl = new FormControl(moment(this.lugar.horaFinTime));
    this.horaInicioControl = new FormControl(moment(this.lugar.horaInicioTime));
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
