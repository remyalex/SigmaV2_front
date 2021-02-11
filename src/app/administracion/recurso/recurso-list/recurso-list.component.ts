import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_RECURSO } from '../recurso.constant';
import { RecursoDatasource } from '../services/recurso.datasource';
import { RecursoCriteria } from '../models/recurso-criteria.model';
import { RecursoService } from '../services/recurso.service';
import { Recurso } from '../models/recurso.model';
import { RecursoEditComponent } from '../recurso-edit/recurso-edit.component';
import { RecursoDetailComponent } from '../recurso-detail/recurso-detail.component';
import { RecursoDeleteComponent } from '../recurso-delete/recurso-delete.component';

/** Componente encargado de gestionar la visualización del listados de recursos */
@Component({
  selector: 'sigma-administracion-recurso-list',
  templateUrl: './recurso-list.component.html'
})

export class RecursoListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_RECURSO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: RecursoDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: RecursoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new RecursoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new RecursoCriteria();
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'id',
    'equipoId',
    'fechaDesde',
    'fechaHasta',
    'intervalo',
    'tipoAsignacionId',
    'tipoDisponibilidadId',
    'turnoId',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    activo: this.constants.activo,
    equipoId: this.constants.equipoId,
    equipocalendario: this.constants.equipocalendario,
    fechaDesde: this.constants.fechaDesde,
    fechaHasta: this.constants.fechaHasta,
    id: this.constants.id,
    intervalo: this.constants.intervalo,
    tipoAsignacionId: this.constants.tipoAsignacionId,
    tipoDisponibilidadId: this.constants.tipoDisponibilidadId,
    turnoId: this.constants.turnoId,

  }];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   */
  constructor(
    private servicio: RecursoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,

  ) { }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new RecursoDatasource(this.servicio);
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
  * Método encargado de solicitar el listado de los pks al servicio
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
   * @param recurso Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(recurso: Recurso): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = recurso;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(RecursoEditComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   *
   * @param recurso Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(recurso: Recurso): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = recurso;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(RecursoDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de eliminación
   * de un registro de la grilla.
   *
   * @param recurso Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  delete(recurso: Recurso): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = recurso;

    const dialogRef = this.dialog.open(RecursoDeleteComponent, dialogConfig);

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
    this.dataSourceExport = new RecursoDatasource(this.servicio);
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
          content = this.dataSourceExport.recursoData.map((recurso: any) => {
            return {
              activo: recurso.activo ? this.constants.si : this.constants.no,
              equipoId: recurso.equipoValor,
              equipocalendario: recurso.equipocalendario,
              fechaDesde: recurso.fechaDesde,
              fechaHasta: recurso.fechaHasta,
              id: recurso.id,
              intervalo: recurso.intervalo,
              tipoAsignacionId: recurso.tipoAsignacionValor,
              tipoDisponibilidadId: recurso.tipoDisponibilidadValor,
              turnoId: recurso.turnoValor,
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = ['activo', 'equipoId', 'equipocalendario', 'fechaDesde', 'fechaHasta', 'id', 'intervalo', 'tipoAsignacionId', 'tipoDisponibilidadId', 'turnoId',];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'recurso', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /** Método para reemplazar valor equipoId por _id del objeto recurso 
  * @param _id variable tipo numerico
  */
  setEquipoRecurso(_id: string) {
    this.criteria.equipoId = _id;
  }

  setEquipoEquipodisponibilidad(event) {
  }

}
