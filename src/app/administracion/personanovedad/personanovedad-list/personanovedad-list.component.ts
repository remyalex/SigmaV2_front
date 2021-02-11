import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { PersonanovedadService } from '../services/personanovedad.service';
import { PersonanovedadCriteria } from '../models/personanovedad-criteria.model';
import { PersonanovedadDatasource } from '../services/personanovedad.datasource';
import { Personanovedad } from '../models/personanovedad.model';
import { PersonanovedadEditComponent } from '../personanovedad-edit/personanovedad-edit.component';
import { PersonanovedadDetailComponent } from '../personanovedad-detail/personanovedad-detail.component';
import { PersonanovedadDeleteComponent } from '../personanovedad-delete/personanovedad-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONANOVEDAD } from './../personanovedad.constant';
import { PersonanovedadCreateComponent } from '../personanovedad-create/personanovedad-create.component';
import { disableBindings } from '@angular/core/src/render3';
import { pluck } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PersonaService } from '../../persona/services/persona.service';
import { Persona } from '../../persona/models/persona.model';

/** Componente encargado de gestionar la visualización del listados de novedades de persona*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-personanovedad-list',
  templateUrl: './personanovedad-list.component.html'
})
export class PersonanovedadListComponent implements OnInit, AfterViewInit {

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param servicioPersona Servicio para llamar las aciones de las personas
   */
   constructor(
    private servicio: PersonanovedadService,
    private servicioPersona: PersonaService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) { }

  public persona: Persona = new Persona();
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONANOVEDAD;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource = new MatTableDataSource();
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: PersonanovedadDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new PersonanovedadCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new PersonanovedadCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'tipoNovedadPersonaId',
    'fechaDesde',
    'fechaHasta',
    'observaciones',
    // 'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    //activo: this.constants.activo,
    fechaDesde: this.constants.fechaDesde,
    fechaHasta: this.constants.fechaHasta,
    observaciones: this.constants.observaciones,
    tipoNovedadPersonaId: this.constants.tipoNovedadPersonaId
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
    this.persona = this.servicioPersona.persona;
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.loadData();

    this.servicio.load$
      .pipe(pluck('accion'))
      .subscribe((accion: any) => {
        if (typeof accion !== 'undefined') {
          if (accion == 'cargarGrilla') {
            this.loadData();
          }
        }
      });
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
    this.persona = this.servicioPersona.persona;
    this.dataSource = new MatTableDataSource(this.persona.novedades);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
   * @param personanovedad Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(personanovedad: Personanovedad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = personanovedad;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonanovedadEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  crear(personanovedad: Personanovedad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = personanovedad;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonanovedadCreateComponent, dialogConfig);
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
   * @param personanovedad Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(personanovedad: Personanovedad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = personanovedad;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonanovedadDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param personanovedad Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(key: number, personanovedad: Personanovedad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      key: key,
      personanovedad: personanovedad
    };

    const dialogRef = this.dialog.open(PersonanovedadDeleteComponent, dialogConfig);

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
    this.cargandoExcel = true;
    const content = this.persona.novedades.map((personanovedad: any) => {
      return {
        tipoNovedadPersonaId: personanovedad.tipoNovedadPersona ? personanovedad.tipoNovedadPersona.valor : '',
        fechaDesde: personanovedad.fechaDesde,
        fechaHasta: personanovedad.fechaHasta,
        observaciones: personanovedad.observaciones
      };
    });
    this.dataExport = [...this.headers, ...content];
    const order = ['tipoNovedadPersonaId', 'fechaDesde', 'fechaHasta', 'observaciones'];
    this.excelService.exportAsExcelFileCustom(
      this.dataExport, 'personanovedad', true, order
    );
    this.cargandoExcel = false;
  }


   /**
   * Método encargado de actualizar el valor de la persona
   * en el modelo del negocio
   *
   * @param _id Identificador de persona trasmitido por el usuario con la informacion
   * seleccionada en el formulario.
   */
   setPersonaPersonanovedad(_id: string) {
    this.criteria.personaId = _id;
  }
}
