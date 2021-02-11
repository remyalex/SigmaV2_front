import { TimeValidator } from 'src/app/shared/form/time.validator';
import { ViewChild, Component, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { PlanillaOperacion, Actividades } from '../models/planilla-operacion.model';
import { PlanillaOperacionCriteria } from '../models/planilla-operacion-criteria.model';
import { PlanillaOperacionService } from '../services/planilla-operacion.service';
import { PlanillaOperacionActividadesComponent } from '../planilla-operacion-actividades/planilla-operacion-actividades.component';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../planilla-operacion.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { PlanillaOperacionDeleteComponent } from '../planilla-operacion-delete/planilla-operacion-delete.component';


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


export function dateCompare(desde, hasta) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[desde];
    const matchingControl = formGroup.controls[hasta];
    // set error on matchingControl if validation fails
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    if (control.value != null && matchingControl.value != null && control.value != undefined && 
      matchingControl.value != undefined && control.value != '' && matchingControl.value != '') {
      if (control.value != matchingControl.value) {
        const fechaFromHourInitial = moment('01-01-2000 ' + control.value, 'DD-MM-YYYY hh:mm');
        const fechaFromHourEnd = moment('01-01-2000 ' + matchingControl.value, 'DD-MM-YYYY hh:mm');
        //control es despues de matchingControl
        var fechamayoque = moment(fechaFromHourInitial).isBefore(fechaFromHourEnd); // true
        if (!fechamayoque) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }
      } else {
        matchingControl.setErrors(null);
      }
    } else {
      matchingControl.setErrors(null);
    }

  };

}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-produccion-planilla-operacion-create',
  templateUrl: './planilla-operacion-create.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})

export class PlanillaOperacionCreateComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  equipo: PlanillaOperacion = new PlanillaOperacion();
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
        'tipoVehiculoId': [''],
        'placa': [''],
        'numeroInterno': [''],
        'tipoTarjetaId': ['', Validators.compose([Validators.required])],
        'numeroTarjeta': ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
        'fechaOperacion': ['', Validators.compose([Validators.required])],
        'variableControl': [''],
        'lecturaInicial': [''],
        'lecturaFinal': [''],
        'kmsInicial': ['', Validators.compose([Validators.required, Validators.min(0),
        Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
        'kmsFinal': ['', Validators.compose([Validators.required, Validators.min(0),
        Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
        'horaInicio': ['', Validators.compose([])],
        'horaFin': ['', Validators.compose([])],
        'estadoMaquinariaId': [null, Validators.compose([])],
        'totalHoras': ['', Validators.compose([])],

      }, {validator: TimeValidator.timeMin}
    );
    this.form.updateValueAndValidity();


  }


  get f() { return this.form.controls; }


  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.equipo = new PlanillaOperacion();
    this.enviada = false;
    //this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    //this.dataSource = new PlanillaOperacionDatasource(this.servicio);
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new MatTableDataSource(this.equipo.actividades);
    //this.loadData();
    this.form.get('tipoVehiculoId').disable();
    this.form.get('placa').disable();
    this.form.get('numeroInterno').disable();
    this.equipo.actividades = [];
  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    // this.dataSource.loadData(this.criteria);
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.equipo = new PlanillaOperacion();
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
          const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin')
          this.router.navigate([urlBack]);
        }
      }
    );
  }


  changeOperador(event) {
    if (event !== undefined && event !== null && event !== '') {
      if (event.idTipoVehiculo !== undefined && event.idTipoVehiculo !== null && event.idTipoVehiculo !== '') {
        let vehiculoTemp = {
          id: event.idTipoVehiculo,
          valor: "",
          descripcion: "",
          activo: true
        }
        this.placa = event.placa;
        this.numeroInterno = event.numeroInterno;
        this.tipoVehiculo = vehiculoTemp;
      }
    } else {
      this.placa = '';
      this.numeroInterno = '';
      this.tipoVehiculo = '';
    }
  }


  changeTipoTarjeta(event) {
    if (event !== undefined && event !== null && event !== '') {

      if (event.descripcion === 'Tarjeta de Maquinaria') {

        this.form.get('kmsInicial').disable();
        this.form.get('kmsFinal').disable();
        this.form.get('horaInicio').disable();
        this.form.get('horaFin').disable();
        //this.form.get('estadoMaquinariaId').enable();
        //this.form.get('totalHoras').enable();
        this.equipo.kmsInicial = '';
        this.equipo.kmsFinal = '';
        this.equipo.horaInicial = '';
        this.equipo.horaFinal = '';
        //this.form.updateValueAndValidity();

      } else if (event.descripcion === 'Tarjeta de Vehículos') {

        this.form.get('kmsInicial').enable();
        this.form.get('kmsFinal').enable();
        this.form.get('horaInicio').enable();
        this.form.get('horaFin').enable();
        //this.equipo.estadoMaquinaria = null;
        // this.equipo.totalHoras = '' ;
        //this.form.get('estadoMaquinariaId').disable();
        //this.form.get('totalHoras').disable();
        //this.form.updateValueAndValidity();
      }

    } else {

      this.equipo.kmsInicial = '';
      this.equipo.kmsFinal = '';
      this.equipo.horaInicial = '';
      this.equipo.horaFinal = '';
      this.equipo.estadoMaquinaria = null;
      this.equipo.totalHoras = '';

    }
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    const equipo_clone = { ...this.equipo };

    if (typeof this.equipo.horaInicial !== undefined && this.equipo.horaInicial !== null) {
      equipo_clone.horaInicial = this.equipo.horaInicial;
    } else {
      equipo_clone.horaInicial = '';
    }

    if (typeof this.equipo.horaFinal !== undefined && this.equipo.horaFinal !== null) {
      equipo_clone.horaFinal = this.equipo.horaFinal;
    } else {
      equipo_clone.horaFinal = '';
    }

    equipo_clone.numeroTarjeta = Number(this.equipo.numeroTarjeta);
    var date = moment(this.fechaOperacion, 'DD-MM-YYYY').format('YYYY-MM-DD');
    var fechanOperadorMls = this.convertStringDateToTime(date)
    equipo_clone.fechaOperacion = fechanOperadorMls;

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

  create(equipo: PlanillaOperacion): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = null;
    dialogConfig.width = '40%';

    const dialogRef = this.dialog.open(PlanillaOperacionActividadesComponent, dialogConfig)
      .afterClosed().subscribe(result => {
        if (result != null && result !== '') {
          let actividad = { ...result }
          let actividadTemporal: Actividades = {
            nombreItem: actividad.nombreItem,
            descripcion: actividad.descripcion,
            calificacion: actividad.calificacion,
            variableControl: actividad.variableControl,
            lecturaInicial: actividad.lecturaInicial,
            lecturaFinal: actividad.lecturaFinal,
            activo: true,
            eliminado: 18000000,
            observacion: actividad.observacion
          };
          this.equipo.actividades.push(actividadTemporal);
          this.dataSource = new MatTableDataSource(this.equipo.actividades);
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
    let actividadEdit: Actividades = { ...payload }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = actividadEdit;
    dialogConfig.width = '40%';

    const dialogRef = this.dialog.open(PlanillaOperacionActividadesComponent, dialogConfig)
      .afterClosed().subscribe(result => {
        if (result != null && result !== '') {
          this.equipo.actividades[index] = result;
          this.dataSource = new MatTableDataSource(this.equipo.actividades);
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
    let dataDelete: any = {
      data: '',
      bandera: 'Eliminar_Actividad'
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = dataDelete;
    const dialogRef = this.dialog.open(PlanillaOperacionDeleteComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.equipo.actividades.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.equipo.actividades);
        }
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

  setDataEquipo(atributo: any, objetoAtributo: any) {
    this.equipo[atributo] = objetoAtributo;
  }

  convertStringDateToTime(_date) {
    const date = new Date(_date);
    const localoffset = date.getTimezoneOffset() * 60000;
    const utc = date.getTime() + localoffset;
    return utc
  }

}
