import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { TipofallaService } from '../services/tipofalla.service';
import { TipofallaCriteria } from '../models/tipofalla-criteria.model';
import { TipofallaDatasource } from '../services/tipofalla.datasource';
import { Tipofalla } from '../models/tipofalla.model';
import { TipofallaEditComponent } from '../tipofalla-edit/tipofalla-edit.component';
import { TipofallaDetailComponent } from '../tipofalla-detail/tipofalla-detail.component';
import { TipofallaDeleteComponent } from '../tipofalla-delete/tipofalla-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOFALLA } from './../tipofalla.constant';

/** Componente encargado de gestionar la visualización del listados de tipos de falla*/
@Component({
  selector: 'sigma-administracion-tipofalla-list',
  templateUrl: './tipofalla-list.component.html'
})

export class TipofallaListComponent implements OnInit, AfterViewInit {

   /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   */
  constructor (
    private servicio: TipofallaService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
  ) { }

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOFALLA;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: TipofallaDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: TipofallaDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new TipofallaCriteria ();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new TipofallaCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'tipoSuperficieId',
    'descripcion',
    'valor',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    tipoSuperficieId: this.constants.tipoSuperficieId,
    descripcion: this.constants.descripcion,
    valor: this.constants.valor,
    activo: this.constants.activo,
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
    this.dataSource = new TipofallaDatasource(this.servicio);
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
   * Método encargado de llamar el servicio de carga de datos de la grilla.
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
      this.loadData ();
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
   * @param tipofalla Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit (tipofalla: Tipofalla):void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipofalla;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipofallaEditComponent, dialogConfig);
  }

   /**
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   *
   * @param tipofalla Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail (tipofalla: Tipofalla): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipofalla;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipofallaDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param tipofalla Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(tipofalla: Tipofalla): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipofalla;

    const dialogRef = this.dialog.open(TipofallaDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if ( val ) {
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
    this.dataSourceExport = new TipofallaDatasource(this.servicio);
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
        content = this.dataSourceExport.tipofallaData.map((tipofalla: any) => {
          return {
            tipoSuperficieId: tipofalla.tipoSuperficie.valor,
            descripcion: tipofalla.descripcion,
            valor: tipofalla.valor,
            activo: tipofalla.activo ? this.constants.si : this.constants.no,
          };
        });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = [ 'tipoSuperficieId', 'descripcion', 'valor', 'activo', ];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'tipofalla', true, order);
        this.cargandoExcel = false;
      }
    });
  }

   /**
   * Método encargado de asignar al modelo el valor modificado en el formulario
   *
   * @param _id Identificador único del valor a asignar en el modelo
   **/
  setTipoSuperficieTipofalla (_id: string) {
    this.criteria.tipoSuperficieId = _id;
  }

}
