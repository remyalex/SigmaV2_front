import { TimeValidator } from 'src/app/shared/form/time.validator';
import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { PlanillaOperacionEdit, TipoTarjeta, PlanillaOperacion} from '../models/planilla-operacion.model';
import { PlanillaOperacionCriteria } from '../models/planilla-operacion-criteria.model';
import { PlanillaOperacionDatasource } from '../services/planilla-operacion.datasource';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PlanillaOperacionService } from '../services/planilla-operacion.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../planilla-operacion.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

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
      if (control.value != null && matchingControl.value != null && control.value != undefined && matchingControl.value != undefined && control.value != '' && matchingControl.value != '') {
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
  selector: 'sigma-produccion-planilla-operacion-edit',
  templateUrl: './planilla-operacion-edit.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },

  ],
})



export class PlanillaOperacionEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  equipo_enviar: PlanillaOperacion;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  disableEdit = true;
  tipoVehiculo: any;
  placa;
  numeroInterno;
  equipoConductor;
  equipo_clone: PlanillaOperacion;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'item',
    'descripcion',
    'calificacion',
    'variableControl',
    'lecturaInicial',
    'lecturaFinal',
    'observacion',
  ];

  dataSource: MatTableDataSource<TipoTarjeta>;
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
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PlanillaOperacionEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private datePipe: DatePipe,
    private utilitiesService: UtilitiesService,
  ) {
    this.equipo_enviar = data;
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
        'horaInicio': [data.horaInicial ? data.horaInicial : '', Validators.compose([])],
        'horaFin': [data.horaFinal  ? data.horaFinal  : '', Validators.compose([])],
        'estadoMaquinaria': [null],
        'totalHoras': [''],

      },{validator: TimeValidator.timeMin}
    );

    this.form.updateValueAndValidity();
    //this.formatoFechas();
    this.equipoConductor = { id: data.equipoConductor ? data.equipoConductor.id : '', valor: '', descripcion: '', activo: true};
    this.tipoVehiculo =  { id: data.equipoConductor.equipo.equipoTipo.id, valor: data.equipoConductor.equipo.equipoTipo.valor, descripcion: data.equipoConductor.equipo.equipoTipo.descripcion, activo: true};
    this.placa = data.equipoConductor.equipo.placa;
    this.numeroInterno = data.equipoConductor.equipo.numeroInterno;
    this.equipo_enviar.fechaOperacion = moment(this.equipo_enviar.fechaOperacion).format("DD-MM-YYYY") 
    this.changeTipoTarjeta(this.equipo_enviar.tipoTarjeta, true);
    this.changeOperador(data.tipoTarjeta)
  }

  get f() { return this.form.controls; }


  /** Método encargado de inicializar el componente */  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource =  new MatTableDataSource(this.equipo_enviar.actividades);
    this.form.get('placa').disable();
    this.form.get('numeroInterno').disable();
  }


  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.equipo_clone = { ...this.equipo_enviar };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(value => {
      if (value == 1) {
        // tslint:disable-next-line:forin
        for (const key in this.equipo_enviar) {
          //this.equipo_enviar[key] = this.clone[key];
        }
        this.dialogRef.close();
      } else {
        //this.equipo_enviar = { ...this.equipo_clone };
      }
    });
  }


   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.equipo_clone = { ...this.equipo_enviar };
    this.equipo_clone.equipoConductor = this.equipoConductor;

    let date = moment(this.equipo_clone.fechaOperacion, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let fechanOperadorMls = this.convertStringDateToTime(date)
    this.equipo_clone.fechaOperacion = fechanOperadorMls;
    
    // tslint:disable-next-line: no-unused-expression
    this.servicio.update(this.equipo_clone).subscribe(data => {
      this.enviada = false;
      this.dialogRef.close(this.form.value);
      this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
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
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  changeTipoTarjeta(event, validate) {
    if (event !== undefined && event !== null && event !== '') {

      if(event.descripcion === 'Tarjeta de Maquinaria' ) {

      this.form.get('kmsInicial').disable();
      this.form.get('kmsFinal').disable();
      this.form.get('horaInicio').disable();
      this.form.get('horaFin').disable();
      // this.form.get('estadoMaquinaria').enable();
      //this.form.get('totalHoras').enable();
      this.equipo_enviar.kmsInicial = '';
      this.equipo_enviar.kmsFinal = '';
      this.equipo_enviar.horaInicial = '';
      this.equipo_enviar.horaFinal = '';
      this.form.updateValueAndValidity();

    } else if (event.descripcion === 'Tarjeta de Vehículos' ){

      this.form.get('kmsInicial').enable();
      this.form.get('kmsFinal').enable();
      this.form.get('horaInicio').enable();
      this.form.get('horaFin').enable();
      //this.equipo_enviar.estadoMaquinaria = null;
      //this.equipo_enviar.totalHoras = '' ;
      // this.form.get('estadoMaquinaria').disable();
      //this.form.get('totalHoras').disable();
      this.form.updateValueAndValidity();
    }

    } else {
      if (!validate){
        this.equipo_enviar.kmsInicial = '';
        this.equipo_enviar.kmsFinal = '';
        this.equipo_enviar.horaInicial = '';
        this.equipo_enviar.horaFinal = '';
        this.equipo_enviar.estadoMaquinaria = null;
        this.equipo_enviar.totalHoras = '' ;
      }
    }
}
  

  changeOperador(event){
    if (event !== undefined && event !== null && event !== '') {
      if(event.idTipoVehiculo !== undefined && event.idTipoVehiculo !== null && event.idTipoVehiculo !== '') {
        let vehiculoTemp =  {
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

  convertStringDateToTime(_date) {
    const date = new Date(_date);
    const localoffset = date.getTimezoneOffset() * 60000;
    const utc = date.getTime() + localoffset; 
    return utc 
  }


  formatoFechas() {
    if (this.equipo_enviar.horaInicial != null) {
      this.equipo_enviar.horaInicial = this.equipo_enviar.horaInicial.length >= 8 ?
        this.utilitiesService.getHoraClientFormat(this.equipo_enviar.horaInicial) : this.equipo_enviar.horaInicial;
      this.equipo_enviar.horaInicial = '+00 ' + this.equipo_enviar.horaInicial + ':00.000000';
    }

    if (this.equipo_enviar.horaFinal != null) {
      this.equipo_enviar.horaFinal = this.equipo_enviar.horaFinal.length >= 8 ?
        this.utilitiesService.getHoraClientFormat(this.equipo_enviar.horaFinal) : this.equipo_enviar.horaFinal;
      this.equipo_enviar.horaFinal = '+00 ' + this.equipo_enviar.horaFinal + ':00.000000';
    }
  }


}
