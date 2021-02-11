import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { AsignarConductoresMaquinaria, AsignarConductoresMaquinariaDetalles, RegistrarVale} from '../models/asignar-conductores-maquinaria.model';
import { AsignarConductoresMaquinariaCriteria } from '../models/asignar-conductores-maquinaria-criteria.model';
import { AsignarConductoresMaquinariaDatasource } from '../services/asignar-conductores-maquinaria.datasource';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AsignarConductoresMaquinariaService } from '../services/asignar-conductores-maquinaria.service';
import { AsignarConductoresMaquinariaDeleteComponent } from '../asignar-conductores-maquinaria-delete/asignar-conductores-maquinaria-delete.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ASIGNAR_CONDUCTORES_MAQUINARIA } from '../asignar-conductores-maquinaria.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ExcelService } from 'src/app/shared/services/excel.service';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'YYYY-MM-DD',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm:ss',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-produccion-asignar-conductores-maquinaria-detalle',
  templateUrl: './asignar-conductores-maquinaria-detalle.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})

export class AsignarConductoresMaquinariaDetalleComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_CONDUCTORES_MAQUINARIA;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: AsignarConductoresMaquinariaDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: AsignarConductoresMaquinariaDatasource;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  listEnsayos: any;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new AsignarConductoresMaquinariaCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new AsignarConductoresMaquinariaCriteria();
  disabledButton = false;
  lengthList: Number;
  ensayos: AsignarConductoresMaquinaria[];
  pagAux: number;
  solicitudMaterial;
  material;
  pknumber;
  civnumber;
  registroVale: RegistrarVale;

  localidad: any ;
  barrio: any ;
  loader = true;
  noInfoToShow = false;
  exportOption = true;
  dataEnsayosExport: any = [];
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [{}];
  datosComplete: any ;
  datasend: any = [];
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  disableSubmit = true;
  disableDelete = true;
  disableEdit = true;
  selectAll = false;

  itemsMaquinaria: any = [{id: 0, valor: 'noInterno', descripcion: 'No Interno', activo: true},
  {id: 1, valor: 'tipo', descripcion: 'Tipo', activo: true},
  {id: 2, valor: 'clasificacion', descripcion: 'Clasificación', activo: true},
  {id: 3, valor: 'placa', descripcion: 'Placa/N. Inventario', activo: true},
  {id: 4, valor: 'marca', descripcion: 'Marca', activo: true},
  {id: 5, valor: 'estado', descripcion: 'Estado', activo: true},
  {id: 6, valor: 'lugar', descripcion: 'Lugar', activo: true},
  {id: 7, valor: 'fechaInicio', descripcion: 'Fecha Inicio', activo: true},
  {id: 8, valor: 'fechaDevolucion', descripcion: 'Fecha Devolución', activo: true},
  {id: 9, valor: 'jornada', descripcion: 'Jornada', activo: true},
  {id: 10, valor: 'asignarPersonal', descripcion: 'Asignar Personal', activo: true},

  ];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort

  columns = [
    'no',
    'idConductor',
    'tipoEquipo',
    'claseEquipo',
    'placaInventario',
    'marcaEquipo',
    'estadoEquipo',
    'lugar',
    'fechaProgramacionSolicitada',
    'fechaDevolucion',
    'jornada',
    'asignarPersonal'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
   numeroVale: 'No Vale',
   planta: 'Planta',
   temperatura: 'Temperatura',
   asentamiento: 'Asentamiento',
   numeroMovil: 'Numero Móvil',
   horaEntrada: 'Hora Entrada',
   horaLlegada: 'Hora Llegada',
   horaSalida: 'Hora Salida',
   cantidad: 'Cantidad',
   conductor: 'Conductor'
  }];



  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: AsignarConductoresMaquinariaService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AsignarConductoresMaquinariaDetalleComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: AsignarConductoresMaquinaria,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private excelService: ExcelService,
  ) {
    const getDataList: any = data;
    this.solicitudMaterial = getDataList;

    this.datosComplete = data;
    this.dataSource =this.datosComplete.seleccionado
  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new AsignarConductoresMaquinariaDatasource(this.servicio);
    this.loadData();
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
  }

  Limpiar(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.criteria.fecha = this.criteria.fecha != null ? this.criteria.fecha : '';
    this.criteria.fechaRegistroEnsayo = this.criteria.fechaRegistroEnsayo != null ? this.criteria.fechaRegistroEnsayo : '';
    this.dataSource.loadData_Maquinaria(this.criteria, this.solicitudMaterial);
    const dataMapa = this.servicio.getDataService();
      this.material = this.dataSource.ensayosData ? this.dataSource.ensayosData[0].id : '';
      this.pknumber = dataMapa.pk;
      this.civnumber = dataMapa.civ;
      this.localidad = dataMapa.localidad.nombre;
      this.barrio = dataMapa.barrio.nombre;
    
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.loadData();
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.loadData();
    });
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

  getHumanDate(_date: number) {
    const date = new Date(+_date);
    return date.toISOString().split('T')[0];
  }

  getNamePersonal(payload) {
    for (let i = 0; i < payload.seleccionar.length; i++) {
      if (payload.seleccionar[i].id === payload.idCalendarioPersona){
        return payload.seleccionar[i].descripcion;
      }
    }
  }

  savePersona(payload) {
    let enableCheckbox = false ;
    let selectedPersonal = 0 ;
    this.datasend = [];
  
      for (let i = 0; i < payload.length; i++) {
      if (payload[i].formulario === true){
        let array = 
        {
          programacionDiaria: {id: payload[i].idProgDiaria},
          personaCalendario: {id: payload[i].personalProgramar != '' && payload[i].personalProgramar != undefined ? payload[i].personalProgramar.id : ''}
          }
      enableCheckbox = true;
      this.datasend = array;
      }
    }
      if (enableCheckbox) {
     
          if (this.datasend.personaCalendario.id === "" ){
          selectedPersonal = selectedPersonal + 1
          }
        
            if (selectedPersonal > 0) {
          this.snackBar.open('Debe asignar el personal en las maquinarias y equipos seleccionados', 'X', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });

        } else {
          this.disableSubmit = true;
          this.servicio.create(this.datasend).subscribe(data => {
          this.enviada = false;
          this.dialogRef.close(true);
          this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
        }, error => {
          this.disableSubmit = false;
          //this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
        });

        }
      } else {
        this.snackBar.open('Favor seleccionar al menos una solicitud', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
      }
  }

  cancelPersona(payload) {
    let enableCheckbox = false ;
    this.datasend = [];
    let idMaquinaria = '';
  
      for (let i = 0; i < payload.length; i++) {
      if (payload[i].formulario === true) {

        idMaquinaria = payload[i].id;
        let array = 
        {
          progCalendPersona: {id: payload[i].idPersonaEliminar},
          motivo: '',
          fecha: new Date
        }
      enableCheckbox = true;
      this.datasend = array;
      }
    }
      if (enableCheckbox) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};
        const dialogRef = this.dialog.open(AsignarConductoresMaquinariaDeleteComponent, dialogConfig);
        dialogRef.beforeClosed().subscribe(
          val => {
            if (val) {
              console.log(val, 'valor de la cancelacion')
              this.datasend.motivo = val.cancelacionPersona;
              this.disableSubmit = true;
              this.servicio.post_cancelar(this.datasend).subscribe(data => {
              this.enviada = false;
              this.dialogRef.close(true);
              this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                duration: 5000,
                panelClass: ['success-snackbar']
              });
            }, error => {
              this.disableSubmit = false;
              //this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
            });
            }
          }
        );
      } else {
        this.snackBar.open('Favor seleccionar al menos una solicitud', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
      }
  }


  updateCheck(payload, index, event, item) {
    for (var i = 0; i < payload.length; i++) {
      if (i === index && payload[i].formulario === true) {
        payload[i].formulario = true;
      } else {
        payload[i].formulario = false;      
      }
    }
    item.personaEliminar === true && event === true ? this.disableDelete = false : this.disableDelete = true; 
    item.personaEliminar === true && event === true ? this.disableSubmit = true : this.disableSubmit = false; 
  }
  
  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    //this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.enviada) {
      this.disableSubmit = true;
      // this.save();
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

    dialogRef.beforeClosed().subscribe(value => {
      this.dialogRef.close();
    });
 }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.disabledButton = true;
    this.dataSourceExport = new AsignarConductoresMaquinariaDatasource(this.servicio);
    const total = this.dataSource.totalelementsSubject.value;

    this.cargandoExcel = true;

    this.criteriaExport.pk = this.criteria.pk;
    this.criteriaExport.fecha = this.criteria.fecha != null ? this.criteria.fecha : '';
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    this.criteriaExport.sortBy = this.criteria.sortBy;
    this.criteriaExport.sortOrder = this.criteria.sortOrder;

    this.dataSourceExport.loadData_Maquinaria(this.criteriaExport, this.solicitudMaterial);

    this.cargandoExcel = true;
    this.dataSourceExport.loading$.subscribe(response => {
      this.disabledButton = false;
      if (!response) {
        const content = this.dataSourceExport.ensayosData.map((data: AsignarConductoresMaquinariaDetalles) => {
          return {
            numeroVale: data.numeroVale != null ? data.numeroVale : '',
            planta: data.planta != null ? data.planta : '',
            temperatura: data.temperatura != null ? data.temperatura : '',
            asentamiento: data.asentamiento != null ? data.asentamiento : '',
            numeroMovil: data.numeroMovil != null ? data.numeroMovil : '',
            horaEntrada: data.horaEntrada != null ? data.horaEntrada  : '',
            horaLlegada: data.horaLlegada != null ? data.horaLlegada : '',
            horaSalida: data.horaSalida != null ? data.horaSalida : '',
            cantidad: data.cantidad != null ? data.cantidad : '',
            conductor: data.conductor != null ? data.conductor : '',
          };
        });
        this.dataExport = [...this.headers, ...content];
        const order = [    
        'numeroVale',
        'planta',
        'temperatura',
        'asentamiento',
        'numeroMovil',
        'horaEntrada',
        'horaLlegada',
        'horaSalida',
        'cantidad',
        'conductor'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'AsignarConductoresMaquinariasDetalles', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  convertStringToTime(data) {
    const date = new Date(data);
    const localOffSet = date.getTimezoneOffset() * 60000;
    const utc = date.getTime() + localOffSet;
    return utc
  }

}
