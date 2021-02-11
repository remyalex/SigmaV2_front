import { CONST_ADMINISTRACION_PROCESOACTIVIDAD } from './../../actividad/actividades.constant';
import { CONST_ADMINISTRACION_DOCUMENTO } from './../documentos/documentos.constant';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ProcesotransicionCriteria } from '../../models/transicion-criteria.model';
import { TransicionModel } from '../../models/transicion.model';
import { TransicionEditComponent } from '../transicion-edit/transicion-edit.component';
import { TransicionDetailComponent } from '../transicion-detail/transicion-detail.component';
import { TransicionDeleteComponent } from '../transicion-delete/transicion-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PROCESOTRANSICION } from '../transicion.constant';
import { ProcessService } from 'src/app/shared/services/process.service';
import { pluck } from 'rxjs/operators';
import { PermisosService } from '../../../permisos/services/permisos.service';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso } from '../../models/proceso.model';
import { DocumentosListComponent } from '../documentos/documentos-list/documentos-list.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

/** Componente encargado de gestionar la visualización del listados de transición */
@Component({
  selector: 'sigma-administracion-procesotransicion-list',
  templateUrl: './transicion-list.component.html'
})
export class TransicionListComponent implements OnInit {

  /** objeto que recibe data enviada al componente */
  objetoProceso: Proceso;
  /** Objeto lista de Transiciones usado en la grilla del componente */
  listaTransiciones: MatTableDataSource<TransicionModel>;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader: Boolean = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow: Boolean;
  /**  Variable que se encarga de habilitar la opcion de exportar */
  exportOption: Boolean = false;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOTRANSICION;
  constantsDocumentos = CONST_ADMINISTRACION_DOCUMENTO;
  constantsActividades = CONST_ADMINISTRACION_PROCESOACTIVIDAD;
  constantsTransiciones = CONST_ADMINISTRACION_PROCESOTRANSICION;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ProcesotransicionCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new ProcesotransicionCriteria();
  /** objeto para valores de los filtros */
  filterValues = {
    nombre: '',
    descripcion: ''
  }

  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'nombre',
    'descripcion',
    'actividadInicial.nombre',
    'actividadFinal.nombre',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    nombre: this.constants.nombre,
    descripcion: this.constants.descripcion,
    actividadInicioId: this.constants.actividadInicioId,
    actividadFinId: this.constants.actividadFinId,
    activo: this.constants.activo
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
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  * @param servicioPermiso Servicio Permiso usado en el componente para gestionar las peticiones
  */
  constructor(
    private servicio: ProcesoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private servicioPermiso: PermisosService
  ) { }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.servicio.Procesodata.subscribe(
      (proceso: Proceso) => {
        if (Object.keys(proceso).length === 0) {
          this.loader = true;
        } else {
          if (this.criteria.nombre || this.criteria.descripcion) {
            //no realiza ninguna acción
          } else {
            this.objetoProceso = proceso;
            this.listaTransiciones = new MatTableDataSource(proceso.transiciones);
            this.listaTransiciones.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'actividadFinal.nombre': return item.actividadFinal.nombre;
                case 'actividadInicial.nombre': return item.actividadInicial.nombre;
                default: return item[property];
              }
            };
            this.listaTransiciones.sort = this.sort;
            this.listaTransiciones.paginator = this.paginator;
            if (this.listaTransiciones.filteredData.length === 0) {
              this.noInfoToShow = true;
              this.loader = false;
              this.exportOption = true;
            } else {
              this.noInfoToShow = false;
              this.loader = false;
              this.exportOption = false;
            }
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
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.noInfoToShow = true;
    this.paginator.pageIndex = 0;
    this.filterValues.nombre = this.criteria.nombre.trim().toLowerCase();
    this.filterValues.descripcion = this.criteria.descripcion.trim().toLowerCase();

    this.listaTransiciones.filter = JSON.stringify(this.filterValues);

    this.listaTransiciones.filterPredicate = function (data, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data.nombre.toLowerCase().indexOf(searchTerms.nombre) !== -1
        && data.descripcion.toString().toLowerCase().indexOf(searchTerms.descripcion) !== -1;
    };
    if (this.listaTransiciones.filteredData.length > 0) {
      this.exportOption = false;
      this.noInfoToShow = false;
    } else {
      this.exportOption = true;
    }
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
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param procesotransicion Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(procesotransicion: TransicionModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      proceso: this.objetoProceso,
      transicionToEdit: procesotransicion
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TransicionEditComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de DocumentosList
   *
   * @param procesotransicion Objeto que encapsula los datos del registro seleccionado
   */
  documents(procesotransicion: TransicionModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      proceso: this.objetoProceso,
      transicion: procesotransicion
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(DocumentosListComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param procesotransicion Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(procesotransicion: TransicionModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = procesotransicion;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TransicionDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param procesotransicion Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(procesotransicion: TransicionModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      proceso: this.objetoProceso,
      transicionToDelete: procesotransicion
    };

    const dialogRef = this.dialog.open(TransicionDeleteComponent, dialogConfig);
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
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
    this.paginator.pageIndex = 0;
    this.search();
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.cargandoExcel = true;
    const total = this.listaTransiciones.filteredData.length;
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

    let contentTransiciones = [];
    const contentDocumentos = [];

    let worksheetTransiciones: XLSX.WorkSheet;
    let worksheetDocumentos: XLSX.WorkSheet;

    try {
      // transiciones
      this.listaTransiciones.data.forEach(transicion => {
        const itemTransicion = {
          descripcionTransicion: transicion.descripcion,
          nombreTransicion: transicion.nombre,
          actividadFinIdTransicion: transicion.actividadFinal
            ? transicion.actividadFinal.nombre : "",
          actividadInicioIdTransicion: transicion.actividadInicial
            ? transicion.actividadInicial.nombre : "",
          activo: transicion.activo ? this.constants.si : this.constants.no
        };
        contentTransiciones.push(itemTransicion);
      });

      // documentos
      this.listaTransiciones.data.forEach(transicion => {
        transicion.transicionEstadoDocumento.forEach(documento => {
          const itemDocumento = {
            transicion: transicion.nombre,
            tipoDocumento: documento.tipoDocumento
              ? documento.tipoDocumento.descripcion : "",
            estadoDocumentoInicial: documento.estadoDocumentoInicial
              ? documento.estadoDocumentoInicial.descripcion : "",
            estadoDocumentoFinal: documento.estadoDocumentoFinal
              ? documento.estadoDocumentoFinal.descripcion : "",
            activo: documento.activo ? this.constants.si : this.constants.no
          };
          contentDocumentos.push(itemDocumento);
        });
      });
    } catch (error) { }

    const orderTransiciones = ['nombreTransicion', 'descripcionTransicion',
      'actividadInicioIdTransicion', 'actividadFinIdTransicion', 'activo'];
    const headersTransiciones = [{
      activo: this.constants.activo,
      descripcionTransicion: this.constantsTransiciones.descripcion,
      nombreTransicion: this.constantsTransiciones.nombre,
      actividadInicioIdTransicion: this.constantsTransiciones.actividadInicioId,
      actividadFinIdTransicion: this.constantsTransiciones.actividadFinId,
    }];

    const orderDocumentos = ['transicion', 'tipoDocumento', 'estadoDocumentoInicial', 'estadoDocumentoFinal', 'activo'];
    const headersDocumentos = [{
      transicion: this.constantsDocumentos.transicion,
      tipoDocumento: this.constantsDocumentos.tipoDocumento,
      estadoDocumentoInicial: this.constantsDocumentos.estadoDocumentoInicial,
      estadoDocumentoFinal: this.constantsDocumentos.estadoDocumentoFinal,
      activo: this.constants.activo
    }];

    worksheetTransiciones = XLSX.utils.json_to_sheet([...headersTransiciones, ...contentTransiciones],
      { skipHeader: true, header: orderTransiciones });

    worksheetDocumentos = XLSX.utils.json_to_sheet([...headersDocumentos, ...contentDocumentos],
      { skipHeader: true, header: orderDocumentos });

    let workbook;
    if (contentTransiciones.length > 0 && contentDocumentos.length > 0) {
      workbook = {
        Sheets: { 'transiciones': worksheetTransiciones, 'documentos': worksheetDocumentos },
        SheetNames: ['transiciones', 'documentos']
      };
    } else {
      if (contentTransiciones.length > 0) {
        workbook = {
          Sheets: { 'transiciones': worksheetTransiciones },
          SheetNames: ['transiciones']
        };
      }
    }

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'transiciones');
    this.cargandoExcel = false;
  }

  /** Método encargado de almacenar el archivo Excel
   * @param buffer Objeto que recibe el archivo xlsx
   * @param fileName nombre del archivo
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';

    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
