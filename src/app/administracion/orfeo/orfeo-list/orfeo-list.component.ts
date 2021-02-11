import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { OrfeoService } from '../services/orfeo.service';
import { OrfeoCriteria } from '../models/orfeo-criteria.model';
import { OrfeoDatasource } from '../services/orfeo.datasource';
import { Orfeo } from '../models/orfeo.model';
import { OrfeoDetailComponent } from '../orfeo-detail/orfeo-detail.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_ORFEO } from './../orfeo.constant';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/**
 * Componente encargado de gestionar la presentación de información en un 
 * listado de elementos de Orfeo
 **/
@Component({
  selector: 'sigma-administracion-orfeo-list',
  templateUrl: './orfeo-list.component.html'
})

export class OrfeoListComponent implements OnInit, AfterViewInit {


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: OrfeoService,
    private utilitiesService: UtilitiesService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
  ) { }

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ORFEO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: OrfeoDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: OrfeoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new OrfeoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new OrfeoCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'fechaRadicado', 'numeroRadicado', 'identificacionUsuario', 'nombresUsuario',
     'identificacionSolicitante', 'fechaVencimiento',
     'nombresFirmante', 'direccionFirmante', 'telefonoFirmante', 'emailFirmante'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    fechaRadicado: this.constants.fechaRadicado,
    numeroRadicado: this.constants.numeroRadicado,
    identificacionUsuario: this.constants.identificacionUsuario,
    nombresUsuario: this.constants.nombresUsuario,
    identificacionSolicitante: this.constants.identificacionSolicitante,
    nombresSolicitante: this.constants.apellidos
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
    this.dataSource = new OrfeoDatasource(this.servicio, this.utilitiesService);
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
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param orfeo Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(orfeo: Orfeo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = orfeo;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(OrfeoDetailComponent, dialogConfig);
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
    this.cargandoExcel = true;
    this.dataSourceExport = new OrfeoDatasource(this.servicio, this.utilitiesService);

    this.criteriaExport.fecha = this.criteria.fecha;
    this.criteriaExport.numeroRadicado = this.criteria.numeroRadicado;
    this.criteriaExport.identificacionSolicitante = this.criteria.identificacionSolicitante;
    this.criteriaExport.size = this.dataSource.totalelementsSubject.value;
    this.criteriaExport.page = 0;
    this.criteriaExport.sortBy = this.criteria.sortBy;
    this.criteriaExport.sortOrder = this.criteria.sortOrder;

    this.dataSourceExport.loadData(this.criteriaExport);
    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        const content = this.dataSourceExport.orfeoData.map((orfeo: any) => {
          return {
            fechaRadicado: orfeo.fechaGeneracionDocumento,
            numeroRadicado: orfeo.numeroRadicado,
            identificacionUsuario: orfeo.asignacion.numeroDocumentoIdentidadAsignado,
            nombresUsuario: orfeo.asignacion.nombresUsuarioAsignado + orfeo.asignacion.apellidosUsuarioAsignado,
            identificacionSolicitante: orfeo.remitente.numeroDocumentoIdentidadRemitente,
            nombresFirmante: orfeo.remitente.nombresRemitente + orfeo.remitente.apellidosRemitente,
            direccionFirmante: orfeo.direccionFirmante,
            telefonoFirmante: orfeo.telefono,
            emailFirmante: orfeo.email
          };
        });
        this.dataExport = [...this.headers, ...content];
        const order = [
          'fechaRadicado', 'numeroRadicado', 'identificacionUsuario', 'nombresUsuario',
          'identificacionSolicitante', 'fechaVencimiento',
          'nombresFirmante', 'direccionFirmante', 'telefonoFirmante', 'emailFirmante'
        ];
        this.excelService.exportAsExcelFileCustom(
          this.dataExport, 'consulta-orfeo', true, order
        );
        this.cargandoExcel = false;
      }
    });

  }

}
