import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { WidgetService } from '../services/widget.service';
import { WidgetCriteria } from '../models/widget-criteria.model';
import { WidgetDatasource } from '../services/widget.datasource';
import { Widget } from '../models/widget.model';
import { WidgetEditComponent } from '../widget-edit/widget-edit.component';
import { WidgetDetailComponent } from '../widget-detail/widget-detail.component';
import { WidgetDeleteComponent } from '../widget-delete/widget-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_WIDGET } from './../widget.constant';

/** Componente encargado de gestionar la visualización del listados de widget */
@Component({
  selector: 'sigma-administracion-widget-list',
  templateUrl: './widget-list.component.html'
})

export class WidgetListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_WIDGET;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: WidgetDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: WidgetDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new WidgetCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new WidgetCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'activo',
    'titulo',
    'descripcion',
    'url',
    'urlVerMas',
    'permisoId',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    activo: this.constants.activo,
    descripcion: this.constants.descripcion,
    permisoId: this.constants.permisoId,
    titulo: this.constants.titulo,
    url: this.constants.url,
    urlVerMas: this.constants.urlVerMas,
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
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private servicio: WidgetService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,

  ) { }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new WidgetDatasource(this.servicio);
    this.loadData();
  }

  /** Método encargado de invocar la petición de consulta 
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
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param widget Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(widget: Widget): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = widget;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(WidgetEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param widget Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(widget: Widget): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = widget;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(WidgetDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param widget Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(widget: Widget): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = widget;

    const dialogRef = this.dialog.open(WidgetDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    let noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (let key in this.criteria) {
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
    this.dataSourceExport = new WidgetDatasource(this.servicio);
    this.cargandoExcel = true;
    const total = this.dataSource.totalelementsSubject.value;

    const noLimpiar = ['page', 'size', 'getUrlParameters'/*, 'sortBy', 'sortOrder'*/];
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
          content = this.dataSourceExport.widgetData.map((widget: any) => {
            return {
              activo: widget.activo ? this.constants.si : this.constants.no,
              descripcion: widget.descripcion,
              permisoId: widget.permiso.nombre,
              titulo: widget.titulo,
              url: widget.url,
              urlVerMas: widget.urlVerMas,
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = ['activo', 'titulo', 'descripcion', 'url', 'urlVerMas', 'permisoId'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'widget', true, order);
        this.cargandoExcel = false;
      }
    });
  }
}
