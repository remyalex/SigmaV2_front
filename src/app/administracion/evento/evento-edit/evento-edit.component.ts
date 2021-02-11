import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Evento } from '../models/evento.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EVENTO } from './../evento.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { EventousuarioService } from '../eventousuario/services/eventousuario.service';
import { EventorolService } from '../eventorol/services/eventorol.service';

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

/** Clase encargada de la edición del componente */
@Component({
  selector: 'sigma-administracion-evento-edit',
  templateUrl: './evento-edit.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})
export class EventoEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Clon del objeto que se va a modificar información */
  evento: Evento;
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


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param differs Elemento usado para mantener la información clonada.
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param servicioEventousuario Servicio usado en el componente para gestionar las peticioes Evento - Usuario
   * @param servicioEventorol Servicio usado en el componente para gestionar las peticioes Evento - Rol
  */
  constructor(
    private servicio: EventoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EventoEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Evento,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
    private servicioEventousuario: EventousuarioService,
    private servicioEventorol: EventorolService
  ) {
    this.evento = data;
    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([Validators.required])],
        'activo': [null, Validators.compose([Validators.required])],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(300)])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicio.event$.subscribe(
      (objectEvento: Evento) => {
        this.evento = objectEvento;
      }
    );
    this.clone = JSON.parse(JSON.stringify(this.evento));
    this.customerDiffer = this.differs.find(this.evento).create();

    this.servicioEventousuario.changeNoticeEventoUsuario$.subscribe(
      userData$ => {
        this.servicio.detail(this.evento.id).subscribe(updateData => {
          this.evento.eventosUsuario = updateData.eventosUsuario;
        });
      });

    this.servicioEventorol.changeNoticeEventoRol$.subscribe(
      userData$ => {
        this.servicio.detail(this.evento.id).subscribe(updateData => {
          this.evento.eventosRol = updateData.eventosRol;
        });
      });
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
        for (let key in this.evento) {
          this.evento[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.evento).subscribe(data => {
      this.servicio.updateEventData('update');
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
    this.disableSubmit = true;
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
   * Método encargado de actualizar el formato de texto del formulario
   *
   * @param attr Nombre del atributo que se va a actualizar
   * @param data Valor actualizado por el usuario
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
