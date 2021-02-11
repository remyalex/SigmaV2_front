import { Termino } from './../../transicioncondiciones/models/termino.model';
import { CONST_ADMINISTRACION_DOCUMENTO } from 'src/app/administracion/proceso/transicion/documentos/documentos.constant';
import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ProcesoService } from '../services/proceso.service';
import { ProcesoCriteria } from '../models/proceso-criteria.model';
import { Proceso } from '../models/proceso.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ProcesoDetailComponent } from '../proceso-detail/proceso-detail.component';
import { ProcesoDeleteComponent } from '../proceso-delete/proceso-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PROCESO } from './../proceso.constant';
import { Router } from '@angular/router';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { SigmaGraphicProcessComponent } from 'src/app/shared/sigma-graphic-process/sigma-graphic-process.component';
import { SigmaGraphicAllProcessComponent } from 'src/app/shared/sigma-graphic-allProcess/sigma-graphic-allprocess.component';
import { forEach } from '@angular/router/src/utils/collection';
import { CONST_ADMINISTRACION_PROCESOACTIVIDAD } from '../actividad/actividades.constant';
import { CONST_ADMINISTRACION_PROCESOTRANSICION } from '../transicion/transicion.constant';
import { transition } from '@angular/animations';

/** Componente encargado de gestionar la visualización del listados de procesos */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-proceso-list',
  templateUrl: './proceso-list.component.html'
})
export class ProcesoListComponent implements OnInit {
  /** Lista de procesos usado en la grilla del componente */
  listaProcesos: any;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader: Boolean = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow: Boolean;
  /** Bandera usada para mantener habilitado o desabilitado el botón exportar */
  exportOption: Boolean = false;
  /** Mensaje a presentar al usuario en caso de fallas */
  errorMessage: String;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESO;
  constantsActividades = CONST_ADMINISTRACION_PROCESOACTIVIDAD;
  constantsTransiciones = CONST_ADMINISTRACION_PROCESOTRANSICION;
  constantsDocumentos = CONST_ADMINISTRACION_DOCUMENTO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ProcesoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new ProcesoCriteria();
  /** objeto que se usa para determinar el tamaño de la grilla del componente */
  lengthList;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'nombre',
    'descripcion',
    'activo',
    'acciones'
  ];
  /** Variable usada para mostrar información del Termino en el componente */
  terminoInfo: any;

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private servicio: ProcesoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.getProcesosList();
  }

  /** Método encargado de cargar la lista de procesos para la grilla del componente */
  getProcesosList() {
    this.loader = true;
    this.servicio.list().subscribe(
      (objetoProceso: Proceso[]) => {
        this.listaProcesos = new MatTableDataSource(objetoProceso);
        this.listaProcesos.sort = this.sort;
        this.listaProcesos.paginator = this.paginator;
        this.lengthList = this.listaProcesos.filteredData.length;
        if (this.listaProcesos.filteredData.length === 0) {
          this.noInfoToShow = true;
          this.loader = false;
          this.exportOption = true;
          this.errorMessage = 'No hay resultados';
        } else {
          this.noInfoToShow = false;
          this.loader = false;
          this.exportOption = true;
        }
      },
      error => {
        this.noInfoToShow = true;
      }
    );
  }

  /** Método encargado de llamar el componente Grafico de Procesos */
  graphicAllProcess() {
    const procesos = this.listaProcesos ? this.listaProcesos.filteredData : [];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      procesos: procesos,
      proceso: null
    };
    dialogConfig.width = '80%';

    const dialogRef = this.dialog.open(SigmaGraphicAllProcessComponent, dialogConfig);
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.loader = true;
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.servicio.search(this.criteria).subscribe(
      (searchProceso: CollectionResponse<Proceso>) => {
        this.noInfoToShow = false;
        this.loader = false;
        this.exportOption = true;
        this.listaProcesos = new MatTableDataSource(searchProceso.content);
        this.listaProcesos.sort = this.sort;
        this.listaProcesos.paginator = this.paginator;
        this.lengthList = this.listaProcesos.filteredData.length;
      },
      error => {
        this.lengthList = 0;
        this.noInfoToShow = true;
        this.loader = false;
        this.exportOption = false;
        this.listaProcesos = [];
        this.errorMessage = error.error[0].message;
      }
    );
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param proceso Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(proceso: Proceso): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'edit/' + proceso.id;
    this.router.navigate([urlBack]);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param proceso Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(proceso: Proceso): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = proceso;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(ProcesoDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización Gráfica de un registro
   * @param proceso Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  graphic(proceso: Proceso): void {
    const procesos = this.listaProcesos ? this.listaProcesos.filteredData : [];

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      procesos: proceso.nombre ? procesos : null,
      proceso: proceso
    };
    dialogConfig.width = '70%';

    // tslint:disable-next-line: max-line-length
    const dialogRef = this.dialog.open(SigmaGraphicAllProcessComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param proceso Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(proceso: Proceso): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = proceso;

    const dialogRef = this.dialog.open(ProcesoDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.getProcesosList();
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
    const total = this.listaProcesos.filteredData.length;
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

    let worksheetProcesos: XLSX.WorkSheet;
    let worksheetActividades: XLSX.WorkSheet;
    let worksheetTransiciones: XLSX.WorkSheet;
    let worksheetDocumentos: XLSX.WorkSheet;

    let contentProcesos = [];
    const contentActividades = [];
    const contentTransiciones = [];
    const contentDocumentos = [];

    // procesos
    try {
      contentProcesos = this.listaProcesos.filteredData.map((proceso: any) => {
        return {
          activo: proceso.activo ? this.constants.si : this.constants.no,
          descripcion: proceso.descripcion,
          nombre: proceso.nombre,
          url: proceso.url
        };
      });
    } catch (error) { }

    // actividades
    this.listaProcesos.data.forEach(proceso => {
      proceso.actividades.forEach(actividad => {
        const itemActividad = {
          proceso: proceso.nombre,
          nombreActividad: actividad.nombre,
          descripcionActividad: actividad.descripcion,
          areaUmv: actividad.area !== null ? actividad.area.descripcion : '',
          cargoUmv: actividad.cargo !== null ? actividad.cargo.descripcion : '',
          url: actividad.url,
          componenteUI: actividad.componenteUI !== null ? actividad.componenteUI.nombre : '',
          permiso: actividad.permiso !== null ? actividad.permiso.nombre : '',
          duracion: actividad.duracion,
          activo: actividad.activo ? this.constants.si : this.constants.no,
        };
        contentActividades.push(itemActividad);
      });

      // transiciones
      proceso.transiciones.forEach(transicion => {
        let transicionBase = null;
        for (let i = 0; i < proceso.transiciones.length; i++) {
          if (proceso.transiciones[i].id === transicion.id) {
            transicionBase = proceso.transiciones[i];
          }
        }
        let procesoActividadFin = null;
        this.listaProcesos.data.forEach(procesoSearch => {
          const searchActividad = procesoSearch.actividades.filter(f => f.nombre === transicion.actividadFinal.nombre);
          if (searchActividad !== null && searchActividad.length > 0) {
            procesoActividadFin = procesoSearch;
          }
        });

        this.terminoInfo = '';

        // tslint:disable-next-line: curly
        if (transicion.condiciones) {
          if (transicion.condiciones.terminos.length > 0) {
            transicion.condiciones.terminos.forEach(termino => {

              if (termino.atributo !== null && termino.operador !== null) {
                const estadoTermino = termino.activo ? this.constants.si : this.constants.no;
                if (termino.valor !== null) {
                  this.terminoInfo = termino.operadorLogico + ' ' + termino.atributo + ' ' + termino.operador + ' ' + termino.valor;
                } else {
                  this.terminoInfo = termino.operadorLogico + ' ' + termino.atributo + ' ' + termino.operador;
                }
                this.terminoInfo += ' (activo: ' + estadoTermino + ')';
              } else {
                this.terminoInfo = termino.operadorLogico;
              }
              contentTransiciones.push(this.objectTransicion(transicion, proceso, transicionBase, procesoActividadFin));
            });
          } else {
            contentTransiciones.push(this.objectTransicion(transicion, proceso, transicionBase, procesoActividadFin));
          }
        } else {
          contentTransiciones.push(this.objectTransicion(transicion, proceso, transicionBase, procesoActividadFin));
        }

      });

      // documentos
      proceso.transiciones.forEach(transicion => {
        transicion.transicionEstadoDocumento.forEach(documento => {
          const itemDocumento = {
            transicion: transicion.nombre,
            tipoDocumento: documento.tipoDocumento ? documento.tipoDocumento.descripcion : '',
            estadoDocumentoInicial: documento.estadoDocumentoInicial ? documento.estadoDocumentoInicial.descripcion : '',
            estadoDocumentoFinal: documento.estadoDocumentoFinal ? documento.estadoDocumentoFinal.descripcion : '',
            activo: documento.activo ? this.constants.si : this.constants.no,
          };
          contentDocumentos.push(itemDocumento);
        });
      });
    });

    const orderProcesos = ['nombre', 'descripcion', 'url', 'activo'];
    const headersProcesos = [{
      activo: this.constants.activo,
      descripcion: this.constants.descripcion,
      url: this.constants.url,
      nombre: this.constants.nombre
    }];

    const orderActividades = ['proceso', 'nombreActividad', 'descripcionActividad', 'areaUmv',
      'cargoUmv', 'url', 'componenteUI', 'permiso', 'duracion', 'activo'];
    const headersActividades = [{
      proceso: this.constantsActividades.proceso,
      nombreActividad: this.constantsActividades.nombre,
      descripcionActividad: this.constantsActividades.descripcion,
      areaUmv: this.constantsActividades.area,
      cargoUmv: this.constantsActividades.cargo,
      url: this.constantsActividades.url,
      componenteUI: this.constantsActividades.componenteUI,
      permiso: this.constantsActividades.permisoId,
      duracion: this.constantsActividades.duracion + ' (Días)',
      activo: this.constants.activo,
    }];

    const orderTransiciones = ['proceso', 'nombreTransicion', 'descripcionTransicion',
      'permiso', 'estadoPk', 'tipoAsignacion', 'estadoMantenimiento', 'condicion', 'termino',
      'indicadorMasiva', 'indicadorReasignable', 'indicadorRequiereObservacion',
      'actividadInicioIdTransicion', 'procesoActividadFin', 'actividadFinIdTransicion', 'activo'];
    const headersTransiciones = [{
      proceso: this.constantsActividades.proceso,
      // actividad: this.constantsTransiciones.actividad,
      activo: this.constants.activo,
      descripcionTransicion: this.constantsTransiciones.descripcion,
      nombreTransicion: this.constantsTransiciones.nombre,
      actividadInicioIdTransicion: this.constantsTransiciones.actividadInicioId,
      actividadFinIdTransicion: this.constantsTransiciones.actividadFinId,

      procesoActividadFin: this.constantsActividades.proceso,
      permiso: this.constantsTransiciones.permisoId,
      estadoPk: this.constantsTransiciones.estadoPk,
      tipoAsignacion: this.constantsTransiciones.tipoAsignacionId,
      estadoMantenimiento: this.constantsTransiciones.estadoMantenimiento,
      condicion: this.constantsTransiciones.condicion,
      termino: this.constantsTransiciones.termino,
      indicadorMasiva: this.constantsTransiciones.esMasiva,
      indicadorReasignable: this.constantsTransiciones.reasignable,
      indicadorRequiereObservacion: this.constantsTransiciones.requiereObservacion,

    }];

    const orderDocumentos = ['transicion', 'tipoDocumento', 'estadoDocumentoInicial', 'estadoDocumentoFinal', 'activo'];
    const headersDocumentos = [{
      transicion: this.constantsDocumentos.transicion,
      tipoDocumento: this.constantsDocumentos.tipoDocumento,
      estadoDocumentoInicial: this.constantsDocumentos.estadoDocumentoInicial,
      estadoDocumentoFinal: this.constantsDocumentos.estadoDocumentoFinal,
      activo: this.constants.activo
    }];

    worksheetProcesos = XLSX.utils.json_to_sheet([...headersProcesos, ...contentProcesos], { skipHeader: true, header: orderProcesos });
    worksheetActividades = XLSX.utils.json_to_sheet([...headersActividades, ...contentActividades],
      { skipHeader: true, header: orderActividades });
    worksheetTransiciones = XLSX.utils.json_to_sheet([...headersTransiciones, ...contentTransiciones],
      { skipHeader: true, header: orderTransiciones });
    worksheetDocumentos = XLSX.utils.json_to_sheet([...headersDocumentos, ...contentDocumentos],
      { skipHeader: true, header: orderDocumentos });

    let workbook;
    if (contentProcesos.length > 0 && contentActividades.length > 0
      && contentTransiciones.length > 0 && contentDocumentos.length > 0) {
      workbook = {
        Sheets: {
          'procesos': worksheetProcesos, 'actividades': worksheetActividades,
          'transiciones': worksheetTransiciones, 'documentos': worksheetDocumentos
        },
        SheetNames: ['procesos', 'actividades', 'transiciones', 'documentos']
      };
    } else {
      if (contentProcesos.length > 0 && contentActividades.length > 0
        && contentTransiciones.length > 0) {
        workbook = {
          Sheets: {
            'procesos': worksheetProcesos, 'actividades': worksheetActividades,
            'transiciones': worksheetTransiciones
          },
          SheetNames: ['procesos', 'actividades', 'transiciones']
        };
      } else {
        if (contentProcesos.length > 0 && contentActividades.length > 0) {

          workbook = {
            Sheets: { 'procesos': worksheetProcesos, 'actividades': worksheetActividades },
            SheetNames: ['procesos', 'actividades']
          };
        } else {
          if (contentProcesos.length > 0) {
            workbook = {
              Sheets: { 'procesos': worksheetProcesos },
              SheetNames: ['procesos']
            };
          }
        }
      }
    }

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'procesos');
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

  /** Método encargado de retornar los datos necesarios para el archivo exportar
   * @param transicion objeto transición que se usa para recibir los datos necesarios
   * @param proceso objeto Proceso que se usa para recibir los datos necesarios
   * @param transicionBase objeto TransiciónBase que se usa para recibir los datos necesarios
   * @param procesoActividadFin objeto procesoActividad que se usa para recibir los datos necesarios
   */
  private objectTransicion(transicion: any, proceso: any, transicionBase: any, procesoActividadFin: any) {
    const itemTransicion = {
      proceso: proceso.nombre,
      descripcionTransicion: transicion.descripcion,
      nombreTransicion: transicion.nombre,
      permiso: transicion.permiso !== null ? transicion.permiso.nombre : '',
      estadoPk: transicionBase !== null && transicionBase.estadoPk !== null ? transicionBase.estadoPk.descripcion : '',
      tipoAsignacion: transicion.tipoAsignacion !== null ? transicion.tipoAsignacion.descripcion : '',
      estadoMantenimiento: transicion.estadoMantenimiento !== null ? transicion.estadoMantenimiento.descripcion : '',
      condicion: transicion.condiciones ? transicion.condiciones.descripcion : '',
      termino: this.terminoInfo,
      indicadorMasiva: transicion.esMasiva ? this.constants.si : this.constants.no,
      indicadorReasignable: transicion.esReasignable ? this.constants.si : this.constants.no,
      indicadorRequiereObservacion: transicion.requiereObservacion ? this.constants.si : this.constants.no,
      procesoActividadFin: procesoActividadFin.descripcion,
      actividadFinIdTransicion: transicion.actividadFinal ? transicion.actividadFinal.nombre : '',
      actividadInicioIdTransicion: transicion.actividadInicial ? transicion.actividadInicial.nombre : '',
      activo: transicion.activo ? this.constants.si : this.constants.no,
    };
    return itemTransicion;
  }
}
