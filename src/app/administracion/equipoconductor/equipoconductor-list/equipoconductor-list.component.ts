import { EquipoConductorCargue } from './../models/equipoconductorcargue.model';
import { EquipoconductorDeleteComponent } from './../equipoconductor-delete/equipoconductor-delete.component';
import { EquipoConductorDetailComponent } from './../equipoconductor-detail/equipoconductor-detail.component';
import { EquipoConductorEditComponent } from './../equipoconductor-edit/equipoconductor-edit.component';
import { EquipoConductorDatasource } from './../services/equipoconductor.datasource';
import { EquipoConductorCriteria } from './../models/equipoconductor-criteria.model';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPOCONDUCTOR } from './../equipoconductor.constant';
import { pluck } from 'rxjs/operators';
import { EquipoConductorService } from '../services/equipoconductor.service';
import { EquipoConductor } from '../models/equipoconductor.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de presentar en listado los Conductores de los equipos */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-equipoconductor-list',
  templateUrl: './equipoconductor-list.component.html'
})
export class EquipoConductorListComponent implements OnInit, AfterViewInit {


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilidades Componente de utilidades de peticiones a servicios
  **/
  constructor(
    private servicio: EquipoConductorService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private utilidades: UtilitiesService,
  ) {
    const hoy = new Date();
    this.rangeDates = {
      min: new Date(1970, 1, 1),
      max: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1),
    };
  }

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCONDUCTOR;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: EquipoConductorDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoConductorCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new EquipoConductorCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'movil',
    'desde',
    'hasta',
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    // activo: this.constants.activo,
    vehiculo: this.constants.vehiculo,
    desde: this.constants.desde,
    hasta: this.constants.hasta,

  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  rangeDates: any;

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new EquipoConductorDatasource(this.servicio);
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
    this.criteria.desde = this.criteria.desde != null ? this.criteria.desde : '';
    this.criteria.hasta = this.criteria.hasta != null ? this.criteria.hasta : '';
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
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param equipoconductorcargue Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(equipoconductorcargue: EquipoConductorCargue): void {
    this.disableSubmit = true;
    this.servicio.detail(equipoconductorcargue.id).subscribe((equipoconductor: EquipoConductor ) => {
      this.disableSubmit = false;

      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'edit-modalbox';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = equipoconductor;
      dialogConfig.width = '70%';
      const dialogRef = this.dialog.open(EquipoConductorDetailComponent, dialogConfig);
    }, err => {
      this.disableSubmit = false;
    });

  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param equipoconductorcargue Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(equipoconductorcargue: EquipoConductorCargue): void {
    this.disableSubmit = true;
    this.servicio.detail(equipoconductorcargue.id).subscribe((equipoconductor: EquipoConductor) => {
      this.disableSubmit = false;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'edit-modalbox';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = equipoconductor;
      dialogConfig.width = '70%';
      const dialogRef = this.dialog.open(EquipoConductorEditComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(val => {
        if (val) {
          this.loadData();
        }
      });
    }, err => {
      this.disableSubmit = false;
    });
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param equipoconductorcargue Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(equipoconductorcargue: EquipoConductorCargue): void {
      this.disableSubmit = false;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.data = equipoconductorcargue;

      const dialogRef = this.dialog.open(EquipoconductorDeleteComponent, dialogConfig);

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

}
