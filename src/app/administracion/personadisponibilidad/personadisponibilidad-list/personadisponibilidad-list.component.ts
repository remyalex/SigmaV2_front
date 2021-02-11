import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { PersonadisponibilidadService } from '../services/personadisponibilidad.service';
import { PersonadisponibilidadCriteria } from '../models/personadisponibilidad-criteria.model';
import { PersonadisponibilidadDatasource } from '../services/personadisponibilidad.datasource';
import { Personadisponibilidad } from '../models/personadisponibilidad.model';
import { PersonadisponibilidadEditComponent } from '../personadisponibilidad-edit/personadisponibilidad-edit.component';
import { PersonadisponibilidadDetailComponent } from '../personadisponibilidad-detail/personadisponibilidad-detail.component';
import { PersonadisponibilidadDeleteComponent } from '../personadisponibilidad-delete/personadisponibilidad-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONADISPONIBILIDAD } from './../personadisponibilidad.constant';
import { pluck } from 'rxjs/operators';
import { Persona } from '../../persona/models/persona.model';
import { ImportarDisponibilidadPersonaComponent } from 'src/app/workflow/forms/solicitud/shared/importar-disponibilidad-persona/importar-disponibilidad-persona.component';

/** Componente encargado de gestionar la visualización del listados de persona disponibilidad */
@Component({
  selector: 'sigma-administracion-personadisponibilidad-list',
  templateUrl: './personadisponibilidad-list.component.html'
})

export class PersonadisponibilidadListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONADISPONIBILIDAD;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: PersonadisponibilidadDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: PersonadisponibilidadDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new PersonadisponibilidadCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new PersonadisponibilidadCriteria();
  Personadisponibilidad: Personadisponibilidad[];
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'persona.categoriaPersona.valor',
    'persona.nombres',
    'persona.identificacion',
    'persona.areaUmv.valor',
    'persona.cargo.valor',
    'fechaDesde',
    'fechaHasta',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    activo: this.constants.activo,
    categoria: this.constants.categoria,
    nombre: this.constants.nombre,
    identificacion: this.constants.identificacion,
    area: this.constants.area,
    cargo: this.constants.cargo,
    fechaDesde: this.constants.fechaDesde,
    fechaHasta: this.constants.fechaHasta
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
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   */
  constructor(
    private servicio: PersonadisponibilidadService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,

  ) { }

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
    this.dataSource = new PersonadisponibilidadDatasource(this.servicio);
    this.loadData();
    this.servicio.modelIsChangeSubjet$.subscribe((newItemData: Personadisponibilidad) => {
      if (typeof this.dataSource.personadisponibilidadData !== 'undefined') {
        for (var i = 0; i < this.dataSource.personadisponibilidadData.length; i++) {
          if (this.dataSource.personadisponibilidadData[i].id === newItemData.id) {
            this.dataSource.personadisponibilidadData[i] = newItemData;
          }
        }
        this.dataSource.reloadData(this.dataSource.personadisponibilidadData);
      }
    })
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
  * Método encargado de solicitar el listado de los pks al servicio
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
   * @param personadisponibilidad Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(personadisponibilidad: Personadisponibilidad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = personadisponibilidad;
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(PersonadisponibilidadEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
        if (val) {
          this.search();
        }
      }
    );
  }

  /**
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   *
   * @param personadisponibilidad Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(personadisponibilidad: Personadisponibilidad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = personadisponibilidad;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonadisponibilidadDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param personadisponibilidad Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(personadisponibilidad: Personadisponibilidad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = personadisponibilidad;

    const dialogRef = this.dialog.open(PersonadisponibilidadDeleteComponent, dialogConfig);

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

  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.dataSourceExport = new PersonadisponibilidadDatasource(this.servicio);
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
          content = this.dataSourceExport.personadisponibilidadData.map((personadisponibilidad: any) => {
            return {
              activo: personadisponibilidad.activo ? this.constants.si : this.constants.no,
              categoria: personadisponibilidad.persona ? personadisponibilidad.persona.categoriaPersona.valor : '',
              nombre: personadisponibilidad.persona ? personadisponibilidad.persona.nombres + ' ' +
                personadisponibilidad.persona.apellidos : '',
              identificacion: personadisponibilidad.persona ? personadisponibilidad.persona.identificacion : '',
              area: personadisponibilidad.persona ? personadisponibilidad.persona.areaUmv.valor : '',
              cargo: personadisponibilidad.persona ? personadisponibilidad.persona.cargo.valor : '',
              fechaDesde: personadisponibilidad.fechaDesde,
              fechaHasta: personadisponibilidad.fechaHasta
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = [
          'categoria',
          'nombre',
          'identificacion',
          'area',
          'cargo',
          'fechaDesde',
          'fechaHasta',
          'activo',
          'acciones'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'personadisponibilidad', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  importar(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(ImportarDisponibilidadPersonaComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }
}
