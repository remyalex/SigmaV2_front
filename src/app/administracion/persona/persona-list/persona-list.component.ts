import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { PersonaService } from '../services/persona.service';
import { PersonaCriteria } from '../models/persona-criteria.model';
import { PersonaDatasource } from '../services/persona.datasource';
import { Persona } from '../models/persona.model';
import { PersonaEditComponent } from '../persona-edit/persona-edit.component';
import { PersonaDetailComponent } from '../persona-detail/persona-detail.component';
import { PersonaDeleteComponent } from '../persona-delete/persona-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONA } from './../persona.constant';

/** Componente encargado de gestionar la visualización del listados de personas*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-persona-list',
  templateUrl: './persona-list.component.html'
})

export class PersonaListComponent implements OnInit, AfterViewInit {


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
	* @param snackBar Componente usado para abrir un recuadro modal
	* @param dialog Componente gráfico usado para presentar cuadros de dialogo
	* @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private servicio: PersonaService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,

  ) { }
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONA;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: PersonaDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new PersonaCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new PersonaCriteria();
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: PersonaDatasource;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'identificacion',
    'tipoIdentificacion',
    'nombres',
    'telefono',
    'correo',
    'estado',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    identificacion: this.constants.identificacion,
    tipoIdentificacion: this.constants.tipoIdentificacionId,
    nombres: this.constants.nombres,
    telefono: this.constants.telefono,
    correo: this.constants.correo,
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

    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new PersonaDatasource(this.servicio);
    this.dataSourceExport = new PersonaDatasource(this.servicio);
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
   * @param persona Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(persona: Persona): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = persona;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonaEditComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param persona Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(persona: Persona): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = persona;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonaDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param persona Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(persona: Persona): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = persona;

    const dialogRef = this.dialog.open(PersonaDeleteComponent, dialogConfig);

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
  exportAsXLSX(): void {

    this.dataSourceExport = new PersonaDatasource(this.servicio);
    this.cargandoExcel = true;
    const total = this.dataSource.totalelementsSubject.value;
    this.criteriaExport.identificacion = this.criteria.identificacion;
    this.criteriaExport.nombres = this.criteria.nombres;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;

    this.dataSourceExport.loadData(this.criteriaExport);

    this.cargandoExcel = true;
    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        const content = this.dataSourceExport.personaData.map((persona: any) => {
          return {
            identificacion: persona.identificacion,
            tipoIdentificacion: persona.tipoIdentificacion ? persona.tipoIdentificacion.valor : '',
            nombres: persona.nombres + ' ' + persona.apellidos,
            telefono: persona.telefono,
            correo: persona.correo,
            activo: persona.activo ? this.constants.si : this.constants.no,
          };
        });
        this.dataExport = [...this.headers, ...content];
        const order = [
          'identificacion',
          'tipoIdentificacion',
          'nombres',
          'telefono',
          'correo',
          'activo'
        ];
        this.excelService.exportAsExcelFileCustom(
          this.dataExport, 'persona', true, order
        );
        this.cargandoExcel = false;
      }
    });

  }

}
