import { ViewChild, Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { InsumoService } from '../services/insumo.service';
import { InsumoCriteria } from '../models/insumo-criteria.model';
import { InsumoDatasource } from '../services/insumo.datasource';
import { Insumo } from '../models/insumo.model';
import { InsumoEditComponent } from '../insumo-edit/insumo-edit.component';
import { InsumoDetailComponent } from '../insumo-detail/insumo-detail.component';
import { InsumoDeleteComponent } from '../insumo-delete/insumo-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_INSUMO } from './../insumo.constant';

/** Componente encargado de gestionar la visualización del listados de insumos*/
@Component({
  selector: 'sigma-administracion-insumo-list',
  templateUrl: './insumo-list.component.html'
})
export class InsumoListComponent implements OnInit, AfterViewInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_INSUMO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: InsumoDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: InsumoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new InsumoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new InsumoCriteria();
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'codigo',
    'nombre',
    'claseInsumoId',
    'unidadMedidaId',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    activo: this.constants.activo,
    claseInsumoId: this.constants.claseInsumoId,
    codigo: this.constants.codigo,
    nombre: this.constants.nombre,
    unidadMedidaId: this.constants.unidadMedidaId,
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
    private servicio: InsumoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) { }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new InsumoDatasource(this.servicio);
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
   * @param insumo Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(insumo: Insumo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = insumo;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(InsumoEditComponent, dialogConfig).afterClosed().subscribe(result => {
      this.loadData();
    });
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param insumo Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(insumo: Insumo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = insumo;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(InsumoDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param insumo Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(insumo: Insumo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = insumo;

    const dialogRef = this.dialog.open(InsumoDeleteComponent, dialogConfig);

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
    this.dataSourceExport = new InsumoDatasource(this.servicio);
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
          content = this.dataSourceExport.insumoData.map((insumo: any) => {
            return {
              activo: insumo.activo ? this.constants.si : this.constants.no,
              unidadMedidaId: insumo.unidadMedida.valor,
              codigo: insumo.codigo,
              nombre: insumo.nombre,
              claseInsumoId: insumo.claseInsumo.valor,
            };
          });
          this.dataExport = [...this.headers, ...content];
          const order = [
            'codigo',
            'nombre',
            'claseInsumoId',
            'unidadMedidaId',
            'activo'
          ];
          this.excelService.exportAsExcelFileCustom(this.dataExport, 'Insumos', true, order);
          this.cargandoExcel = false;
        } catch (error) { }
      }
    });
  }

  setClaseInsumoInsumo(event) {
    this.criteria.claseInsumoId = event;
  }

}
