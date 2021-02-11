import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Lugardisponibilidad } from '../models/lugardisponibilidad.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LugardisponibilidadService } from '../services/lugardisponibilidad.service';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_LUGARDISPONIBILIDAD } from './../lugardisponibilidad.constant';
import * as _moment from 'moment';
// Date time completo
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { LugardisponibilidadCriteria } from '../models/lugardisponibilidad-criteria.model';
import { CalendarEvent } from 'calendar-utils';
import { LugardisponibilidadValidator } from 'src/app/shared/form/lugardisponibilidad.validator';
import { CalendariosUtilitiesService } from '../../recurso/services/calendariosUtilities.service';

/** Clase encargada de la edición del componente */
@Component({
  selector: 'sigma-administracion-lugardisponibilidad-edit',
  templateUrl: './lugardisponibilidad-edit.component.html'
})
export class LugardisponibilidadEditComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGARDISPONIBILIDAD;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  lugardisponibilidad: Lugardisponibilidad;
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
  /** Objeto usado para mostrar diferente texto en el botón */
  mostrar: string = '';
  /** variable que recibe fechas con formato */
  fechaConsultaCalendario: string = '';
  /** Objeto que para indicar si el ícono se muestra */
  cargandoDisponibilidad = false;
  /** Objeto que recibe eventos del componente - sigma-schedule */
  listaCalendario: any;
  /** Objeto que para indicar si el botón se muestra */
  calendariocompletado: boolean = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new LugardisponibilidadCriteria();
  /** Array que recibe objetos Calendar*/
  events: CalendarEvent[] = [];
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
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param data Información a procesar
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param calendariosUtilitiesService Componente Calendario de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: LugardisponibilidadService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LugardisponibilidadEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Lugardisponibilidad,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
    private calendariosUtilitiesService: CalendariosUtilitiesService
  ) {
    this.lugardisponibilidad = data;
    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([Validators.required])],
        'activo': [null, Validators.compose([Validators.required])],
        'fechaDesde': [{ value: null, disabled: false }, Validators.compose([Validators.required])],
        'fechaHasta': [{ value: null, disabled: false }, Validators.compose([Validators.required])],
        'intervalo': [{ value: null, disabled: false }, Validators.compose([Validators.required])],
        'lugar': [{ value: null, disabled: true }, Validators.compose([Validators.required])],
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
    this.clone = JSON.parse(JSON.stringify(this.lugardisponibilidad));
    this.customerDiffer = this.differs.find(this.lugardisponibilidad).create();
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(new Date());
    this.loadCalendarios();
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
      if (val == 1) {
        for (let key in this.lugardisponibilidad) {
          this.lugardisponibilidad[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.lugardisponibilidad).subscribe(data => {
      this.servicio.disparar('cargue');
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

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.lugardisponibilidad);
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
          this.constants['path_administracion_lugardisponibilidad_' + record.key], this.lugardisponibilidad[record.key])
          .then(data => {
            if (data) {
              this.lugardisponibilidad[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
    */
  }

  /** Método encargado de validar el parámetro que sea diferente de indefinido
   *  y llama al método loadCalendarios() 
   * @param lugar Objeto que será validado para permitir cargar calendarios
   */
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
