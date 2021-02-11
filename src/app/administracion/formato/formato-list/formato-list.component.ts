import {
  ViewChild,
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { FormatoService } from '../services/formato.service';
import { FormatoCriteria } from '../models/formato-criteria.model';
import { FormatoDatasource } from '../services/formato.datasource';
import { Formato } from '../models/formato.model';
import { FormatoEditComponent } from '../formato-edit/formato-edit.component';
import { FormatoDetailComponent } from '../formato-detail/formato-detail.component';
import { FormatoDeleteComponent } from '../formato-delete/formato-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { CONST_ADMINISTRACION_FORMATO } from './../formato.constant';
import { CONST_ADMINISTRACION_FORMATOSECCION } from '../formatoseccion/formatoseccion.constant';
import { Router } from '@angular/router';
import { FormatoseccionService } from '../formatoseccion/services/formatoseccion.service';
import { FormatoseccionCriteria } from '../formatoseccion/models/formatoseccion-criteria.model';
import { FormatoseccionDatasource } from '../formatoseccion/services/formatoseccion.datasource';
import { FormatoseccioncampoDatasource } from '../formatoseccion/formatoseccioncampo/services/formatoseccioncampo.datasource';
import { FormatoseccioncampoCriteria } from '../formatoseccion/formatoseccioncampo/models/formatoseccioncampo-criteria.model';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccion/formatoseccioncampo/formatoseccioncampo.constant';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FormatoseccioncampoService } from '../formatoseccion/formatoseccioncampo/services/formatoseccioncampo.service';
import { Formatoseccion } from '../formatoseccion/models/formatoseccion.model';
import { Formatoseccioncampo } from '../formatoseccion/formatoseccioncampo/models/formatoseccioncampo.model';

/** Clase encargada de la lista del componente */
@Component({
  selector: 'sigma-administracion-formato-list',
  templateUrl: './formato-list.component.html'
})
export class FormatoListComponent implements OnInit, AfterViewInit {

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(
    private servicio: FormatoService,
    private dialog: MatDialog,
    private router: Router
  ) { }
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATO;
  constantsSeccion = CONST_ADMINISTRACION_FORMATOSECCION;
  constantsCampos = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: FormatoDatasource;
  /**  Fuente de conjunto de datos formatos para exportar */
  dataSourceFormatosExport: FormatoDatasource;
  /**  Fuente de conjunto de datos secciones para exportar */
  dataSourceSeccionesExport: FormatoseccionDatasource;
  /**  Fuente de conjunto de datos campos para exportar */
  dataSourceCamposExport: FormatoseccioncampoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new FormatoCriteria();
  /**  Criterios de busqueda Formatos por los cuales filtrara el archivo excel */
  criteriaFormatoExport = new FormatoCriteria();
  /**  Criterios de busqueda Seccion por los cuales filtrara el archivo excel */
  criteriaSeccionExport = new FormatoseccionCriteria();
  /**  Criterios de busqueda Campo por los cuales filtrara el archivo excel */
  criteriaCampoExport = new FormatoseccioncampoCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'tipoDocumentoId',
    'codigo',
    'plantilla',
    'archivoId',
    'activo',
    'acciones'
  ];

  /** Listado de nombre de las columnas de Formatos que se presentarán en el exportar  */
  orderFormatos = [
    'tipoDocumento',
    'codigo',
    'plantilla',
    'archivo',
    'activo'
  ];

  /** Listado de nombre de las columnas de Secciones que se presentarán en el exportar  */
  orderSecciones = [
    'nombre',
    'descripcion',
    'formato',
    'orden',
    'activo'
  ];

  /** Listado de nombre de las columnas de Campos que se presentarán en el exportar  */
  orderCampos = [
    'nombre',
    'descripcion',
    'tipoCampoFormato',
    'lista',
    'orden',
    'seccion',
    'activo'
  ];

  /** Listado de nombre de las columnas que se presentarán al exportar TODOS */
  orderTodos = [
    // Formato
    'tipoDocumentoFormato',
    'codigoFormato',
    'plantillaFormato',
    'archivoFormato',
    'activoFormato',
    // Seccion
    'nombreSeccion',
    'descripcionSeccion',
    'formatoSeccion',
    'ordenSeccion',
    'activoSeccion',
    // Campo
    'nombreCampo',
    'descripcionCampo',
    'tipoCampoFormatoCampo',
    'listaCampo',
    'ordenCampo',
    'seccionCampo',
    'activoCampo'
  ];

  /**  Nombres de columnas que presentará la grilla usada en el componente */
  headers = [
    {
      tipoDocumentoId: this.constants.tipoDocumentoId,
      codigo: this.constants.codigo,
      plantilla: this.constants.plantilla,
      archivoId: this.constants.archivo,
      activo: this.constants.activo,
    }
  ];

  /**  Nombres de columnas que presentará la grilla de formato usada en el componente */
  headersFormatoExport = [
    {
      tipoDocumento: this.constants.tipoDocumentoId,
      codigo: this.constants.codigo,
      plantilla: this.constants.plantilla,
      archivo: this.constants.archivo,
      activo: this.constants.activo,
    }
  ];

  /**  Nombres de columnas que presentará la grilla de seccion usada en el componente */
  headersSeccionesExport = [
    {
      nombre: this.constantsSeccion.nombre,
      descripcion: this.constantsSeccion.descripcion,
      formato: this.constants.plantilla,
      orden: this.constantsSeccion.orden,
      activo: this.constantsSeccion.activo,
    }
  ];

  /**  Nombres de columnas que presentará la grilla de campos usada para exportar */
  headersCamposExport = [
    {
      nombre: this.constantsCampos.nombre,
      descripcion: this.constantsCampos.descripcion,
      tipoCampoFormato: this.constantsCampos.tipoCampoFormatoId,
      lista: this.constantsCampos.listaId,
      orden: this.constantsCampos.orden,
      seccion: this.constantsSeccion.formatoSeccionId,
      activo: this.constantsCampos.activo,
    }
  ];

  /**  Nombres de columnas que presentará la grilla de todos usada para exportar */
  headersTodosExport = [
    {
      tipoDocumentoFormato: this.constants.tipoDocumentoId + ' del formato',
      codigoFormato: this.constants.codigo + ' del formato',
      plantillaFormato: this.constants.plantilla + ' del formato',
      archivoFormato: this.constants.archivo + ' del formato',
      activoFormato: this.constants.activo,

      nombreSeccion: this.constantsSeccion.nombre + ' de sección',
      descripcionSeccion: this.constantsSeccion.descripcion + ' de sección',
      formatoSeccion: this.constants.plantilla + ' de sección',
      ordenSeccion: this.constantsSeccion.orden + ' de sección',
      activoSeccion: this.constantsSeccion.activo,

      nombreCampo: this.constantsCampos.nombre + ' del campo',
      descripcionCampo: this.constantsCampos.descripcion + ' del campo',
      tipoCampoFormatoCampo: this.constantsCampos.tipoCampoFormatoId + ' del campo',
      listaCampo: this.constantsCampos.listaId + ' del campo',
      ordenCampo: this.constantsCampos.orden + ' del campo',
      seccionCampo: this.constantsSeccion.formatoSeccionId + ' del campo',
      activoCampo: this.constantsCampos.activo
    }
  ];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  /**  Columnas de la grilla Formatos que se van a exportar */
  dataFormatosExport: any = [];
  /**  Columnas de la grilla Secciones que se van a exportar */
  dataSeccionesExport: any = [];
  /**  Columnas de la grilla Campos que se van a exportar */
  dataCamposExport: any = [];
  /**  Columnas de la grilla TODOS que se van a exportar */
  dataAllExport: any = [];


  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new FormatoDatasource(this.servicio);
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
   * @param formato Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(formato: Formato): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formato;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(FormatoEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param formato Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(formato: Formato): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formato;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(FormatoDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param formato Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(formato: Formato): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formato;

    const dialogRef = this.dialog.open(FormatoDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

  /** Método encargado de redireccionar la página a Formato Seccion
   * @param formato Objeto que encapsula los datos del registro seleccionado
   */
  secciones(formato: Formato): void {
    const url = '/administracion/formatoseccion/admin';
    this.router.navigate([url], { queryParams: { formato: formato.id } });
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
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

    let worksheetFormatos: XLSX.WorkSheet;
    let worksheetSecciones: XLSX.WorkSheet;
    let worksheetCampos: XLSX.WorkSheet;
    let worksheetTodos: XLSX.WorkSheet;

    let formatoSubject = new BehaviorSubject<any>([]);
    let rolesSubject = new BehaviorSubject<any>([]);
    let usuariosSubject = new BehaviorSubject<any>([]);
    let todosSubject = new BehaviorSubject<any>([]);

    let loadingFormatos$ = formatoSubject.asObservable();
    let loadingSecciones$ = rolesSubject.asObservable();
    let loadingCampos$ = usuariosSubject.asObservable();
    let loadingTodos$ = todosSubject.asObservable();

    this.cargandoExcel = true;

    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteriaFormatoExport) {
      if (!noLimpiar.includes(key)) {
        this.criteriaFormatoExport[key] = this.criteriaFormatoExport[key];
      }
    }
    this.criteriaFormatoExport.size = 99999999;
    this.criteriaFormatoExport.page = 0;
    this.criteriaFormatoExport.codigo = this.criteria.codigo;

    this.criteriaSeccionExport.size = 99999999;
    this.criteriaSeccionExport.page = 0;

    this.criteriaCampoExport.size = 99999999;
    this.criteriaCampoExport.page = 0;


    let contentFormato = [];
    try {
      contentFormato = this.dataSource.formatoData.map((formato: Formato) => {
        return {
          tipoDocumento: formato.tipoDocumento.descripcion,
          codigo: formato.codigo,
          plantilla: formato.plantilla,
          archivo: formato.archivo.nombre,
          activo: formato.activo ? this.constants.si : this.constants.no,
        };
      });

    } catch (error) { }

    this.dataFormatosExport = [...this.headersFormatoExport, ...contentFormato];
    formatoSubject.next(this.dataFormatosExport);

    let contentSecciones = [];
    try {
      this.dataSource.formatoData.forEach(formato => {
        formato.secciones.forEach(seccion => {
          seccion.formato = formato.plantilla;
        });
        let secciones = formato.secciones.map((formatoSeccion: Formatoseccion) => {
          return {
            nombre: formatoSeccion.nombre,
            descripcion: formatoSeccion.descripcion,
            formato: formatoSeccion.formato,
            orden: formatoSeccion.orden,
            activo: formatoSeccion.activo ? this.constants.si : this.constants.no,
          };
        });
        contentSecciones = contentSecciones.concat(secciones);
      });
    } catch (error) { }

    this.dataSeccionesExport = [...this.headersSeccionesExport, ...contentSecciones];
    rolesSubject.next(this.dataSeccionesExport);

    let contentCampos = [];
    try {
      this.dataSource.formatoData.forEach(formato => {
        formato.secciones.forEach(seccion => {
          seccion.campos.forEach(campo => {
            campo.seccion = seccion.nombre;
          });
          let campos = seccion.campos.map((formatoCampo: Formatoseccioncampo) => {
            return {
              nombre: formatoCampo.nombre,
              descripcion: formatoCampo.descripcion,
              tipoCampoFormato: formatoCampo.tipoCampoFormato.valor,
              lista: formatoCampo.lista ? formatoCampo.lista.nombre : '',
              orden: formatoCampo.orden,
              seccion: formatoCampo.seccion,
              activo: formatoCampo.activo ? this.constants.si : this.constants.no,
            };
          });
          contentCampos = contentCampos.concat(campos);
        });
      });
    } catch (error) { }

    this.dataCamposExport = [...this.headersCamposExport, ...contentCampos];
    usuariosSubject.next(this.dataCamposExport);



    // -------
    let contentAll = [];
    try {
      this.dataSource.formatoData.forEach(formato => {
        formato.secciones.forEach(seccion => {
          seccion.campos.forEach(campo => {
            campo.seccion = seccion.nombre;
          });
          let camposAll = seccion.campos.map((formatoCampo: Formatoseccioncampo) => {
            return {
              // Formato
              tipoDocumentoFormato: formato.tipoDocumento.descripcion,
              codigoFormato: formato.codigo,
              plantillaFormato: formato.plantilla,
              archivoFormato: formato.archivo.nombre,
              activoFormato: formato.activo ? this.constants.si : this.constants.no,
              // Seccion
              nombreSeccion: seccion.nombre,
              descripcionSeccion: seccion.descripcion,
              formatoSeccion: seccion.formato,
              ordenSeccion: seccion.orden,
              activoSeccion: seccion.activo ? this.constants.si : this.constants.no,
              // // Campo
              nombreCampo: formatoCampo.nombre,
              descripcionCampo: formatoCampo.descripcion,
              tipoCampoFormatoCampo: formatoCampo.tipoCampoFormato.valor,
              listaCampo: formatoCampo.lista ? formatoCampo.lista.nombre : '',
              ordenCampo: formatoCampo.orden,
              seccionCampo: formatoCampo.seccion,
              activoCampo: formatoCampo.activo ? this.constants.si : this.constants.no,
            };
          });
          contentAll = contentAll.concat(camposAll);
        });
      });
    } catch (error) { }
    this.dataAllExport = [...this.headersTodosExport, ...contentAll];
    todosSubject.next(this.dataAllExport);
    // fffffff

    // tslint:disable-next-line: deprecation
    combineLatest(
      loadingFormatos$,
      loadingSecciones$,
      loadingCampos$,
      loadingTodos$,
      (formatos, secciones, campos, todos) => {
        const hayFormato = formatos.length > 0;
        const haySecciones = secciones.length > 0;
        const hayCampos = campos.length > 0;
        if (hayFormato && haySecciones && hayCampos) {
          const compilado = { 'formatos': formatos, 'secciones': secciones, 'campos': campos, 'todos': todos };
          return compilado;
        }
      })
      .subscribe((data: any) => {
        if (typeof data !== 'undefined') {

          const hayFormatos = data.formatos.length > 0;
          const haySecciones = data.secciones.length > 0;
          const hayCampos = data.campos.length > 0;

          worksheetFormatos = XLSX.utils.json_to_sheet(data.formatos, { skipHeader: true, header: this.orderFormatos });
          worksheetSecciones = XLSX.utils.json_to_sheet(data.secciones, { skipHeader: true, header: this.orderSecciones });
          worksheetCampos = XLSX.utils.json_to_sheet(data.campos, { skipHeader: true, header: this.orderCampos });
          worksheetTodos = XLSX.utils.json_to_sheet(data.todos, { skipHeader: true, header: this.orderTodos });
          let workbook;

          if (hayFormatos && haySecciones && hayCampos) {
            workbook = {
              Sheets: {
                'formatos': worksheetFormatos, 'secciones': worksheetSecciones, 'campos': worksheetCampos,
                'todos': worksheetTodos
              },
              SheetNames: ['formatos', 'secciones', 'campos', 'todos']
            };
          }
          else {
            if (hayFormatos && haySecciones) {
              workbook = {
                Sheets: { 'formatos': worksheetFormatos, 'secciones': worksheetSecciones },
                SheetNames: ['formatos', 'secciones']
              };
            }
            else {
              if (hayFormatos && hayCampos) {
                workbook = {
                  Sheets: { 'formatos': worksheetFormatos, 'campos': worksheetCampos },
                  SheetNames: ['formatos', 'campos']
                };
              }
              else {
                if (hayFormatos) {
                  workbook = {
                    Sheets: { 'formatos': worksheetFormatos },
                    SheetNames: ['formatos']
                  };
                }
              }
            }
          }

          if (hayFormatos || haySecciones || hayCampos) {
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'formatos');
            this.cargandoExcel = false;
          }
        }
      });
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
