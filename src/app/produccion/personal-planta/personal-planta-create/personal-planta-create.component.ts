import { ViewChild, Component, OnInit, AfterViewInit, Input, OnChanges, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { PersonalPlanta, PlanillaOperacionEdit,TipoTarjeta, Actividades } from '../models/personal-planta.model';
import { PlanillaOperacionCriteria } from '../models/personal-planta-personal.model';
import { PlanillaOperacionDatasource } from '../services/personal-planta.datasource';
import { PlanillaOperacionService } from '../services/personal-planta.service';
import { PersonalPlantaActividadesComponent } from '../personal-planta-actividades/personal-planta-actividades.component';
import { MatTableDataSource } from '@angular/material';

import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../personal-planta.constant';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalPlantaDeleteComponent } from '../personal-planta-delete/personal-planta-delete.component';



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



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-produccion-personal-planta-create',
  templateUrl: './personal-planta-create.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})
export class PersonalPlantaCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  equipo: PersonalPlanta = new PersonalPlanta();
  tipoVehiculo: any;
  placa;
  numeroInterno;
  fechaOperacion: Date;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  actividadTemporal;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  private minDate: any = null;
  private maxDate: any = null;
  private minfechaUltimoMantenimientoDate: any = null;
  private maxfechaSiguienteMantenimientoDate: any = null;
  private fechaDesdeControl = new FormControl(moment(null));
  private fechaHastaControl = new FormControl(moment(null));
  private fechaUltimoMantenimientoControl = new FormControl(moment(null));
  private fechaSiguienteMantenimientoControl = new FormControl(moment(null));
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'item',
    'descripcion',
    'calificacion',
    'variableControl',
    'lecturaInicial',
    'lecturaFinal',
    'observacion',
    'acciones'
  ];



  dataSource: MatTableDataSource<Actividades>;
  //criteria = new PlanillaOperacionCriteria();

  //dataSource: PlanillaOperacionDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new PlanillaOperacionCriteria();

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  //dataSourceExport: any;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: PlanillaOperacionService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService
  ) {
    this.form = this.formBuilder.group(
      {
        'operadorId': [null, Validators.compose([Validators.required])],
        'tipoVehiculoId': [null, Validators.compose([Validators.required])],
        'placa': [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        'numeroInterno': [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        'tipoTarjetaId': [null, Validators.compose([Validators.required])],
        'numeroTarjeta': [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        'fechaOperacion': [null, Validators.compose([Validators.required])],
        'variableControl': [null, Validators.compose([])],
        'lecturaInicial': [null, Validators.compose([])],
        'lecturaFinal': [null, Validators.compose([])],
        'kmsInicial': [null, Validators.compose([Validators.required, Validators.min(0),
          Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
        'kmsFinal': [null, Validators.compose([Validators.required, Validators.min(0),
          Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
        'horaInicial': [null, Validators.compose([])],
        'horaFinal': [null, Validators.compose([])],
        'estadoMaquinariaId': [null, Validators.compose([])],
        'totalHoras': [null, Validators.compose([])],

      }
    );
  }

  ngOnInit() {
    this.equipo = new PersonalPlanta();
    this.enviada = false;
    //this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    //this.dataSource = new PlanillaOperacionDatasource(this.servicio);
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource =  new MatTableDataSource(this.equipo.turno);
    //this.loadData();

 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
   // this.dataSource.loadData(this.criteria);
  }


  new(): void {
    this.enviada = false;
    this.equipo = new PersonalPlanta();
  }

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

  changeOperador(event){
    if (event) {
      this.placa = event.placa;
      this.numeroInterno = event.numeroInterno;
      this.tipoVehiculo = event.idTipoVehiculo;
    }

  }

  save() {
    const equipo_clone = { ...this.equipo };

    /*if (typeof this.equipo.horaInicial !== 'undefined') {
      equipo_clone.horaInicial = this.equipo.horaInicial + '.000000';
    }

    if (typeof this.equipo.horaFinal !== 'undefined') {
      equipo_clone.horaFinal = this.equipo.horaFinal + '.000000';
    }

    equipo_clone.numeroTarjeta = Number(this.equipo.numeroTarjeta);
    const date = moment(this.fechaOperacion).format();
    const fechanOpradorMls = this.convertStringDateToTime(date)
    equipo_clone.fechaOperacion = fechanOpradorMls;*/


    this.servicio.create(equipo_clone).subscribe(
      data => {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
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

  create(equipo: PersonalPlanta): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = null;
    dialogConfig.width = '40%';

    const dialogRef = this.dialog.open(PersonalPlantaActividadesComponent, dialogConfig)
      .afterClosed().subscribe(result => {

        if (result != null && result !== '')  {
          this.actividadTemporal = {
            nombreItem: result.nombreItem,
            descripcion: result.descripcion,
            calificacion: result.calificacion,
            variableControl: result.variableControl,
            lecturaInicial: result.lecturaInicial,
            lecturaFinal: result.lecturaFinal,
            activo: true,
            eliminado: 18000000,
            observacion: result.observacion
          };
          this.equipo.turno.push(this.actividadTemporal);
          this.dataSource =  new MatTableDataSource(this.equipo.turno);
        }
      });
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(payload: Actividades, index): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = payload;
    dialogConfig.width = '40%';

    const dialogRef = this.dialog.open(PersonalPlantaActividadesComponent, dialogConfig)
      .afterClosed().subscribe(result => {

        if (result != null && result !== '')  {
          this.equipo.turno[index] =  result;
          this.dataSource =  new MatTableDataSource(this.equipo.turno);


        }
        //this.loadData();
      });
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(payload, index) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    const dialogRef = this.dialog.open(PersonalPlantaDeleteComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.equipo.turno.splice(index, 1);
          this.dataSource =  new MatTableDataSource(this.equipo.turno);
        }
      }
    );
  }



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
   * Marks all controls in a form group as touched and validate
   * @param formGroup - The form group to touch
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  setDataEquipo(atributo: any, objetoAtributo: any) {
    this.equipo[atributo] = objetoAtributo;
  }


  changeDate(atributo: any, event: any, tipo: string = null) {
    this.equipo[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInputGuion);
    if (tipo == 'max') {
      this.minDate = event.value;
    } else if (tipo == 'min') {
      this.maxDate = event.value;
    }
  }

  changeDateMantenimiento(atributo: any, event: any, tipo: string = null) {
    this.equipo[atributo] = this.utilitiesService.convertDateToString(event.value, MY_CUSTOM_FORMATS.parseInputGuion);
    if (tipo == 'max') {
      this.minfechaUltimoMantenimientoDate = event.value;
    } else if (tipo == 'min') {
      this.maxfechaSiguienteMantenimientoDate = event.value;
    }
  }

  convertStringDateToTime(_date) {
    const date = new Date(_date);
    const localoffset = date.getTimezoneOffset() * 60000;
    const utc = date.getTime() + localoffset; 
    return utc 
  }


}
