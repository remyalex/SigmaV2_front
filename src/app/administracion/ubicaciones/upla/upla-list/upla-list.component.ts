import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {CONST_ADMINISTRACION_UPZ} from '../models/upla.constants';
import { UplaCriteria } from '../models/Upla.criteria.model';
import { UplaDatasource } from '../services/upla.datasource';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { UplaService } from '../services/upla.service';
import { Upla } from '../models/upla.model';
import { UplaDetailComponent } from '../upla-detail/upla-detail.component';
import { UplaEditComponent } from '../upla-edit/upla-edit.component';
import { UplaDeleteComponent } from '../upla-delete/upla-delete.component';

/** Componente encargado de gestionar la visualización del listados de uplas*/
@Component({
  selector: 'app-upla-list',
  templateUrl: './upla-list.component.html'
})
export class UplaListComponent implements OnInit, AfterViewInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_UPZ;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria: UplaCriteria;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: UplaDatasource;
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
   * @param service Servicio usado en el componente para gestionar las peticiones
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   */
  constructor(
    private service: UplaService,
    private dialog: MatDialog
   ) {
    this.criteria = new UplaCriteria();
    this.dataSource = new UplaDatasource(this.service);
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param upla Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(upla: Upla) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = upla;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(UplaDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param upla Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(upla: Upla) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = upla;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(UplaEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param upla Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(upla: Upla) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = upla;

    const dialogRef = this.dialog.open(UplaDeleteComponent, dialogConfig);

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
