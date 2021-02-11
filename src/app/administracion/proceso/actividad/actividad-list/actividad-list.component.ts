import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren, ElementRef, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ActividadCriteria } from '../../models/actividad-criteria.model';
import { ActividadModel } from '../../models/actividad.model';
import { ActividadEditComponent } from '../actividad-edit/actividad-edit.component';
import { ActividadDeleteComponent } from '../actividad-delete/actividad-delete.component';
import { ActividadDetailComponent } from '../actividad-detail/actividad-detail.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { ProcessService } from 'src/app/shared/services/process.service';
import { pluck } from 'rxjs/operators';
import { CONST_ADMINISTRACION_PROCESOACTIVIDAD } from '../actividades.constant';
import { ProcesoService } from '../../services/proceso.service';
import { PermisosService } from 'src/app/administracion/permisos/services/permisos.service';
import { Proceso } from '../../models/proceso.model';
import { DocumentosListComponent } from '../../transicion/documentos/documentos-list/documentos-list.component';

/** Componente encargado de gestionar la visualización del listados de actividades*/
@Component({
  selector: 'sigma-administracion-procesoactividad-list',
  templateUrl: './actividad-list.component.html'
})
export class ActividadListComponent implements OnInit, AfterViewInit {
  /** Objeto usado para enviar al servicio de CRUD*/
  objetoProceso: Proceso;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  listaActividades: MatTableDataSource<ActividadModel>;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader: Boolean = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow: Boolean;
  /** Bandera usada para mantener habilitado o desabilitado el botón exportar */
  exportOption: Boolean = false;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOACTIVIDAD;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ActividadCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new ActividadCriteria();
  /** Listado de filtros que se presentarán en la grilla  */
  filterValues = {
    nombre: '',
    descripcion: ''
  };

  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'nombre',
    'descripcion',
    'activo',
    'acciones'
  ];

  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [{
    nombre: this.constants.nombre,
    descripcion: this.constants.descripcion,
    activo: this.constants.activo
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
  * @param servicioPermiso Servicio Permisos usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
	* @param snackBar Componente usado para abrir un recuadro modal
	* @param processService Servicio Proceso usado en el componente para gestionar las peticiones
  */
  constructor(
    private servicio: ProcesoService,
    private servicioPermiso: PermisosService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private processService: ProcessService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicio.Procesodata.subscribe(
      (proceso: Proceso) => {
        if (Object.keys(proceso).length === 0) {
          this.loader = true;
        } else {
          this.objetoProceso = proceso;
          this.listaActividades = new MatTableDataSource(proceso.actividades);
          this.listaActividades.sort = this.sort;
          this.listaActividades.paginator = this.paginator;
          if (this.listaActividades.filteredData.length === 0) {
            this.noInfoToShow = true;
            this.loader = false;
            this.exportOption = true;
          } else {
            this.noInfoToShow = false;
            this.loader = false;
            this.exportOption = false;
          }
        }
      },
      error => {
        this.noInfoToShow = true;
      }
    );
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      // this.loadData();
    });
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.noInfoToShow = true;
    this.paginator.pageIndex = 0;
    this.filterValues.nombre = this.criteria.nombre.trim().toLowerCase();
    this.filterValues.descripcion = this.criteria.descripcion.trim().toLowerCase();

    this.listaActividades.filter = JSON.stringify(this.filterValues);

    this.listaActividades.filterPredicate = function (data, filter: string): boolean {
      const searchTerms = JSON.parse(filter);
      return data.nombre.toLowerCase().indexOf(searchTerms.nombre) !== -1
        && data.descripcion.toString().toLowerCase().indexOf(searchTerms.descripcion) !== -1;
    };
    if (this.listaActividades.filteredData.length > 0) {
      this.noInfoToShow = false;
      this.exportOption = false;
    } else {
      this.exportOption = true;
    }
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param procesoactividad Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(procesoactividad: ActividadModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      proceso: this.objetoProceso,
      actividadToEdit: procesoactividad
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(ActividadEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param procesoactividad Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(procesoactividad: ActividadModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = procesoactividad;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(ActividadDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param procesoactividad Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(procesoactividad: ActividadModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      proceso: this.objetoProceso,
      actividadToDelete: procesoactividad
    };

    const dialogRef = this.dialog.open(ActividadDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          // this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de realizar el llamado al componente de creación
   * de un registro de la grilla.
   */
  clear(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    let noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (let key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.search();
  }

  dataExport: any = [];
  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.cargandoExcel = true;
    const total = this.listaActividades.filteredData.length;
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
      content = this.listaActividades.filteredData.map((actividad: any) => {
        return {
          activo: actividad.activo ? this.constants.si : this.constants.no,
          descripcion: actividad.descripcion,
          nombre: actividad.nombre,
        };
      });
    } catch (error) { }
    this.dataExport = [...this.headers, ...content];
    const order = ['nombre', 'descripcion', 'activo',];
    this.excelService.exportAsExcelFileCustom(
      this.dataExport,
      'actividades',
      true,
      order
    );
    this.cargandoExcel = false;
  }
}
