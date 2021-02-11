import { Component, OnInit } from '@angular/core';
import { Equipo } from '../models/equipo.model';
import { EquipoService } from '../services/equipo.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_EQUIPO } from './../equipo.constant';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter } from 'rxjs/operators';


/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputGuion: 'YYYY-MM-DD',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm:ss',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

/** Clase encargada de la creación de equipos */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-equipo-create',
  templateUrl: './equipo-create.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})
export class EquipoCreateComponent implements OnInit {
  /**  Constantes que utiliza el componente */
  constants = CONST_ADMINISTRACION_EQUIPO;
  /** Objeto usado para enviar al servicio de CRUD*/
  equipo: Equipo = new Equipo();
   /**  Bandera para indicar si el componente se encuentra en procesamiento desde el cliente*/
  enviada = false;
   /**  Bandera para indicar si el componente se encuentra en procesamiento por el servicio*/
  disableSubmit = false;
  /** Mensaje a presentar al usuario en caso de fallas */
  mensaje = '';
  /** Formulario contenedor del componente */
  public form: FormGroup;
  /** Valor mínimo permitido para la fecha  */
  private minDate: any = null;
   /** Valor máximo permitido para la fecha  */
  private maxDate: any = null;
   /** Valor mínimo permitido para la fecha de último mantenimiento  */
  private minfechaUltimoMantenimientoDate: any = null;
   /** Valor máximo permitido para la fecha  de último mantenimiento*/
  private maxfechaSiguienteMantenimientoDate: any = null;
   /** Valor tipo Date mínimo permitido para la fecha  */
  private fechaDesdeControl = new FormControl(moment(null));
  /** Valor tipo Date máximo permitido para la fecha  */
  private fechaHastaControl = new FormControl(moment(null));
  /** Control para valor mínimo permitido para el ultimo mantenimiento  */
  private fechaUltimoMantenimientoControl = new FormControl(moment(null));
  /** Control para valor mínimo permitido para el siguiente mantenimiento  */
  private fechaSiguienteMantenimientoControl = new FormControl(moment(null));

  tiposEquipo = [];
  tiposMaquinaria = [];
  tiposOpciones = [];


   /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: EquipoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.form = this.formBuilder.group({
      'activo': [null, Validators.compose([Validators.required])],
      'anioModeloId': [null],
      'areaUmvId': [null],
      'cilindraje': [null, Validators.compose([
        Validators.min(1), Validators.max(999999999999),
        Validators.pattern('[0-9]*')
      ])],
      'claseEquipoId': [null],
      'color': [null, Validators.compose([Validators.maxLength(100)])],
      'estadoEquipoId': [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
      'fechaDesde': [null],
      'fechaHasta': [null],
      'fechaSiguienteMantenimiento': [null],
      'fechaUltimoMantenimiento': [null],
      'horaInicioProgramacion': [null],
      'horaFinProgramacion': [null],
      'horasMantenimiento': [null, Validators.compose([
        Validators.min(1), Validators.max(999999999999),
        Validators.pattern('[0-9]*')
      ])],
      'kilometrosMantenimiento': [null, Validators.compose([
        Validators.min(1), Validators.max(999999999999),
        Validators.pattern('[0-9]*')
      ])],
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
      'plazoMantenimiento': [null, Validators.compose([
        Validators.min(1), Validators.max(999999999999),
        Validators.pattern('[0-9]*')
      ])],
      'tipoCombustibleId': [null],
      'tipoEquipoId': [null, Validators.compose([Validators.required])],
      'toneladas': [null, Validators.compose([
        Validators.min(1), Validators.max(999999999999),
        Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')
      ])],
      'cantidadPasajeros': [null, Validators.compose([
        Validators.min(1), Validators.max(9999),
        Validators.pattern('[0-9]*')
      ])]
    });
  }

   /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.equipo = new Equipo();
    this.enviada = false;
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
  }


   /** Método encargado de instanciar el componente */
  new(): void {
    this.enviada = false;
    this.equipo = new Equipo();
  }

   /** Método encargado de devolver a la pagina principal el componente */
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

   /** Método encargado de realizar solicitud de almacenamiento al servicio*/
  save() {
    const equipo_clone = { ...this.equipo };
    if (typeof this.equipo.horaInicioProgramacion !== 'undefined') {
      equipo_clone.horaInicioProgramacion = this.equipo.horaInicioProgramacion + '.000000';
    }

    if (typeof this.equipo.horaFinProgramacion !== 'undefined') {
      equipo_clone.horaFinProgramacion = this.equipo.horaFinProgramacion + '.000000';
    }

    this.servicio.create(equipo_clone).subscribe(
      data => {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_equipo);
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

   /** Método encargado de validar datos de entrada solicitar
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
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
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

  /** Método encargado de darle formato a las fechas del formulario */
  formatoFechas() {
    const replaces = ['+00 ', '+00', '0 ', '.0', , ' 0 '];

    this.equipo.fechaDesdeDate = this.equipo.fechaDesde;
    this.equipo.fechaHastaDate = this.equipo.fechaHasta;
    this.equipo.fechaUltimoMantenimientoDate = this.equipo.fechaUltimoMantenimiento;
    this.equipo.fechaSiguienteMantenimientoDate = this.equipo.fechaSiguienteMantenimiento;

    this.fechaDesdeControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.equipo.fechaDesdeDate, MY_CUSTOM_FORMATS.parseInput))
    );
    this.fechaHastaControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.equipo.fechaHastaDate, MY_CUSTOM_FORMATS.parseInput))
    );

    this.fechaUltimoMantenimientoControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.equipo.fechaUltimoMantenimientoDate, MY_CUSTOM_FORMATS.parseInput))
    );
    this.fechaSiguienteMantenimientoControl = new FormControl(
      moment(this.utilitiesService.convertDateToString(this.equipo.fechaSiguienteMantenimientoDate, MY_CUSTOM_FORMATS.parseInput))
    );
  }

  /**
   * Método encargado de actualizar el formato a las fechas del formulario actualizadas
   *
   * @param atributo Nombre del atributo que se va a actualizar
   * @param event Evento con el valor actualizado por el usuario
   * @param tipo Tipo de atributo a actualizar
   * */
  changeDate(atributo: any, event: any, tipo: string = null) {
    this.equipo[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInputGuion);
    if (tipo == 'max') {
      this.minDate = event.value;
    } else if (tipo == 'min') {
      this.maxDate = event.value;
    }
  }

  /**
   * Método encargado de actualizar el formato a las fechas del formulario actualizadas
   *
   * @param atributo Nombre del atributo que se va a actualizar
   * @param event Evento con el valor actualizado por el usuario
   * @param tipo Tipo de atributo a actualizar
   */
  changeDateMantenimiento(atributo: any, event: any, tipo: string = null) {
    this.equipo[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInputGuion);
    if (tipo == 'max') {
      this.minfechaUltimoMantenimientoDate = event.value;
    } else if (tipo == 'min') {
      this.maxfechaSiguienteMantenimientoDate = event.value;
    }
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
    this.equipo.fechaDesde = "";
    this.minDate = null;
  }

  /** Método encargado de reiniciar la fecha hasta */
  clearFechaHastaValue() {
    this.fechaHastaControl.setValue([null, null]);
    this.equipo.fechaHasta = "";
    this.maxDate = null;
  }


  changeClaseEquipo() {
    this.equipo.equipoTipo = null;
    if (this.equipo.claseEquipo && this.equipo.claseEquipo.id === 161764 ) { // Clase Maquinaria
      this.tiposOpciones = this.tiposMaquinaria;
    } else {
      this.tiposOpciones = this.tiposEquipo;
    }
  }

}
