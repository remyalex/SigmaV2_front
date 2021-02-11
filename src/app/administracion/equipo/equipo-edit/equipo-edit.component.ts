import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Equipo } from '../models/equipo.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EquipoService } from '../services/equipo.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EQUIPO } from './../equipo.constant';
import * as _moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter } from 'rxjs/operators';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;

/**  Constante con los formatos soportados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'YYYY-MM-DD',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm:ss',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

/** Clase encargada de la edición de equipos */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-equipo-edit',
  templateUrl: './equipo-edit.component.html',
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})
export class EquipoEditComponent implements OnInit {
  /**  Constantes que utiliza el componente */
  constants = CONST_ADMINISTRACION_EQUIPO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  equipo: Equipo;
  /** Formulario contenedor del componente */
  form: FormGroup;
  /**  Bandera para indicar si el componente se encuentra en procesamiento desde el cliente*/
  enviada = false;
  /**  Bandera para indicar si el componente se encuentra en procesamiento por el servicio*/
  disableSubmit = false;
  /** Clon del objeto que se va a modificar información */
  clone: Equipo;
  /** Cadena de texto con la hora de inicio de la programación */
  horaInicioProgramacion: string;
  /** Cadena de texto con la hora de fin de la programación */
  horaFinProgramacion: string;
  /** Cadena de texto con la fecha de programación */
  fechaDesde: string;
  /** Clone del equipo que se esta editando */
  equipo_clone: Equipo;

  /** Valor mínimo permitido para la fecha  */
  private minDate: any = null;
  /** Valor máximo permitido para la fecha  */
  private maxDate: any = null;
  /** Valor mínimo permitido para la fecha de último mantenimiento  */
  private minfechaUltimoMantenimientoDate: any = null;
  /** Valor máximo permitido para la fecha  de último mantenimiento*/
  private maxfechaSiguienteMantenimientoDate: any = null;
  /** Valor tipo Date mínimo permitido para la fecha  */
  public fechaDesdeControl = new FormControl(moment(null));
  /** Valor tipo Date máximo permitido para la fecha  */
  public fechaHastaControl = new FormControl(moment(null));
  /** Control para valor mínimo permitido para el ultimo mantenimiento  */
  public fechaUltimoMantenimientoControl = new FormControl(moment(null));
  /** Control para valor mínimo permitido para el siguiente mantenimiento  */
  public fechaSiguienteMantenimientoControl = new FormControl(moment(null));

  tiposEquipo = [];
  tiposMaquinaria = [];
  tiposOpciones = [];


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
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param datePipe Informacion de datos que se transferiran
   * @param differs Elemento usado para mantener la información clonada.
   */
  constructor(
    private servicio: EquipoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EquipoEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Equipo,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private datePipe: DatePipe,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.equipo = data;
    this.equipo.picoYPlaca = this.equipo.picoYPlaca !== null ? this.equipo.picoYPlaca.toString() : '';
    this.formatoFechas();
    this.minDate = this.utilitiesService.convertStringToDate(this.equipo.fechaDesde, MY_CUSTOM_FORMATS.parseInput);
    this.maxDate = this.utilitiesService.convertStringToDate(this.equipo.fechaHasta, MY_CUSTOM_FORMATS.parseInput);
    this.minfechaUltimoMantenimientoDate =
      this.utilitiesService.convertStringToDate(this.equipo.fechaUltimoMantenimiento, MY_CUSTOM_FORMATS.parseInput);
    this.maxfechaSiguienteMantenimientoDate =
      this.utilitiesService.convertStringToDate(this.equipo.fechaSiguienteMantenimiento, MY_CUSTOM_FORMATS.parseInput);

    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([Validators.required])],
        'activo': [null, Validators.compose([Validators.required])],
        'anioModeloId': [null],
        'areaUmvId': [null],
        'cilindraje': [null, Validators.compose([Validators.max(999999999999), Validators.pattern('[0-9]*')])],
        'claseEquipoId': [null],
        'color': [null, Validators.compose([Validators.maxLength(100)])],
        'estadoEquipoId': [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        'fechaDesde': [null],
        'fechaHasta': [null],
        'fechaSiguienteMantenimiento': [null],
        'fechaUltimoMantenimiento': [null],
        'horaInicioProgramacion': [null],
        'horaFinProgramacion': [null],
        'horasMantenimiento': [null, Validators.compose([Validators.max(999999999999), Validators.pattern('[0-9]*')])],
        'kilometrosMantenimiento': [null, Validators.compose([Validators.max(999999999999), Validators.pattern('[0-9]*')])],
        'linea': [null, Validators.compose([Validators.maxLength(50)])],
        'lugarUmvId': [null],
        'marcaEquipoId': [null],
        'movil': [null, Validators.compose([Validators.maxLength(10)])],
        'numeroChasis': [null, Validators.compose([Validators.maxLength(20)])],
        'numeroInterno': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
        'numeroMotor': [null, Validators.compose([Validators.maxLength(20)])],
        'origenEquipoId': [null, Validators.compose([Validators.required])],
        'picoYPlaca': [null],
        'placa': [null, Validators.compose([Validators.maxLength(20)])],
        'placaInventario': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
        'plazoMantenimiento': [null, Validators.compose([Validators.max(999999999999), Validators.pattern('[0-9]*')])],
        'tipoCombustibleId': [null],
        'tipoEquipoId': [null, Validators.compose([Validators.required])],
        'toneladas': [null, Validators.compose([Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
        'cantidadPasajeros': [null, Validators.compose([Validators.max(9999), Validators.pattern('[0-9]*')])]
      }
    );
  }


  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.equipo));
    this.customerDiffer = this.differs.find(this.equipo).create();
    this.getTipos();
  }

  getTipos() {
    this.dataGenericService.cacheList(this.constants.path_administracion_equipo_tipoEquipoId);
    this.dataGenericService.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_equipo_tipoEquipoId))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        this.tiposEquipo = data.content;
        this.tiposOpciones = this.tiposEquipo;
      });

    this.dataGenericService.cacheList(this.constants.path_administracion_equipo_tipoMaquinariaId);
    this.dataGenericService.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_equipo_tipoMaquinariaId))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        this.tiposMaquinaria = data.content;
      });
      setTimeout(() => {
        this.changeClaseEquipo();
      }, 2000);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.equipo_clone = { ...this.equipo };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(value => {
      if (value == 1) {
        // tslint:disable-next-line:forin
        for (const key in this.equipo) {
          this.equipo[key] = this.clone[key];
        }
        this.dialogRef.close();
      } else {
        this.equipo = { ...this.equipo_clone };
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento al servicio*/
   save() {
    this.equipo_clone = { ...this.equipo };
    // tslint:disable-next-line: no-unused-expression

    this.servicio.update(this.equipo_clone).subscribe(data => {

      this.enviada = false;
      this.dialogRef.close(this.form.value);
      this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_equipo);
    }, error => {
      this.disableSubmit = false;
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
  }

  /** Método encargado de realizar validar datos de entrada solicitar
    * la edición de información al método save
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
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm - grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

    /**
   * Método encargado de actualizar el valor del equipo
   * en el modelo del negocio
   *
   * @param atributo Nombre del aotributo que se actualizará
   * @param objetoAtributo Valor del atributo actualizado
   */
  setDataEquipo(atributo: any, objetoAtributo: any) {
    this.equipo[atributo] = objetoAtributo;
  }

  /** Método encargado de reiniciar las fechas del ultimo mantenimiento */
  clearfechaUltimoMantenimientoValue() {
    this.fechaUltimoMantenimientoControl.setValue([null, null]);
    this.equipo.fechaUltimoMantenimiento = "";
    this.minfechaUltimoMantenimientoDate = null;
  }

  /** Método encargado de reiniciar las fechas del siguiente mantenimiento */
  clearfechaSiguienteMantenimientoValue() {
    this.fechaSiguienteMantenimientoControl.setValue([null, null]);
    this.equipo.fechaSiguienteMantenimiento = "";
    this.maxfechaSiguienteMantenimientoDate = null;
  }

   /** Método encargado de reiniciar la fecha desde */
   clearFechaDesdeValue() {
    this.fechaDesdeControl.setValue([null, null]);
    this.fechaDesde = "";
    this.equipo.fechaDesde = "";
    this.minDate = null;
  }

  /** Método encargado de reiniciar la fecha hasta */
  clearFechaHastaValue() {
    this.fechaHastaControl.setValue([null, null]);
    this.equipo.fechaHasta = "";
    this.maxDate = null;
  }

  /** Método encargado de notificar los cambios del componente hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.equipo);
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
          this.constants['path_administracion_equipo_' + record.key], this.equipo[record.key])
          .then(data => {
            if (data) {
              this.equipo[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });

  }

  /** Método encargado de darle formato a las fechas del formulario */
  formatoFechas() {

    this.equipo.fechaDesdeDate = this.equipo.fechaDesde;
    this.equipo.fechaHastaDate = this.equipo.fechaHasta;
    this.equipo.fechaUltimoMantenimientoDate = this.equipo.fechaUltimoMantenimiento;
    this.equipo.fechaSiguienteMantenimientoDate = this.equipo.fechaSiguienteMantenimiento;

    if (this.equipo.horaInicioProgramacion != null) {
      this.equipo.horaInicioProgramacion = this.equipo.horaInicioProgramacion.length >= 8 ?
        this.utilitiesService.getHoraClientFormat(this.equipo.horaInicioProgramacion) : this.equipo.horaInicioProgramacion;
      this.equipo.horaInicioProgramacion = '+00 ' + this.equipo.horaInicioProgramacion + ':00.000000';
    }

    if (this.equipo.horaFinProgramacion != null) {
      this.equipo.horaFinProgramacion = this.equipo.horaFinProgramacion.length >= 8 ?
        this.utilitiesService.getHoraClientFormat(this.equipo.horaFinProgramacion) : this.equipo.horaFinProgramacion;
      this.equipo.horaFinProgramacion = '+00 ' + this.equipo.horaFinProgramacion + ':00.000000';
    }

    if (this.equipo.fechaDesdeDate !== null) {
      this.fechaDesdeControl = new FormControl(this.equipo.fechaDesdeDate);
    }

    if (typeof this.equipo.fechaHastaDate !== 'undefined' && this.equipo.fechaHastaDate !== null) {
      this.fechaHastaControl = new FormControl(this.equipo.fechaHastaDate);
    }

    if (typeof this.equipo.fechaUltimoMantenimientoDate !== 'undefined' && this.equipo.fechaUltimoMantenimientoDate !== null) {
      this.fechaUltimoMantenimientoControl = new FormControl(this.equipo.fechaUltimoMantenimientoDate);
    }

    if (typeof this.equipo.fechaSiguienteMantenimientoDate !== 'undefined' && this.equipo.fechaSiguienteMantenimientoDate !== null) {
      this.fechaSiguienteMantenimientoControl = new FormControl(this.equipo.fechaSiguienteMantenimientoDate);
    }

    this.equipo.picoYPlaca = this.equipo.picoYPlaca;
  }

   /**
   * Método encargado de actualizar el formato a las fechas del formulario actualizadas
   *
   * @param atributo Nombre del atributo que se va a actualizar
   * @param event Evento con el valor actualizado por el usuario
   * @param tipo Tipo de atributo a actualizar
   */
  changeDate(atributo: any, event: any, tipo: string = null) {

    this.equipo[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInput);
    if (tipo == 'max') {
      this.minDate = event.value;
    } else if (tipo == 'min') {
      this.maxDate = event.value;
    }
  }

  /**
   * Método encargado de actualizar el formato a las fechas del mantenimiento actualizadas
   *
   * @param atributo Nombre del atributo que se va a actualizar
   * @param event Evento con el valor actualizado por el usuario
   * @param tipo Tipo de atributo a actualizar
   */
   changeDateMantenimiento(atributo: any, event: any, tipo: string = null) {
    this.equipo[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInput);
    if (tipo == 'max') {
      this.minfechaUltimoMantenimientoDate = event.value;
    } else if (tipo == 'min') {
      this.maxfechaSiguienteMantenimientoDate = event.value;
    }
  }

  changeClaseEquipo() {
    if (this.equipo.claseEquipo && this.equipo.claseEquipo.id === 161764 ) { // Clase Maquinaria
      this.tiposOpciones = this.tiposMaquinaria;
    } else {
      this.tiposOpciones = this.tiposEquipo;
    }
  }

}
