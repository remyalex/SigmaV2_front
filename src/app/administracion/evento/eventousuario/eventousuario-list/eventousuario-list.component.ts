import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { EventousuarioCriteria } from '../models/eventousuario-criteria.model';
import { EventousuarioDatasource } from '../services/eventousuario.datasource';
import { Eventousuario } from '../models/eventousuario.model';
import { EventousuarioEditComponent } from '../eventousuario-edit/eventousuario-edit.component';
import { EventousuarioDetailComponent } from '../eventousuario-detail/eventousuario-detail.component';
import { EventousuarioDeleteComponent } from '../eventousuario-delete/eventousuario-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EVENTOUSUARIO } from '../eventousuario.constant';
import { EventousuarioCreateComponent } from '../eventousuario-create/eventousuario-create.component';
import { Evento } from '../../models/evento.model';
import { EventoService } from '../../services/evento.service';

/** Clase encargada de la lista del componente */
@Component({
  selector: 'sigma-administracion-eventousuario-list',
  templateUrl: './eventousuario-list.component.html'
})

export class EventousuarioListComponent implements OnInit, AfterViewInit {

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   */
  constructor (
    private servicio: EventoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
  ) { }

  // tslint:disable-next-line:no-input-rename
  @Input('evento') evento: Evento;
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOUSUARIO;
  /** Objeto usado para enviar al servicio de CRUD*/
  objetoEvento: Evento;
  /** objeto que se usa para determinar el tamaño de la grilla del componente */
  lengthList: Number;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  listEventoUsuario: any;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader: Boolean = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow: Boolean;
  /**  Bandera para indicar si el componente se encuentra en procesamiento por el servicio*/
  cargandoExcel = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EventousuarioCriteria ();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new EventousuarioCriteria();
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: EventousuarioDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: EventousuarioDatasource;

  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'usuarioId',
    'fechaDesde',
    'fechaHasta',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    usuarioId: this.constants.usuarioId,
    fechaDesde: this.constants.fechaDesde,
    fechaHasta: this.constants.fechaHasta,
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
    this.servicio.event$.subscribe(
      (event: Evento) => {
        if (Object.keys(event).length === 0) {
          this.noInfoToShow = true;
          this.loader = false;
        } else {
          this.objetoEvento = event;
          this.listEventoUsuario = new MatTableDataSource(event.eventosUsuario);
          this.listEventoUsuario.sort = this.sort;
          this.listEventoUsuario.paginator = this.paginator;
          this.lengthList = this.listEventoUsuario.filteredData.length;
          if (this.listEventoUsuario.filteredData.length === 0) {
            this.noInfoToShow = true;
            this.loader = false;
          } else {
            this.noInfoToShow = false;
            this.loader = false;
          }
        }
      }
    );
  }

  /**
   * Método encargado de cargar los datos según el criterio
   */
  loadData (): void {
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
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.loadData();
    });
  }

  /**
   * Método encargado de realizar el llamado al componente de creación
   * de un registro de la grilla.
   */
  crear (): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.objetoEvento;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EventousuarioCreateComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param eventousuario Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit (eventousuario: Eventousuario):void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      evento: this.objetoEvento,
      eventousuarioToEdit: eventousuario
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EventousuarioEditComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   *
   * @param eventousuario Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail (eventousuario: Eventousuario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = eventousuario;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EventousuarioDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param eventousuario Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(eventousuario: Eventousuario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      evento: this.objetoEvento,
      eventousuarioToDelete: eventousuario
    };

    const dialogRef = this.dialog.open(EventousuarioDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if(val){
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
 }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.cargandoExcel = true;
    const total = this.listEventoUsuario.filteredData.length;
    this.criteriaExport.size = total;
    if (this.criteria.size > this.criteriaExport.size) {
      this.criteriaExport.size = this.criteria.size;
    }
    this.criteriaExport.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }
    let content = [];
    try {
      content = this.listEventoUsuario.filteredData.map((eventousuario: any) => {
        return {
          usuarioId: eventousuario.usuario.nombres,
          fechaDesde: eventousuario.fechaDesde,
          fechaHasta: eventousuario.fechaHasta,
          activo: eventousuario.activo ? this.constants.si : this.constants.no,
        };
      });
    } catch (error) { }
    this.dataExport = [...this.headers, ...content];
    const order = ['usuarioId', 'fechaDesde', 'fechaHasta', 'activo' ];
    this.excelService.exportAsExcelFileCustom(
      this.dataExport,
      'eventoUsuarios',
      true,
      order
    );
    this.cargandoExcel = false;
  }
}
