import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { FormatoseccioncampoCriteria } from '../models/formatoseccioncampo-criteria.model';
import { FormatoseccioncampoDatasource } from '../services/formatoseccioncampo.datasource';
import { Formatoseccioncampo } from '../models/formatoseccioncampo.model';
import { FormatoseccioncampoEditComponent } from '../formatoseccioncampo-edit/formatoseccioncampo-edit.component';
import { FormatoseccioncampoDetailComponent } from '../formatoseccioncampo-detail/formatoseccioncampo-detail.component';
import { FormatoseccioncampoDeleteComponent } from '../formatoseccioncampo-delete/formatoseccioncampo-delete.component';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccioncampo.constant';
import { Formatoseccion } from '../../models/formatoseccion.model';
import { FormatoService } from '../../../services/formato.service';
import { Formato } from '../../../models/formato.model';
import { CONST_ADMINISTRACION_FORMATO } from '../../../formato.constant';

/** Clase encargada de la lista del componente */
@Component({
  selector: 'sigma-administracion-formatoseccioncampo-list',
  templateUrl: './formatoseccioncampo-list.component.html'
})
export class FormatoseccioncampoListComponent implements OnInit, AfterViewInit {

  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow = false;
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;
  constantsFormato = CONST_ADMINISTRACION_FORMATO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: any;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: FormatoseccioncampoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new FormatoseccioncampoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new FormatoseccioncampoCriteria();
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;
  /** Objeto que recibe parametro por URL  */
  formatoId = null;
  /** Objeto que recibe parametro por URL  */
  seccionId = null;
  /** Objeto que recibe parametro por URL  */
  sectionPosition = null;
  /** Objeto usado para enviar al servicio de CRUD*/
  seccion = new Formatoseccion();
  /** objeto que se usa para determinar el tamaño de la grilla del componente */
  lengthList: Number;
  /** Objeto que recibe las secciones selccionadas */
  seccionSelected;

  /** Listado de campos que se usarán para los filtros en la grilla  */
  filterValues = {
    nombre: '',
    descripcion: ''
  };
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'nombre',
    'descripcion',
    'tipoCampoFormatoId',
    'listaId',
    'orden',
    'activo',
    'acciones'
  ];

  /**  Nombres de columnas que presentará la grilla usada en el componente */
  headers = [
    {
      activo: this.constants.activo,
      descripcion: this.constants.descripcion,
      formatoSeccionId: this.constants.formatoSeccionId,
      listaId: this.constants.listaId,
      nombre: this.constants.nombre,
      orden: this.constants.orden,
      tipoCampoFormatoId: this.constants.tipoCampoFormatoId
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
    private router: Router,
  ) {
    this.activeRoute.queryParams.subscribe(params => {
      if (!params.formato || !params.seccion || params.key === -1) {
        this.snackBar.open(this.constants.errorFormatoseccion, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
        const url = this.constants.path_administracion_formatoseccion_return;
        this.router.navigate([url]);
      } else {
        this.criteria.formatoSeccionId = params.seccion;
        this.formatoId = params.formato;
        this.seccionId = params.seccion;
        this.sectionPosition = params.key;
      }
    });
  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.loader = true;
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
      this.seccionSelected = this.formato.secciones[this.sectionPosition].nombre;
      this.dataSource = new MatTableDataSource(this.formato.secciones[this.sectionPosition].campos);
      this.lengthList = this.dataSource.filteredData.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      if (this.dataSource.filteredData.length <= 0) {
        this.noInfoToShow = true;
      } else {
        this.noInfoToShow = false;
      }
    } else {
      this.servicio.detail(this.formatoId).subscribe(
        (objetoFormato: Formato) => {
          this.servicio.updateDataFormato(objetoFormato);
          this.formato = objetoFormato;
        }
      );
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
   * @param formatoseccioncampo Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(formatoseccioncampo: Formatoseccioncampo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      key: this.sectionPosition,
      formato: this.formato,
      formatoseccioncampoToEdit: formatoseccioncampo
    };;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(
      FormatoseccioncampoEditComponent,
      dialogConfig
    );
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param formatoseccioncampo Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(formatoseccioncampo: Formatoseccioncampo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      formatoseccion: this.formato.secciones[this.sectionPosition].nombre,
      formatoseccioncampoToDetail: formatoseccioncampo
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(
      FormatoseccioncampoDetailComponent,
      dialogConfig
    );
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param keyToDelete Objeto numerico que se envia al componente
   * @param formatoseccioncampo Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(keyToDelete: any, formatoseccioncampo: Formatoseccioncampo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      keyCampo: keyToDelete,
      keySection: this.sectionPosition,
      formato: this.formato,
      formatoseccioncampoToDetail: formatoseccioncampo
    };

    const dialogRef = this.dialog.open(
      FormatoseccioncampoDeleteComponent,
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
}
