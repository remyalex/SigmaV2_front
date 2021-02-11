import { Component, OnInit } from '@angular/core';
import { Evento } from '../models/evento.model';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EVENTO } from './../evento.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm:ss',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

/** Clase encargada de la creación de evento */
@Component({
  selector: 'sigma-administracion-evento-create',
  templateUrl: './evento-create.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},

    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  ],
})
export class EventoCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTO;
  /** Objeto usado para enviar al servicio de CRUD*/
  evento: Evento = new Evento();
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
  /**  Bandera para indicar si el componente se encuentra en procesamiento por el servicio*/
  public submitted: any;

  /**
  * Método encargado de construir una instancia de la clase
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: EventoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
  ) {
    this.formatoFechas();
    this.form = this.formBuilder.group({
    descripcion: [null,[ Validators.required, Validators.maxLength(300)]],
    nombre: [null, [ Validators.required, Validators.maxLength(100) ]],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.evento = new Evento();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.evento = new Evento();
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
          let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length-1],'admin')
          this.router.navigate([urlBack]);
        }
      }
    );
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    console.log(this.evento);
    this.servicio.create(this.evento).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
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
    if (this.form.valid) {
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

  /** Método encargado de gestionar las fechas y horas del formulario */
  formatoFechas() {
    const replaces = ['+00 ', '+00', '0 ', '.0', , ' 0 '];
    replaces.map(data => {
    });
  }

  /**
   * Método encargado de actualizar el formato de texto del formulario
   *
   * @param attr Nombre del atributo que se va a actualizar
   * @param data valor actualizado por el usuario
   * */
  patternString(attr, data) {
    const re = /[0-9`~!@#$%^&*()_°¬|+\-=?¡¿;:'",.<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.evento[attr] = newstr.trim();
  }

  /** 
   * Método encargado de actualizar el valor la fecha del atributo indicada en el modelo
   * @param atributo Nombre del atributo que se va a actualizar del modelo
   * @param event Evento realizado por el usuario con el valor modificado
   **/
  changeDate(atributo: any, event: any) {
    this.evento[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInput);
  }

  /** 
   * Método encargado de actualizar el valor la hora del atributo indicado en el modelo
   * @param atributo Nombre del atributo que se va a actualizar del modelo
   * @param event Evento realizado por el usuario con el valor modificado
   **/
  changeTime(atributo, event) {
    this.evento[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInputHours);
  }
}
