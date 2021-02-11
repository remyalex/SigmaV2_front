import { Component, OnInit, ViewChild } from '@angular/core';
import { CONST_ADMINISTRACION_TRANSICIONCONDICIONES } from '../transicioncondiciones.constants';
import { TransicionCondicionesCriteria } from '../models/transicioncondiciones-criteria.model';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { CondicionService } from '../services/transicioncondiciones.services';
import { Condiciones } from '../models/condiciones.model';
import { TransicioncondicionesEditComponent } from '../transicioncondiciones-edit/transicioncondiciones-edit.component';
import { TransicioncondicionesDeleteComponent } from '../transicioncondiciones-delete/transicioncondiciones-delete.component';
import { CdkTable } from '@angular/cdk/table';
import { TransicionCondicionesDatasource } from '../services/transicioncondiciones.datasource';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { TerminoService } from '../services/termino.services';

/**
 * Componente encargado de gestionar la visualización del listados
 * de las condiciones de una transición
 * */
@Component({
  selector: 'sigma-administracion-transicioncondiciones-list',
  templateUrl: './transicioncondiciones-list.component.html'
})
export class TransicioncondicionesListComponent implements OnInit {

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   */
  constructor(
    private servicio: CondicionService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) { }

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TRANSICIONCONDICIONES;
  /** tabla en la que se procesará la información */
  @ViewChild('TABLE') table: CdkTable<any>;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: TransicionCondicionesDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new TransicionCondicionesCriteria();
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader: Boolean = true;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'nombre',
    'descripcion',
    'activo',
    'acciones'
  ];
  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [{
    nombre: 'Nombre',
    descripcion: 'Descripción',
    activo: 'Activo',
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new TransicionCondicionesDatasource(this.servicio);
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

  /** Método encargado de limpiar los datos del formulario de consulta */
  Limpiar(): void {
    this.criteria.nombre = '';
    this.criteria.descripcion = '';
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  /**
   * Método encargado de solicitar el listado de los pks al servicio
   */
  loadData() {
    this.dataSource.loadData(this.criteria);
  }

  /** Método encargado de gestionar la paginación de la información de
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
   * @param condicion Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(condicion: Condiciones): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = condicion;
    dialogConfig.width = '1500px';

    const dialogRef = this.dialog.open(TransicioncondicionesEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param condicion Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(condicion: Condiciones): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataOrigen = { condicion: condicion, origen: 'deleteOnModal' };
    dialogConfig.data = dataOrigen;
    const dialogRef = this.dialog.open(TransicioncondicionesDeleteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

}
