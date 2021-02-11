import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Eventousuario } from '../models/eventousuario.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
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

/** Clase encargada de la edición del componente */
@Component({
  selector: 'sigma-administracion-eventousuario-edit',
  templateUrl: './eventousuario-edit.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},

    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  ],
})
export class EventousuarioEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOUSUARIO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto evento usado para enviar al servicio de CRUD*/
  evento: Evento;
  /** Objeto Usuario usado para enviar al servicio de CRUD*/
  eventousuario: Eventousuario;
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
  /** Valor mínimo permitido para la fecha  */
  private minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  private maxDate: any = null;
  /** Valor tipo Date desde permitido para la fecha  */
  fechaDesdeControl = new FormControl(moment(null));
  /** Valor tipo Date hasta permitido para la fecha  */
  fechaHastaControl = new FormControl(moment(null));

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
  * @param differs Elemento usado para mantener la información clonada.
  */
  constructor(
    private servicio: EventoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EventousuarioEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.evento = data.evento;
    this.eventousuario = data.eventousuarioToEdit;

    this.form = this.formBuilder.group(
      {
        'activo': [null, Validators.compose([ Validators.required ])],
        'usuarioId': [null, Validators.compose([ Validators.required ])],
        'fechaDesde': [null, Validators.compose([ Validators.required ])],
        'fechaHasta': [null, Validators.compose([ Validators.required ])],
        'valorPermitidoId': [null]
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.eventousuario));
    this.customerDiffer = this.differs.find(this.eventousuario).create();
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        // tslint:disable-next-line:forin
        for (const key in this.eventousuario) {
          this.eventousuario[key] =  this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    for (let index = 0; index < this.evento.eventosUsuario.length; index++) {
      if (this.eventousuario.id === this.evento.eventosUsuario[index].id) {
        this.evento.eventosUsuario[index] = this.eventousuario;
      }
    }

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
    });
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

  /** Método para reasignar el usuario seleccionado al objeto
   * @param usuario objeto usuario seleccionado
   */
  setUsuarioEventousuario (usuario) {
    this.eventousuario.usuario = usuario;
  }

  /** Método para reasignar el valor ID al objeto
   * @param _id variable que va a reemplazar
   */
  setValorPermitidoEventousuario(_id: number) {
    this.eventousuario.valorPermitido.id = _id;
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.eventousuario);
    if (changes) {
      this.customerChanged(changes);
    }
  }
 
  /**
   * Método en cargado de actualizar el modelo del componente una
   * vez notificado un cambio en los campos
   *
   * @param changes Diccionario de claves que se modificaron
   */
  customerChanged(changes: KeyValueChanges<string, any>) {
    changes.forEachChangedItem((record: any) => {
      if (record.key.length > 2 && record.key.search('Id') > -1) {
        this.servicio.searchByList(
          this.constants['path_administracion_eventousuario_' + record.key], this.eventousuario[record.key])
          .then(data => {
            if (data) {
              this.eventousuario[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
  }

}