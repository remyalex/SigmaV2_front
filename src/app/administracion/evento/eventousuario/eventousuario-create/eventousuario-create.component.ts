import { Component, OnInit, Inject } from '@angular/core';
import { Eventousuario } from '../models/eventousuario.model';
import { EventousuarioService } from '../services/eventousuario.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EVENTOUSUARIO } from '../eventousuario.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Evento } from '../../models/evento.model';
import { EventoService } from '../../services/evento.service';
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
  formatoInput: 'YYYY/MM/DD HH:mm:ss',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

/** Clase encargada de la creación del componente */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-eventousuario-create',
  templateUrl: './eventousuario-create.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},

    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  ],
})
export class EventousuarioCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOUSUARIO;
  /** Objeto Evento usado para enviar al servicio de CRUD*/
  evento: Evento;
  /** Objeto Usuario usado para enviar al servicio de CRUD*/
  eventousuario: Eventousuario = new Eventousuario();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /** Formulario contenedor del componente */
  public form: FormGroup;
  /**  Bandera para indicar si el componente se encuentra en procesamiento por el servicio*/
  public submitted: any;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Valor mínimo permitido para la fecha  */
  public minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  public maxDate: any = null;
  /** Objeto para controlar fechas Desde */
  fechaDesdeControl = new FormControl(moment(null));
  /** Objeto para controlar fechas Hasta */
  fechaHastaControl = new FormControl(moment(null));

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param evento Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
  constructor(
    @Inject (MAT_DIALOG_DATA) evento: Evento,
    private servicio: EventoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EventousuarioCreateComponent>,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService,
  ) {
    this.evento = evento;
    this.form = this.formBuilder.group({
      'usuarioId': [null, Validators.compose([ Validators.required ])],
      'fechaDesde': [null, Validators.compose([ Validators.required ])],
      'fechaHasta': [null, Validators.compose([ Validators.required ])],
      'valorPermitidoId': [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.eventousuario = new Eventousuario();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.eventousuario = new Eventousuario();
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
    this.evento.eventosUsuario.push(this.eventousuario);
    this.servicio.update(this.evento).subscribe(
      data => {
        this.servicio.updateEventData(data);
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_eventousuario);
        this.dialogRef.close(this.eventousuario);
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
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
    moment.locale('es');
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid ) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
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
        // tslint:disable-next-line:forin
        for (const key in this.eventousuario) {
          this.eventousuario[key] =  this.clone[key];
        }
        this.dialogRef.close();
      }
    });
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

  /** Método para reasignar el usuario seleccionado al objeto
   * @param usuarioSelected objeto usuario seleccionado
   */
  setUsuarioEventousuario (usuarioSelected) {
    this.eventousuario.usuario = usuarioSelected;
  }

  /** Método para reasignar el valor ID al objeto
   * @param valorPermitido variable que va a reemplazar
   */
  setValorPermitidoEventousuario(valorPermitido) {
    this.eventousuario.valorPermitido.id = valorPermitido;
  }

}