import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { AuditoriaService } from '../services/auditoria.service';
import { AuditoriaCriteria } from '../models/auditoria-criteria.model';
import { AuditoriaDatasource } from '../services/auditoria.datasource';
import { Auditoria } from '../models/auditoria.model';
import { AuditoriaDetailComponent } from '../auditoria-detail/auditoria-detail.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_AUDITORIA } from './../auditoria.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/**
 * Componente usado para presentar el listado de
 * registros de auditoria de un elemento
 **/
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-auditoria-list',
  templateUrl: './auditoria-list.component.html'
})
export class AuditoriaListComponent implements OnInit, AfterViewInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_AUDITORIA;
  /** Variable usada como bandera para indicar si se está generando el excel */
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: AuditoriaDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new AuditoriaCriteria();
  public usuarioId: any;
  /**  Columnas de la grilla que se van a exportar */
  dataExport =  [];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id',
    'usuario',
    'accion',
    'tabla',
    'objetoid',
    'fecha',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    accion: this.constants.accion,
    data: this.constants.data,
    fecha: this.constants.fecha,
    id: this.constants.id,
    objetoid: this.constants.objetoid,
    tabla: this.constants.tabla,
    usuario: this.constants.usuario,

  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: AuditoriaService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
  ) { }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new AuditoriaDatasource(this.servicio, this.utilitiesService);
    this.loadData();
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
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(auditoria: Auditoria): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = auditoria;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(AuditoriaDetailComponent, dialogConfig);
  }

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

    const content = this.dataSource.auditoriaData.map((auditoria: any) => {
      return {
        accion: auditoria.accion,
        data: auditoria.data,
        fecha: auditoria.fecha,
        id: auditoria.id,
        objetoid: auditoria.objetoid,
        tabla: auditoria.tabla,
        usuario: auditoria.usuario,
      };
    });
    this.dataExport = [...this.headers, ...content];
    const order = ['accion', 'data', 'fecha', 'id', 'objetoid', 'tabla', 'usuario',];
    this.excelService.exportAsExcelFileCustom(this.dataExport, 'auditoria', true, order);
    this.cargandoExcel = false;
  }

}
