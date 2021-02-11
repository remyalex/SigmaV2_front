import { ViewChild, Component, Inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTab, MatTable, MatSnackBar } from '@angular/material';
import { ListasService } from '../services/listas.service';
import { ListaCriteria } from '../models/lista-criteria.model';
import { ListaDatasource } from '../services/listas.datasource';
import { ListasEditComponent } from '../listas-edit/listas-edit.component';
import { Lista } from '../models/lista.model';
import { ListasDetailComponent } from '../listas-detail/listas-detail.component';
import { ListasDeleteComponent } from '../listas-delete/listas-delete.component';
import { CdkTable } from '@angular/cdk/table';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_ADMINISTRACION_LISTAS } from './../listas.constant';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/** Componente encargado de gestionar la visualización del listados de listas*/
@Component({
  selector: 'sigma-admin-listas-list',
  templateUrl: './listas-list.component.html'
})
export class ListasListComponent implements OnInit, AfterViewInit {

  /**
  * Método encargado de construir una instancia
  */
  constructor(private servicio: ListasService, private dialog: MatDialog, private excelService: ExcelService,
    private snackBar: MatSnackBar) { }
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LISTAS;
  /** tabla en la que se procesará la información */
  @ViewChild('TABLE') table: CdkTable<any>;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: ListaDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: ListaDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ListaCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new ListaCriteria();
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /** Definición de las columnas presentadas en la grilla */
  columns = ['nombre', 'descripcion', 'activo', 'deSistema', 'acciones'];
  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [
    {
      nombre: 'Nombre',
      descripcion: 'Descripción',
      deSistema: 'De sistema',
      activo: 'Activo'
    }
  ];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [{}];

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
    this.dataSource = new ListaDatasource(this.servicio);
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

  Limpiar(): void {
    this.criteria.nombre = '';
    this.criteria.descripcion = '';
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
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  ExportarLista(): void {
    const ruta = this.servicio.exportar();
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
   * @param lista Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(lista: Lista): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lista;

    const dialogRef = this.dialog.open(ListasEditComponent, dialogConfig);

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
   * @param lista Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(lista: Lista): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lista;

    const dialogRef = this.dialog.open(ListasDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param lista Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(lista: Lista): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lista;

    const dialogRef = this.dialog.open(ListasDeleteComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(val => {
      if (val !== 0) {
        this.search();
      }
    });
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.dataSourceExport = new ListaDatasource(this.servicio);
    this.cargandoExcel = true;
    const total = this.dataSource.totalelementsSubject.value;
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }
    this.dataSourceExport.loadData(this.criteriaExport);

    this.dataSourceExport.loading$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe(response => {
        if (!response) {
          const content = this.dataSourceExport.listasData.map((lista: Lista) => {
            if (lista.items.length > 0) {
              return lista.items.map((item: any) => ({
                nombre: lista.nombre,
                descripcionLista: lista.descripcion,
                deSistema: lista.deSistema ? this.constants.si : this.constants.no,
                activoLista: lista.activo ? this.constants.si : this.constants.no,
                valor: item.valor,
                descripcionItem: item.descripcion,
                activoItem: item.activo ? this.constants.si : this.constants.no,
              }));
            } else {
              return [
                {
                  nombre: lista.nombre,
                  descripcionLista: lista.descripcion,
                  activoLista: lista.activo ? this.constants.si : this.constants.no,
                  deSistema: '',
                  valor: '',
                  descripcionItem: '',
                  activoItem: ''
                }
              ];
            }
          });
          let jsonClear = [];
          for (let i = 0; i < content.length; i++) {
            if (content[i].length > 0) {
              jsonClear = jsonClear.concat(content[i]);
            }
          }
          const headersCustom = [
            {
              nombre: 'Nombre',
              descripcionLista: 'Descripción',
              activoLista: 'Activo',
              valor: 'Valor',
              descripcionItem: 'Descripción',
              deSistema: 'Sistema',
              activoItem: 'Activo'
            }
          ];
          this.dataExport = [...headersCustom, ...jsonClear];
          const order = ['nombre', 'descripcionLista', 'activoLista', 'deSistema' , 'valor', 'descripcionItem', 'activoItem'];
          this.excelService.exportAsExcelFileCustom(this.dataExport, 'listas', true, order);

          this.cargandoExcel = false;
        }
      });
  }


}
