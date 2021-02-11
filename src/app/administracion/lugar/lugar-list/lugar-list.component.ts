import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from "@angular/core";
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from "@angular/material";
import { LugarService } from "../services/lugar.service";
import { LugarCriteria } from "../models/lugar-criteria.model";
import { LugarDatasource } from "../services/lugar.datasource";
import { Lugar } from "../models/lugar.model";
import { LugarEditComponent } from "../lugar-edit/lugar-edit.component";
import { LugarDetailComponent } from "../lugar-detail/lugar-detail.component";
import { LugarDeleteComponent } from "../lugar-delete/lugar-delete.component";
import { ExcelService } from "src/app/shared/services/excel.service";
import { MatSnackBar } from "@angular/material";
import { CONST_ADMINISTRACION_LUGAR } from "./../lugar.constant";
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Clase encargada de la lista del componente */
@Component({
  selector: "sigma-administracion-lugar-list",
  templateUrl: "./lugar-list.component.html"
})
export class LugarListComponent implements OnInit, AfterViewInit {


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private servicio: LugarService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private utilitiesService: UtilitiesService,
    private snackBar: MatSnackBar) { }
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGAR;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: LugarDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: LugarDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new LugarCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new LugarCriteria();
  /** Definición de las columnas presentadas en la grilla */
  columns = ["tipoLugarId", "origenLugarId", "nombre" , "activo", "acciones"];
  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [
    {
      tipoLugarId: this.constants.tipoLugarId,
      origenLugarId: this.constants.origenLugarId,
      nombre: this.constants.nombre,
      activo: this.constants.activo,
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

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new LugarDatasource(this.servicio);
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
   * @param lugar Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(lugar: Lugar): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lugar;
    dialogConfig.width = "80%";

    const dialogRef = this.dialog.open(LugarEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param lugar Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(lugar: Lugar): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lugar;
    dialogConfig.width = '80%';

    const dialogRef = this.dialog.open(LugarDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param lugar Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(lugar: Lugar): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lugar;

    const dialogRef = this.dialog.open(LugarDeleteComponent, dialogConfig);

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
    let noLimpiar = ["page", "size", "sortBy", "sortOrder", "getUrlParameters"];
    for (let key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = "";
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
    const total = this.dataSource.totalelementsSubject.value;
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;

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

    this.dataSourceExport = new LugarDatasource(this.servicio);
    this.dataSourceExport.loadData(this.criteriaExport);

    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        try {
          this.dataExport = this.dataSourceExport.lugarData.map((lugar: Lugar) => {
            return {
              tipoLugarId: lugar.tipoLugar ? lugar.tipoLugar.valor : '',
              origenLugarId: lugar.origenLugar ? lugar.origenLugar.valor : '',
              nombre: lugar.nombre,
              activo: lugar.activo ? this.constants.si : this.constants.no
            };
          });
        } catch (error) {
          console.log(error);
        }

        this.dataExport = [...this.headers, ...this.dataExport];
        const order = [
          'tipoLugarId', 'origenLugarId', 'nombre', 'activo'
        ];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'lugares', true, order);
        this.cargandoExcel = false;
      }
    });
  }
}
