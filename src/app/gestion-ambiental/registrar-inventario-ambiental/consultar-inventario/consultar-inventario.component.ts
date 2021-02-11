import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { SigmaConfirmComponent } from '../../../shared/sigma-confirm/sigma-confirm.component';
import { CONST_INVENTARIO_REGISTRO_AMBIENTAL } from '../../../workflow/forms/ambiental/realizar-inventario-elementos-ambientales/gestion-inventario-ambietal.constant';
import { ElementoAmbientalModel } from '../../../workflow/forms/ambiental/realizar-inventario-elementos-ambientales/models/elemento-ambiental.model';
import { ExcelService } from '../../../shared/services/excel.service';

@Component({
  selector: 'sigma-consultar-inventario',
  templateUrl: './consultar-inventario.component.html'
})
export class ConsultarInventarioComponent implements OnInit {

  @Input() mantenimiento: WorkflowMantenimientoModel;
  
  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

 /** Constantes a usar en el componente */
  constants = CONST_INVENTARIO_REGISTRO_AMBIENTAL;
  currentAction: any;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  loader = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: any;
  lengthList: Number;
  noInfoToShow = false;
  dataSourceInventario: any = [];
  dataSourcePk: any = [];
  dataSourceExcel: any = [];
  content: any = [];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'numeral',
    'individuosArboreos',
    'individuosArbObs',
    'sumideros',
    'sumiderosObs',
    'sumiderosPluv',
    'sumiderosObsPluv',
    'plazas',
    'plazasObs',
    'pompeyano',
    'pompeyanoObs',
    'ePublico',
    'ePublicoObs',
    'banios',
    'baniosObs',
    'acciones'
  ];

  columnsPk = [
    'pk',
    'fechaRegistroInventario',
    'localidad',
    'upla',
    'barrio',
    'civ'
  ];

  headers = [
    {
      numeral: 'NUMERAL',
      individuosArboreos: 'INDIVIDUOS ARBOREOS',
      individuosArbObs: 'INDIVIDUOS ARBOREOS OBSERVACIONES',
      sumideros: 'SUMIDEROS SANITARIOS',
      sumiderosObs: 'SUMIDEROS OBSERVACIONES',
      sumiderosPluv: 'SUMIDEROS PLUVIAL',
      sumiderosObsPluv: 'SUMIDEROS PLUVAL OBSERVACIONES',
      plazas: 'PLAZAS',
      plazasObs: 'PLAZAS OBSERVACIONES',
      pompeyano: 'POMPEYANO',
      pompeyanoObs: 'POMPEYANO OBSERVACIONES',
      ePublico: 'ESPACIO PUBLICO',
      ePublicoObs: 'ESPACIO PUBLICO OBSERVACIONES',
      banios: 'BAÑOS',
      baniosObs: 'BAÑOS OBSERVACIONES'
    }
  ];


  /**
  * Método encargado de construir una instancia
  */
  constructor(private dialog: MatDialog, private excelService: ExcelService) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.dataSourcePk = [];
    this.dataSourceInventario = [];

    this.dataSourcePk.push(this.mantenimiento);
    if (this.mantenimiento.elementoAmbiental !== undefined) {
      this.loader = false;
      this.dataSourceInventario.push(this.mantenimiento.elementoAmbiental[0]);
      this.dataSource = new MatTableDataSource(this.dataSourceInventario);
      this.lengthList = this.dataSource.filteredData.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      if (this.dataSource.filteredData.length <= 0) {
        this.noInfoToShow = true;
      } else {
        this.noInfoToShow = false;
      }

    }
  }

  loadDataExcel(inventario: ElementoAmbientalModel) {
    this.dataSourceExcel = [];
    this.content.numeral = 1;
    this.content.individuosArboreos = this.mantenimiento.elementoAmbiental[0].cantidadArboles;
    this.content.individuosArbObs = this.mantenimiento.elementoAmbiental[0].observacionesArboles;
    this.content.sumideros = this.mantenimiento.elementoAmbiental[0].cantidadSumideros;
    this.content.sumiderosObs = this.mantenimiento.elementoAmbiental[0].observacionesSumideros;
    this.content.sumiderosPluv = this.mantenimiento.elementoAmbiental[0].cantidadSumiderosPluvial;
    this.content.sumiderosObsPluv = this.mantenimiento.elementoAmbiental[0].observacionesSumiderosPluv;
    this.content.plazas = this.mantenimiento.elementoAmbiental[0].cantidadPlazas;
    this.content.plazasObs = this.mantenimiento.elementoAmbiental[0].observacionesPlazas;
    this.content.pompeyano = this.mantenimiento.elementoAmbiental[0].cantidadPompeyano;
    this.content.pompeyanoObs = this.mantenimiento.elementoAmbiental[0].observacionesPompeyano;
    this.content.ePublico = this.mantenimiento.elementoAmbiental[0].cantidadEspacioPublico;
    this.content.ePublicoObs = this.mantenimiento.elementoAmbiental[0].observacionesEspacioP;
    this.content.banios = this.mantenimiento.elementoAmbiental[0].cantidadBanos;
    this.content.baniosObs = this.mantenimiento.elementoAmbiental[0].observacionesBanos;
    this.dataSourceExcel.push(this.content);
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.currentAction = 'list';
        this.back.emit({ currentAction: this.currentAction });
      }
    });
  }

  exportAsXLSX(inventario: ElementoAmbientalModel) {
    this.loadDataExcel(inventario);
    let exportData: any = [];
    exportData = [...this.headers, ...this.dataSourceExcel];
    this.excelService.exportAsExcelFileCustom(
      exportData,
      'ElementoAmbiental',
      true,
      ''
    );
  }

}
