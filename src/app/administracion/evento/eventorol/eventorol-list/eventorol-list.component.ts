import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { EventorolCriteria } from '../models/eventorol-criteria.model';
import { Eventorol } from '../models/eventorol.model';
import { EventorolEditComponent } from '../eventorol-edit/eventorol-edit.component';
import { EventorolDetailComponent } from '../eventorol-detail/eventorol-detail.component';
import { EventorolDeleteComponent } from '../eventorol-delete/eventorol-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EVENTOROL } from '../eventorol.constant';
import { EventorolCreateComponent } from '../eventorol-create/eventorol-create.component';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';

/** Clase encargada de la lista del componente */
@Component({
  selector: 'sigma-administracion-eventorol-list',
  templateUrl: './eventorol-list.component.html'
})

export class EventorolListComponent implements OnInit, AfterViewInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOROL;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader = false;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow = false;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /** Objeto usado para enviar al servicio de CRUD*/
  objetoEvento: Evento;
  /** variable que se usa para determinar el tamaño de la grilla EventoRol del componente */
  listEventoRol: any;
  /** variable que se usa para determinar el tamaño de la grilla del componente */
  lengthList: Number;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EventorolCriteria ();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new EventorolCriteria();
  // tslint:disable-next-line:no-input-rename
  @Input('eventoId') eventoId: number;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'rolId',
    'fechaDesde',
    'fechaHasta',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    rolId: this.constants.rolId,
    fechaDesde: this.constants.fechaDesde,
    fechaHasta: this.constants.fechaHasta,
    activo: this.constants.activo
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
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para gestionar las peticiones de excel
   * @param snackBar Componente usado para abrir un recuadro modal
   */
  constructor (
    private servicio: EventoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
  ) { }

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
          this.loader = false;
          this.objetoEvento = event;
          this.listEventoRol = new MatTableDataSource(event.eventosRol);
          this.listEventoRol.sort = this.sort;
          this.listEventoRol.paginator = this.paginator;
          this.lengthList = this.listEventoRol.filteredData.length;
          if (this.listEventoRol.filteredData.length === 0) {
            this.noInfoToShow = true;
          } else {
            this.noInfoToShow = false;
          }
        }
      }
    );
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
    });
  }

  /** Método encargado de realizar el llamado al componente de crear
  * de un registro de la grilla.
  */
  crear (): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.objetoEvento;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EventorolCreateComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   * @param eventorol Recurso seleccionado y enviado al componente de edición
   */
  edit (eventorol: Eventorol): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      evento: this.objetoEvento,
      eventorolToEdit: eventorol
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EventorolEditComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   * @param eventorol Recurso seleccionado y enviado al componente de detalle
   */
  detail (eventorol: Eventorol): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = eventorol;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EventorolDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param eventorol Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(eventorol: Eventorol): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      evento: this.objetoEvento,
      eventorolToDelete: eventorol
    };
    const dialogRef = this.dialog.open(EventorolDeleteComponent, dialogConfig);
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
    const total = this.listEventoRol.filteredData.length;
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
      content = this.listEventoRol.filteredData.map((eventorol: any) => {
        return {
          rolId: eventorol.rol.nombre,
          fechaDesde: eventorol.fechaDesde,
          fechaHasta: eventorol.fechaHasta,
          activo: eventorol.activo ? this.constants.si : this.constants.no,
        };
      });
    } catch (error) { }
    this.dataExport = [...this.headers, ...content];
    const order = ['rolId', 'fechaDesde', 'fechaHasta', 'activo' ];
    this.excelService.exportAsExcelFileCustom(
      this.dataExport,
      'eventoRol',
      true,
      order
    );
    this.cargandoExcel = false;
  }
}
