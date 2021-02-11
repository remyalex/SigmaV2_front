import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { TipomantenimientoService } from '../services/tipomantenimiento.service';
import { TipomantenimientoCriteria } from '../models/tipomantenimiento-criteria.model';
import { TipomantenimientoDatasource } from '../services/tipomantenimiento.datasource';
import { Tipomantenimiento } from '../models/tipomantenimiento.model';
import { TipomantenimientoEditComponent } from '../tipomantenimiento-edit/tipomantenimiento-edit.component';
import { TipomantenimientoDetailComponent } from '../tipomantenimiento-detail/tipomantenimiento-detail.component';
import { TipomantenimientoDeleteComponent } from '../tipomantenimiento-delete/tipomantenimiento-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOMANTENIMIENTO } from './../tipomantenimiento.constant';

/** Componente encargado de gestionar la visualización del listados de tipo mantenimiento */
@Component({
  selector: 'sigma-administracion-tipomantenimiento-list',
  templateUrl: './tipomantenimiento-list.component.html'
})
export class TipomantenimientoListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOMANTENIMIENTO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: TipomantenimientoDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: TipomantenimientoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new TipomantenimientoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new TipomantenimientoCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'nombre',
    'tipoEquipoId',
    'claseMantenimientoId',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    nombre: this.constants.nombre,
    tipoEquipoId: this.constants.tipoEquipoId,
    claseMantenimientoId: this.constants.claseMantenimientoId,
    activo: this.constants.activo,
  }];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private servicio: TipomantenimientoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,

  ) { }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {

    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new TipomantenimientoDatasource(this.servicio);
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
   * @param tipomantenimiento Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(tipomantenimiento: Tipomantenimiento): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipomantenimiento;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipomantenimientoEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param tipomantenimiento Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(tipomantenimiento: Tipomantenimiento): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipomantenimiento;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipomantenimientoDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param tipomantenimiento Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(tipomantenimiento: Tipomantenimiento): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipomantenimiento;

    const dialogRef = this.dialog.open(TipomantenimientoDeleteComponent, dialogConfig);

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
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.dataSourceExport = new TipomantenimientoDatasource(this.servicio);
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
          content = this.dataSourceExport.tipomantenimientoData.map((tipomantenimiento: any) => {
            return {
              activo: tipomantenimiento.activo ? this.constants.si : this.constants.no,
              claseMantenimientoId: tipomantenimiento.claseMantenimiento.descripcion,
              nombre: tipomantenimiento.nombre,
              tipoEquipoId: tipomantenimiento.tipoEquipo.descripcion,
            };
          });
        } catch (error) { }

        this.dataExport = [...this.headers, ...content];
        const order = [
          'nombre',
          'tipoEquipoId',
          'claseMantenimientoId',
          'activo',
        ];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'TipoMantenimiento', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /** Método encargado de reemplazar el valor de claseMantenimientoId del objeto criteria
   * @param _id variable tipo String que reemplazará
   */
  setClaseMantenimientoTipomantenimiento(_id: string) {
    this.criteria.claseMantenimientoId = _id;
  }

  /** Método encargado de reemplazar el valor de tipoEquipoId del objeto criteria
   * @param _id variable tipo String que reemplazará
   */
  setTipoEquipoTipomantenimiento(_id: string) {
    this.criteria.tipoEquipoId = _id;
  }

}
