import { ListasService } from "../../listas/services/listas.service";
import { ExcelService } from "../../../shared/services/excel.service";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatPaginator,MatSort,MatDialog,MatDialogConfig } from "@angular/material";
import { ListasItemsDatasource } from "../services/listas-items.datasource";
import { ListaItemCriteria } from "../models/listas-items-criteria.model";
import { ListaItemsService } from "../services/listas-items.service";
import { ListasItemsEditComponent } from "../listas-items-edit/listas-items-edit.component";
import { ListaItem } from "../models/listas-items.model";
import { ListasItemsDeleteComponent } from "../listas-items-delete/listas-items-delete.component";

/** Componente encargado de gestionar la visualización del listados de items de la lista*/
@Component({
  selector: "sigma-admin-listas-items-list",
  templateUrl: "./listas-items-list.component.html"
})
export class ListasItemsListComponent implements OnInit, AfterViewInit {
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: ListasItemsDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria: ListaItemCriteria = new ListaItemCriteria();
  /** Definición de las columnas presentadas en la grilla */
  columns = ["id", "ListaId", "nombre", "acciones"];
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [{}];

  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [
    {
      id: "Id",
      padre: "Lista",
      nombre: "Nombre",
      valor: "Valor",
      activo: "Activo"
    }
  ];

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
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param servicioLista Componente para invecación servicios de listas items
   */
  constructor(
    private servicio: ListaItemsService,
    private servicioLista: ListasService,
    private dialog: MatDialog,
    private excelService: ExcelService
  ) {}

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.dataSource = new ListasItemsDatasource(
      this.servicio,
      this.servicioLista
    );
    this.loadData();
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
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
      this.criteria.sortOrder = this.sort.direction || "asc";
      this.loadData();
    });
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param listasItems Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(listasItems: ListaItem): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "900px";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = listasItems;

    const dialogRef = this.dialog.open(ListasItemsEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(val => {
      if (val !== 0) {
        this.loadData();
      }
    });
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param listasItems Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(listasItems: ListaItem): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = listasItems;

    const dialogRef = this.dialog.open(
      ListasItemsDeleteComponent,
      dialogConfig
    );

    dialogRef.beforeClosed().subscribe(val => {
      if (val !== 0) {
        this.loadData();
      }
    });
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    const result = this.dataSource.listas.map(data => {
      return {
        id: data.id,
        padre: data.padre,
        nombre: data.nombre,
        valor: data.valor,
        activo: data.activo
      };
    });

    this.dataExport = [...this.headers, ...result];

    const order = ["id", "padre", "nombre", "valor", "activo"];
    this.excelService.exportAsExcelFileCustom(
      this.dataExport,
      "listas",
      true,
      order
    );
  }
}
