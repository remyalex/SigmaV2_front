import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { MensajeService } from '../services/mensaje.service';
import { MensajeCriteria } from '../models/mensaje-criteria.model';
import { MensajeDatasource } from '../services/mensaje.datasource';
import { Mensaje } from '../models/mensaje.model';
import { MensajeEditComponent } from '../mensaje-edit/mensaje-edit.component';
import { MensajeDetailComponent } from '../mensaje-detail/mensaje-detail.component';
import { MensajeLeidoComponent } from '../mensaje-delete/mensaje-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_MENSAJE } from './../mensaje.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DatePipe } from '@angular/common'

/** Componente encargado de gestionar la visualización del listados de mensajes */
@Component({
  selector: 'sigma-administracion-mensaje-list',
  templateUrl: './mensaje-list.component.html'
})

export class MensajeListComponent implements OnInit, AfterViewInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MENSAJE;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MensajeDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new MensajeCriteria();
  rangeDates: any;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    // 'id',
    // 'destinatarioId',
    'fechaRegistro',
    'mensaje',
    // 'origen',
    // 'activo',
    'leido',
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    //activo: this.constants.activo,
    //destinatarioId: this.constants.destinatarioId,
    fechaRegistro: this.constants.fechaRegistro,
    //id: this.constants.id,
    leido: this.constants.leido,
    mensaje: this.constants.mensaje,
    //origen: this.constants.origen,
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
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
	* @param snackBar Componente usado para abrir un recuadro modal
  * @param utilidades Componente de utilidades de peticiones a servicios
	* @param datepipe Componente usado para uso de fechas
  */
  constructor(
    private servicio: MensajeService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private utilidades: UtilitiesService,
    public datepipe: DatePipe,
  ) {
    const hoy = new Date();
    this.rangeDates = {
      min: new Date(1970, 1, 1),
      max: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1),
    };
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new MensajeDatasource(this.servicio);
    this.loadData();
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    if (this.criteria.fechaInicioTemp) {
      this.criteria.fechaInicio = this.utilidades.getFechaServerFormat_ddMMaaaa(this.criteria.fechaInicioTemp);
    }
    if (this.criteria.fechaFinTemp) {
      this.criteria.fechaFin = this.utilidades.getFechaServerFormat_ddMMaaaa(this.criteria.fechaFinTemp);
    }
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
   * @param mensaje Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(mensaje: Mensaje): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mensaje;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(MensajeEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param mensaje Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(mensaje: Mensaje): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mensaje;
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(MensajeDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de Mensaje Leido
   * @param mensaje Objeto que encapsula los datos del registro seleccionado
   */
  leido(mensaje: Mensaje): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mensaje;

    const dialogRef = this.dialog.open(MensajeLeidoComponent, dialogConfig);

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
  dataExport: any = [];
  exportAsXLSX(): void {
    this.cargandoExcel = true;

    const content = this.dataSource.mensajeData.map((mensaje: any) => {
      return {
        activo: mensaje.activo ? this.constants.si : this.constants.no,
        destinatarioId: mensaje.destinatarioValor,
        fechaRegistro: mensaje.fechaRegistro,
        id: mensaje.id,
        leido: mensaje.leido,
        mensaje: mensaje.mensaje,
        origen: mensaje.origen,
      };
    });
    this.dataExport = [...this.headers, ...content];
    const order = ['activo', 'destinatarioId', 'fechaRegistro', 'id', 'leido', 'mensaje', 'origen',];
    this.excelService.exportAsExcelFileCustom(this.dataExport, 'mensaje', true, order);
    this.cargandoExcel = false;
  }
}