import { ViewChild, Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { TarjetaOperacionService } from '../services/tarjeta-operacion.service';
import { TarjetaOperacionCriteria } from '../models/tarjeta-operacion-criteria.model';
import { TarjetaOperacionDatasource } from '../services/tarjeta-operacion.datasource';
import { TarjetaOperacion } from '../models/tarjeta-operacion.model';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_PRODUCCION_TARJETA_OPERACION } from './../tarjeta-operacion.constant';


@Component({
  selector: 'sigma-produccion-tarjeta-operacion-list',
  templateUrl: './tarjeta-operacion-list.component.html'
})

export class TarjetaOperacionListComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_TARJETA_OPERACION;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: TarjetaOperacionDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new TarjetaOperacionCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new TarjetaOperacionCriteria();
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'numeroTarjeta',
    'quienDespacha',
    'direccionSalida',
    'quienRecibe',
    'direccionLlegada',
    'cantidad',
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    numeroInterno: this.constants.numeroInterno,
    placaInventario: this.constants.placaInventario,
    placa: this.constants.placa,
    movil: this.constants.movil,
    claseEquipoId: this.constants.claseEquipoId,
    tipoEquipoId: this.constants.tipoEquipoId,
    activo: this.constants.activo,
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: any;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: TarjetaOperacionService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) {

  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new TarjetaOperacionDatasource(this.servicio);
    this.loadData();

  }


  search(): void {
    console.log(JSON.stringify(this.criteria));

    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.dataSource.loadData(this.criteria);
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

  setClaseEquipoEquipo(event) {
    this.criteria.claseEquipoId = event;
  }

  setTipoEquipoEquipo(event) {
    this.criteria.tipoEquipoId = event;
  }


  exportAsXLSX(): void {
    this.cargandoExcel = true;
    this.dataSourceExport = new TarjetaOperacionDatasource(this.servicio);
    this.cargandoExcel = true;

    const total = this.dataSource.totalelementsSubject.value;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    this.dataSourceExport.loadData(this.criteriaExport);
    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        let content = [];
        try {
          content = this.dataSourceExport.equipoData.content.map((equipo: any) => {
            return {
              activo: equipo.activo ? 'Si' : 'No',
              claseEquipoId: equipo.claseEquipo ? equipo.claseEquipo.valor : '',
              movil: equipo.movil,
              numeroInterno: equipo.numeroInterno,
              placa: equipo.placa,
              placaInventario: equipo.placaInventario,
              tipoEquipoId: equipo.equipoTipo ? equipo.equipoTipo.valor : ''
            };
          });
        } catch (error) {
        }
        this.dataExport = [...this.headers, ...content];
        const order = ['numeroInterno', 'placaInventario', 'placa', 'movil', 'claseEquipoId', 'tipoEquipoId', 'activo'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'equipo', true, order);
        this.cargandoExcel = false;
      }
    });
  }


}
