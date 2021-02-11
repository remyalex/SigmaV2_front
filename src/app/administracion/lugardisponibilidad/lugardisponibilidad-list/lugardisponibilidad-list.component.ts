import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { LugardisponibilidadService } from '../services/lugardisponibilidad.service';
import { LugardisponibilidadCriteria } from '../models/lugardisponibilidad-criteria.model';
import { LugardisponibilidadDatasource } from '../services/lugardisponibilidad.datasource';
import { Lugardisponibilidad } from '../models/lugardisponibilidad.model';
import { LugardisponibilidadEditComponent } from '../lugardisponibilidad-edit/lugardisponibilidad-edit.component';
import { LugardisponibilidadDetailComponent } from '../lugardisponibilidad-detail/lugardisponibilidad-detail.component';
import { LugardisponibilidadDeleteComponent } from '../lugardisponibilidad-delete/lugardisponibilidad-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_ADMINISTRACION_LUGARDISPONIBILIDAD } from './../lugardisponibilidad.constant';
import { pluck } from 'rxjs/operators';
// tslint:disable-next-line:max-line-length
import { ImportarDisponibilidadLugarComponent } from 'src/app/workflow/forms/solicitud/shared/importar-disponibilidad-lugar/importar-disponibilidad-lugar.component';

/** Clase encargada de la lista del componente */
@Component({
  selector: 'sigma-administracion-lugardisponibilidad-list',
  templateUrl: './lugardisponibilidad-list.component.html'
})

export class LugardisponibilidadListComponent implements OnInit, AfterViewInit {


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private servicio: LugardisponibilidadService,
    private dialog: MatDialog,
    private excelService: ExcelService,
  ) { }
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGARDISPONIBILIDAD;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: LugardisponibilidadDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: LugardisponibilidadDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new LugardisponibilidadCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new LugardisponibilidadCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'tipo',
    'origen',
    'nombre',
    'descripcion',
    'direccion',
    'fechaDesde',
    'fechaHasta',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    tipo: this.constants.tipo,
    origen: this.constants.origen,
    nombre: this.constants.nombre,
    descripcion: this.constants.descripcion,
    direccion: this.constants.direccion,
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
    this.servicio.load$
      .pipe(pluck('accion'))
      .subscribe((accion: any) => {
        if (typeof accion !== 'undefined') {
          if (accion == 'cargue') {
            this.loadData();
          }
        }
      });
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new LugardisponibilidadDatasource(this.servicio);
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
   * @param lugardisponibilidad Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(lugardisponibilidad: Lugardisponibilidad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lugardisponibilidad;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(LugardisponibilidadEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param lugardisponibilidad Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(lugardisponibilidad: Lugardisponibilidad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lugardisponibilidad;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(LugardisponibilidadDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param lugardisponibilidad Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(lugardisponibilidad: Lugardisponibilidad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lugardisponibilidad;

    const dialogRef = this.dialog.open(LugardisponibilidadDeleteComponent, dialogConfig);

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

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.dataSourceExport = new LugardisponibilidadDatasource(this.servicio);
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
          content = this.dataSourceExport.lugardisponibilidadData.map((lugardisponibilidad: any) => {
            return {
              activo: lugardisponibilidad.activo ? this.constants.si : this.constants.no,
              tipo: lugardisponibilidad.lugar ? lugardisponibilidad.lugar.tipoLugar ? lugardisponibilidad.lugar.tipoLugar.valor : '' : '',
              origen: lugardisponibilidad.lugar ? lugardisponibilidad.lugar.origenLugar ?
                lugardisponibilidad.lugar.origenLugar.valor : '' : '',
              nombre: lugardisponibilidad.lugar ? lugardisponibilidad.lugar.nombre : '',
              descripcion: lugardisponibilidad.lugar ? lugardisponibilidad.lugar.descripcion : '',
              direccion: lugardisponibilidad.lugar ? lugardisponibilidad.lugar.direccion : '',
              lugar: lugardisponibilidad.lugarValor,
              fechaDesde: lugardisponibilidad.fechaDesde,
              fechaHasta: lugardisponibilidad.fechaHasta,
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = [
          'tipo',
          'origen',
          'nombre',
          'descripcion',
          'direccion',
          'fechaDesde',
          'fechaHasta',
          'activo',
          'acciones'
        ];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'lugardisponibilidad', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /**
   * Método encargado de importar la información.
   */
  importar(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(ImportarDisponibilidadLugarComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

}
