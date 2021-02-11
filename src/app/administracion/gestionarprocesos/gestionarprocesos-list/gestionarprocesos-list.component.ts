import { Router } from '@angular/router';
import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { CONST_ADMINISTRACION_GESTIONARPROCESOS } from '../gestionarprocesos.constant';
import { GestionarProcesosModel } from '../models/gestionarprocesos.model';
import { GestionarProcesosCriteria } from '../models/gestionarprocesos-criteria.model';
import { GestionarprocesosService } from '../services/gestionarprocesos.service';
import { GestionarprocesosEditComponent } from '../gestionarprocesos-edit/gestionarprocesos-edit.component';
import { GestionarProcesosDatasource } from '../services/gestionarprocesos.datasource';

/** Componente encargado de presentar los mantenimientos para gestion del proceso de los pks */
@Component({
  selector: 'sigma-administracion-gestionarprocesos-list',
  templateUrl: './gestionarprocesos-list.component.html'
})
export class GestionarprocesosListComponent implements OnInit {

  listaProcesos: any;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: GestionarProcesosDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: GestionarProcesosDatasource;
  /** Bandera que permite identificar si la página está procesando para presentar el loader */
  loader: Boolean = true;
  /** Bandera que permite identiicar si hay información a mostrar al usuario */
  noInfoToShow: Boolean;
  /** Bandera usada para identificar si el componente se encuentra generando la exportación */
  exportOption: Boolean = false;
  /** Variable usada para saber el tamaño de la lista de mantenimientos */
  lengthList;
  /** Mensaje de error a presentar al usuario */
  errorMessage: String;
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONARPROCESOS;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new GestionarProcesosCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new GestionarProcesosCriteria();
  /** Bandera para establecer si la tabla se debe presentar al usuario o no*/
  showTable = false;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];

  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id',
    'pk',
    'civ',
    'estadoPk',
    'origen',
    'fechaVisitaTecnica',
    'actividadActual',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    idMantenimiento: this.constants.idMantenimiento,
    pkIdCalzadas: this.constants.pkIdCalzadas,
    civ: this.constants.civ,
    estadoPk: this.constants.estadoPk,
    origen: this.constants.descripcionOrigen,
    fechaVisita: this.constants.fechaVisita,
    actividadActual: this.constants.actividadActual
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;


  /**
  * Método encargado de construir una instancia de la clase
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
   */
  constructor(
    private servicio: GestionarprocesosService,
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
    this.dataSource = new GestionarProcesosDatasource(this.servicio);
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
   * @param mantenimientoSelected Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(mantenimientoSelected: GestionarProcesosModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mantenimientoSelected;   

    const dialogRef = this.dialog.open(GestionarprocesosEditComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(value => {
      if (value !== 1) {
        this.dataSource.loading$.subscribe((data) => {
          if (data) {
            this.showTable = true;
          } else {
            this.showTable = false;
          }
        });

        this.search();
      }
    });
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    let noLimpiar = ['page', 'size', 'actividadActual', 'sortBy', 'sortOrder', 'getUrlParameters'];
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
  export(): void {
    this.cargandoExcel = true;
    this.dataSourceExport = new GestionarProcesosDatasource(this.servicio);
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
          content = this.dataSourceExport.gestionarProcesosData.content.map((proceso: any) => {
            return {
              idMantenimiento: String(proceso.id),
              pkIdCalzadas: proceso.pk,
              civ: proceso.civ,
              estadoPk: proceso.estadoPk ? proceso.estadoPk.descripcion : '',
              origen: proceso.origen ? proceso.origen.descripcion : '',
              fechaVisita: proceso.fechaVisitaTecnica,
              actividadActual: proceso.actividadActual ? proceso.actividadActual.nombre : '',
            };
          });
        } catch (error) {
        }
        this.dataExport = [...this.headers, ...content];
        const order = ['idMantenimiento', 'pkIdCalzadas', 'civ', 'estadoPk', 'origen', 'fechaVisita', 'actividadActual'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'equipo', true, order);
        this.cargandoExcel = false;
      }
    });
  }
}