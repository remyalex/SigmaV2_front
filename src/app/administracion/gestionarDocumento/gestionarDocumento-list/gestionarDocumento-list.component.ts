import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { GestionarDocumentoService } from '../services/gestionarDocumento.service';
import { GestionarDocumentosource } from '../services/gestionarDocumento.datasource';
import { GestionarDocumento } from '../models/gestionarDocumento.model';
import { GestionarDocumentoDetailComponent } from '../gestionarDocumento-detail/gestionarDocumento-detail.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_GESTIONAR_DOCUMENTO } from './../gestionarDocumento.constant';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { GestionarDocumentoCriteria } from '../models/gestionarDocumento-criteria.model';

/**
 * Componente encargado de gestionar la presentación de listados de los registros
 * de la gestión de los documentos
 */
@Component({
  selector: 'sigma-administracion-gestionarDocumento-list',
  templateUrl: './gestionarDocumento-list.component.html'
})
export class GestionarDocumentoListComponent implements OnInit, AfterViewInit {


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilidades Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: GestionarDocumentoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private utilidades: UtilitiesService,
  ) { }

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONAR_DOCUMENTO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: GestionarDocumentosource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: GestionarDocumentosource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new GestionarDocumentoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new GestionarDocumentoCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'tipoDocumento', 'id', 'descripcion', 'fecha', 'autor', 'activo', 'archivo'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    tipoDocumento: this.constants.tipo,
    numero: this.constants.numero,
    descripcion: this.constants.descripcion,
    fecha: this.constants.fecha,
    autor: this.constants.autor,
    activo: this.constants.activo,
    archivo: this.constants.archivo
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new GestionarDocumentosource(this.servicio);
    this.loadData();
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {

    if (this.criteria.fechaInicioTemp) {
      this.criteria.fechaInicio = this.utilidades.getFechaServerFormat_ddMMaaaa(this.criteria.fechaInicioTemp);
    }
    if (this.criteria.fechaFinTemp) {
      this.criteria.fechaFin = this.utilidades.getFechaServerFormat_ddMMaaaa(this.criteria.fechaFinTemp);
    }
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
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   *
   * @param gestionarDocumento Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(gestionarDocumento: GestionarDocumento): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = gestionarDocumento;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(GestionarDocumentoDetailComponent, dialogConfig);
  }

  /** Sobre escritura del método de descarga para evitar realizar alguna acción
   *
   * @param gestionarDocumento Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
  */
  descargar(gestionarDocumento: GestionarDocumento): void { }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
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
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.cargandoExcel = true;
    this.dataSourceExport = new GestionarDocumentosource(this.servicio);
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
          content = this.dataSourceExport.gestionarDocumentoData.content.map((documento: any) => {
            return {
              activo: documento.activo ? 'Si' : 'No',
              tipo: documento.tipo,
              numero: documento.id,
              descripcion: documento.descripcion,
              fecha: documento.fecha,
              autor: documento.autor,
              archivo: documento.archivo,
            };
          });
        } catch (error) {
        }
        this.dataExport.push(this.headers);
        this.dataExport.push(content);
        const order = ['tipoDocumento', 'id', 'descripcion', 'fecha', 'autor', 'archivo', 'activo'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'documento', true, order);
        this.cargandoExcel = false;
      }
    });
  }

}
