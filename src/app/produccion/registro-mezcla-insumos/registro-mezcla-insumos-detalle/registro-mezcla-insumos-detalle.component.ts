import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { SolicitudMezclaInsumos, SolicitudMezclaInsumosDetalles} from '../models/registro-mezcla-insumos.model';
import { RegistroMezclaInsumoCriteria } from '../models/registro-mezcla-insumos-criteria.model';
import { RegistroMezclaInsumoDatasource } from '../services/registro-mezcla-insumos.datasource';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RegistroMezclaInsumosService } from '../services/registro-mezcla-insumos.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_REGISTRAR_MEZCLA_INSUMOS } from './../registro-mezcla-insumos.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { RegistroMezclaInsumosDeleteComponent } from '../registro-mezcla-insumos-delete/registro-mezcla-insumos-delete.component';
import { RegistroMezclaInsumosEditComponent } from '../registro-mezcla-insumos-edit/registro-mezcla-insumos-edit.component';

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
  selector: 'sigma-produccion-registro-mezcla-insumos-detalle',
  templateUrl: './registro-mezcla-insumos-detalle.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})

export class RegistroMezclaInsumosDetalleComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_MEZCLA_INSUMOS;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: RegistroMezclaInsumoDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: RegistroMezclaInsumoDatasource;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  listEnsayos: any;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new RegistroMezclaInsumoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new RegistroMezclaInsumoCriteria();
  disabledButton = false;
  lengthList: Number;
  ensayos: SolicitudMezclaInsumos[];
  pagAux: number;
  solicitudMaterial;
  material;
  pknumber;
  civnumber;
  localidad: any ;
  barrio: any ;
  loader = true;
  noInfoToShow = false;
  exportOption = true;
  dataEnsayosExport: any = [];
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [{}];
  getDataList;

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort

  columns = [
    'numeroVale',
    'planta',
    'temperatura',
    'asentamiento',
    'movil',
    'horaEntrada',
    'horaLlegada',
    'horaSalida',
    'cantidad',
    'conductor',
    'operacion'
  ];

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
    private servicio: RegistroMezclaInsumosService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RegistroMezclaInsumosDetalleComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: SolicitudMezclaInsumos,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private excelService: ExcelService,
    private router: Router,

  ) {


    this.getDataList = this.servicio.getDataDetalleService();
    this.solicitudMaterial = this.getDataList.id;
  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new RegistroMezclaInsumoDatasource(this.servicio);
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
    this.dataSource.loadData_detalles(this.criteria, this.solicitudMaterial);
    const dataMapa = this.servicio.getDataService();
      this.material = this.getDataList.material ? this.getDataList.material : '';
      this.pknumber = this.getDataList.pk;
      this.civnumber = this.getDataList.civ;
      this.localidad = this.getDataList.localidad;
      this.barrio = this.getDataList.barrio;
    
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
            let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'list')
            this.router.navigate([urlBack]);
          }
        }
      );
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


  delete(data: RegistroMezclaInsumoCriteria): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(RegistroMezclaInsumosDeleteComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(equipo: any): void {
    let dialogConfig = new MatDialogConfig();
    let equipo_edit: any = { ...equipo };
    //equipo_edit.horaInicial = equipo.horaInicial;
    //equipo_edit.horaFinal = equipo.horaFinal;
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo_edit;
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(RegistroMezclaInsumosEditComponent, dialogConfig)
      .afterClosed().subscribe(result => {
        this.loadData();
      });
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
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
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.disabledButton = true;
    this.dataSourceExport = new RegistroMezclaInsumoDatasource(this.servicio);
    const total = this.dataSource.totalelementsSubject.value;
    this.cargandoExcel = true;
    this.criteriaExport.pk = this.criteria.pk;
    this.criteriaExport.fecha = this.criteria.fecha != null ? this.criteria.fecha : '';
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    this.criteriaExport.sortBy = this.criteria.sortBy;
    this.criteriaExport.sortOrder = this.criteria.sortOrder;

    this.dataSourceExport.loadData_detalles(this.criteriaExport, this.solicitudMaterial);
    this.cargandoExcel = true;
    this.dataSourceExport.loading$.subscribe(response => {
      this.disabledButton = false;
      if (!response) {
        const content = this.dataSourceExport.ensayosData.content.map((data: SolicitudMezclaInsumosDetalles) => {
          return {
            numeroVale: data.numeroVale != null ? data.numeroVale : '',
            planta: data.planta != null ? data.planta : '',
            temperatura: data.temperatura != null ? data.temperatura : '',
            asentamiento: data.asentamiento != null ? data.asentamiento : '',
            numeroMovil: data.movil != null ? data.movil : '',
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
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'RegistroMezclaInsumosDetalles', true, order);
        this.cargandoExcel = false;
      }
    });
  }

}
