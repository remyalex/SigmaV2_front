import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {CONST_ADMINISTRACION_CUADRANTE} from '../models/cuadrante.constants';
import { CuadranteCriteria } from '../models/cuadrante.criteria.model';
import { CuadranteDatasource } from '../services/cuadrante.datasource';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { CuadranteService } from '../services/cuadrante.service';
import { Cuadrante } from '../models/cuadrante.model';
import { CuadranteDetailComponent } from '../cuadrante-detail/cuadrante-detail.component';
import { CuadranteEditComponent } from '../cuadrante-edit/cuadrante-edit.component';
import { CuadranteDeleteComponent } from '../cuadrante-delete/cuadrante-delete.component';

/** Componente encargado de gestionar la visualización del listados de cuadrantes*/
@Component({
  selector: 'app-cuadrante-list',
  templateUrl: './cuadrante-list.component.html'
})
export class CuadranteListComponent implements OnInit, AfterViewInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_CUADRANTE;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria: CuadranteCriteria;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: CuadranteDatasource;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id', 'nombre', 'valor', 'activo', 'acciones'
  ];

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
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   */
  constructor(
    private service: CuadranteService,
    private dialog: MatDialog
   ) {
    this.criteria = new CuadranteCriteria();
    this.dataSource = new CuadranteDatasource(this.service);
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param cuadrante Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(cuadrante: Cuadrante) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = cuadrante;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(CuadranteDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param cuadrante Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(cuadrante: Cuadrante) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = cuadrante;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(CuadranteEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param cuadrante Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(cuadrante: Cuadrante) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = cuadrante;

    const dialogRef = this.dialog.open(CuadranteDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
  * Método encargado de solicitar el listado de los pks al servicio
  */
  loadData() {
    this.dataSource.loadData(this.criteria);
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
  clear() {
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

  /** Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit() {
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


}
