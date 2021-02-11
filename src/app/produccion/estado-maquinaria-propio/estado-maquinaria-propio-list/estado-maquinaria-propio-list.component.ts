import { ViewChild, Component, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { EstadoMaquinariaPropioService } from '../services/estado-maquinaria-propio.service';
import { EquipoCriteria } from '../models/estado-maquinaria-propio-criteria.model';
import { EquipoDatasource } from '../services/estado-maquinaria-propio.datasource';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_CONSULTA_ESTADO_MAQUINARIA } from './../estado-maquinaria-propio.constant';
import * as _moment from 'moment';

@Component({
  selector: 'sigma-administracion-estado-maquinaria-propio-list',
  templateUrl: './estado-maquinaria-propio-list.component.html'
})

export class EstadoMaquinariaPropioListComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_CONSULTA_ESTADO_MAQUINARIA;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: EquipoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new EquipoCriteria();
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'numeroInterno',
    'placa',
    'claseEquipoId',
    'equipoTipoId',
    'origenEquipoId'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    numeroInterno: this.constants.numeroInterno,
    placa: this.constants.placa,
    claseEquipoId: this.constants.clasificacion,
    equipoTipoId: this.constants.tipoMaquinaria,
    origenEquipoId: this.constants.propio,
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
    private servicio: EstadoMaquinariaPropioService,
    private excelService: ExcelService,
  ) {}

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new EquipoDatasource(this.servicio);
    let now = _moment();
    this.criteria.fechaHasta = '';
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
    this.cargandoExcel = true;
    this.dataSourceExport = new EquipoDatasource(this.servicio);
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
              origenEquipoId: equipo.origenEquipo.valor === "PROPIO" ? 'Si' : 'No',
              claseEquipoId: equipo.claseEquipo ? equipo.claseEquipo.valor : '',
              numeroInterno: equipo.numeroInterno,
              placa: equipo.placa,
              equipoTipoId: equipo.equipoTipo ? equipo.equipoTipo.valor : ''
            };
          });
        } catch (error) {
        }
        this.dataExport = [...this.headers, ...content];
        const order = ['numeroInterno', 'placa', 'claseEquipoId', 'equipoTipoId', 'origenEquipoId'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'equipo', true, order);
        this.cargandoExcel = false;
      }
    });
  }


}
