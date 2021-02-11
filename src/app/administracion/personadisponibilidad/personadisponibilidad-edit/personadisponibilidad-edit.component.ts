import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Personadisponibilidad } from '../models/personadisponibilidad.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PersonadisponibilidadService } from '../services/personadisponibilidad.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PERSONADISPONIBILIDAD } from './../personadisponibilidad.constant';
import * as _moment from 'moment';
// Date time completo
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { PersonadisponibilidadCriteria } from '../models/personadisponibilidad-criteria.model';
import { CalendarEvent } from 'calendar-utils';
import { PersonadisponibilidadValidator } from 'src/app/shared/form/personadisponibilidad.validator';
import { CalendariosUtilitiesService } from '../../recurso/services/calendariosUtilities.service';

/** Componente encargado de gestionar la edición de persona disponibilidad */
@Component({
  selector: 'sigma-administracion-personadisponibilidad-edit',
  templateUrl: './personadisponibilidad-edit.component.html'
})
export class PersonadisponibilidadEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONADISPONIBILIDAD;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  personadisponibilidad: Personadisponibilidad;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** lista que recibe datos del componente sigma-schedule */
  listaCalendario: any;
  /** Bandera usada para mantener habilitado o desabilitado el botón -Ocultar o Disponibilidad*/
  calendariocompletado = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Clón del objeto que se va a modificar información */
  clone: any;
  /** Bandera usada para mantener habilitado o desabilitado el ícono del botón */
  cargandoDisponibilidad = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new PersonadisponibilidadCriteria();
  /** Valor mínimo permitido para la fecha  */
  public minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  public maxDate: any = null;
  /** objeto array CalendarEvents */
  events: CalendarEvent[] = [];
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mostrar = '';
  /** variable tipo String usada en el componente */
  fechaConsultaCalendario: string = '';
  /** Mensaje de error carga de datos de Persona */
  errorsPersona = [
    { name: 'errorDatosNecesariosPersona', message: this.constants.datosNecesarioPersona }
  ];
  /** Mensaje de error carga de datos de Intervalos Fecha */
  errorsIntervalFechas = [
    { name: 'intervaloFechasNoPermitido', message: this.constants.intervaloFechasNoPermitido }
  ];
  /** Mensaje de error carga de datos de Intervalo */
  errorsInterval = [
    { name: 'intervaloNoPermitido', message: this.constants.intervaloNoPermitido }
  ];

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param servicioPersonaDisponibilidad Servicio Persona Disponibilidad
  * usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param calendariosUtilitiesService Servicio calendario usado en el componente para gestionar las peticiones
  */
  constructor(
    private servicio: PersonadisponibilidadService,
    private snackBar: MatSnackBar,
    private servicioPersonaDisponibilidad: PersonadisponibilidadService,
    private dialogRef: MatDialogRef<PersonadisponibilidadEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Personadisponibilidad,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
    private calendariosUtilitiesService: CalendariosUtilitiesService
  ) {
    this.personadisponibilidad = data;
    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([Validators.required])],
        'activo': [null, Validators.compose([Validators.required])],
        'fechaDesde': [{ value: null, disabled: false }, Validators.compose([Validators.required])],
        'fechaHasta': [{ value: null, disabled: false }, Validators.compose([Validators.required])],
        'intervalo': [{ value: null, disabled: false }, Validators.compose([Validators.required])],
        'persona': [{ value: null, disabled: true }, Validators.compose([Validators.required])],
        'turnoId': [null, Validators.compose([Validators.required])],
      }
      // , {
      // validator: [
      //   PersonadisponibilidadValidator.datosNecesarios,
      //   PersonadisponibilidadValidator.intervaloIgual
      // ]
    // }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.stringify(this.personadisponibilidad);
    this.customerDiffer = this.differs.find(this.personadisponibilidad).create();
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(new Date());
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
        this.personadisponibilidad = JSON.parse(this.clone);
        this.servicio.notifyChangeModel(this.personadisponibilidad);
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.personadisponibilidad).subscribe(data => {
      this.servicioPersonaDisponibilidad.disparar('cargue');
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disableSubmit = false;
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      if (error.status == 500 || error.status == 0) {
        this.snackBar.open(this.constants.error500, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
      }
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
    const changes = this.customerDiffer.diff(this.personadisponibilidad);
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
          this.constants['path_administracion_personadisponibilidad_' + record.key], this.personadisponibilidad[record.key])
          .then(data => {
            if (data) {
              this.personadisponibilidad[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
    */
  }

  /** Método encargado de validar dato persona del formulario y cargar calendarios
  * @param persona objeto que será validado
  */
  onChangeAutocompleteForm(persona: any): void {
    if (typeof persona !== 'undefined' && typeof persona.id !== 'undefined') {
      this.loadCalendarios();
    }
  }

  /** Método encargado de cargar los calendarios */
  loadCalendarios(): void {
    this.calendariocompletado = false;
    this.cargandoDisponibilidad = true;
    this.events = [];
    this.servicio.listCalendariosByPersonaAndFecha(this.personadisponibilidad.persona.id,
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

  /** Método encargado para retornar fecha con formato y cargar calendarios
   * @param dateCalendar fecha seleccionada
   */
  getEventMonthChanged(dateCalendar: any) {
    this.fechaConsultaCalendario = this.utilitiesService.getFechaServerFormatLite_ddMMaaaa(dateCalendar);
    this.loadCalendarios();
  }

}
