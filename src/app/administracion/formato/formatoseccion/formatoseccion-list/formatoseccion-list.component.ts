import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { FormatoseccionService } from '../services/formatoseccion.service';
import { FormatoseccionCriteria } from '../models/formatoseccion-criteria.model';
import { FormatoseccionDatasource } from '../services/formatoseccion.datasource';
import { Formatoseccion } from '../models/formatoseccion.model';
import { FormatoseccionEditComponent } from '../formatoseccion-edit/formatoseccion-edit.component';
import { FormatoseccionDetailComponent } from '../formatoseccion-detail/formatoseccion-detail.component';
import { FormatoseccionDeleteComponent } from '../formatoseccion-delete/formatoseccion-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_FORMATOSECCION } from '../formatoseccion.constant';
import { Formato } from '../../models/formato.model';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccioncampo/formatoseccioncampo.constant';
import { FormatoseccioncampoCriteria } from '../formatoseccioncampo/models/formatoseccioncampo-criteria.model';
import { FormatoseccioncampoService } from '../formatoseccioncampo/services/formatoseccioncampo.service';
import { FormatoService } from '../../services/formato.service';

/** Clase encargada de la lista del componente */
@Component({
  selector: 'sigma-administracion-formatoseccion-list',
  templateUrl: './formatoseccion-list.component.html'
})
export class FormatoseccionListComponent implements OnInit, AfterViewInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCION;
  constantsCampo = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<Formatoseccion>;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: FormatoseccionDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new FormatoseccionCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new FormatoseccionCriteria();
  criterialFormatoseccioncampo = new FormatoseccioncampoCriteria();
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow = false;
  /** Objeto que recibe parametro por URL  */
  formatoId = null;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader = true;
  /** objeto que se usa para determinar el tamaño de la grilla del componente */
  lengthList: Number;
/** Listado de campos que se usarán para los filtros en la grilla  */
  filterValues = {
    nombre: '',
    descripcion: ''
  };

  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'nombre',
    'descripcion',
    'orden',
    'formatoId',
    'activo',
    'acciones'
  ];

  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [
    {
      activo: this.constants.activo,
      descripcion: this.constants.descripcion,
      formatoId: this.constants.formatoId,
      nombre: this.constants.nombre,
      orden: this.constants.orden
    }
  ];

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
  * @param activeRoute Componente usado para recibir los parametros enviados por la URL
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private servicio: FormatoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activeRoute.queryParams.subscribe(params => {
      if (!params.formato) {
        this.snackBar.open(this.constants.errorFormato, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
        const url = this.constants.path_administracion_formato_return;
        this.router.navigate([url]);
      } else {
        this.criteria.formatoId = params.formato;
        this.formatoId = params.formato;
      }
    });
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.loader = true;
    this.servicio.detail(this.formatoId).subscribe(
      (objetoFormato: Formato) => {
        this.servicio.updateDataFormato(objetoFormato);
        this.formato = objetoFormato;
        this.loadData();
      }
    );
    this.servicio.format$.subscribe(
      (objetoFormato: Formato) => {
        this.formato = objetoFormato;
        this.loadData();
      }
    );
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.noInfoToShow = false;
    this.paginator.pageIndex = 0;
    this.filterValues.nombre = this.criteria.nombre.trim().toLowerCase();
    this.filterValues.descripcion = this.criteria.descripcion.trim().toLowerCase();

    this.dataSource.filter = JSON.stringify(this.filterValues);

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data.nombre.toLowerCase().indexOf(searchTerms.nombre) !== -1
        && data.descripcion.toString().toLowerCase().indexOf(searchTerms.descripcion) !== -1;
    };
    if (this.dataSource.filteredData.length < 1) {
      this.noInfoToShow = true;
    }
  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    if (this.formato.secciones !== undefined) {
      this.loader = false;
      this.dataSource = new MatTableDataSource(this.formato.secciones);
      this.lengthList = this.dataSource.filteredData.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      if (this.dataSource.filteredData.length <= 0) {
        this.noInfoToShow = true;
      } else {
        this.noInfoToShow = false;
      }
    }
  }

  /** Método encargado de gestionar la paginación de la información de
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
   * @param formatoseccion Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(formatoseccion: Formatoseccion): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      formato: this.formato,
      formatoSeccionToEdit: formatoseccion
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(
      FormatoseccionEditComponent,
      dialogConfig
    );
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param formatoseccion Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(formatoseccion: Formatoseccion): void {
    // formatoseccion.formatoData = this.formato;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formatoseccion;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(
      FormatoseccionDetailComponent,
      dialogConfig
    );
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   * @param keyToDelete Objeto numerico que se envia al componente
   * @param formatoseccion Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(keyToDelete: Number, formatoseccion: Formatoseccion): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      keyToDelete: keyToDelete,
      formato: this.formato,
      formatoSeccionToDelete: formatoseccion
    };

    const dialogRef = this.dialog.open(
      FormatoseccionDeleteComponent,
      dialogConfig
    );

    dialogRef.beforeClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    this.criteria.nombre = '';
    this.criteria.descripcion = '';
    this.search();
  }

  /** Método encargado de actualizar y redireccionar la página al inicio */
  campos(key: Number, seccion: Formatoseccion): void {
    this.servicio.updateDataFormato(this.formato);
    const url = '/administracion/formatoseccioncampo/admin';
    this.router.navigate([url], { queryParams: { key: key, seccion: seccion.id, formato: this.formatoId } });
  }
}
