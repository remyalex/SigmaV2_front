import { UtilitiesService } from './../../../shared/services/utilities.service';
import { Acciones } from './../../../mejoramiento/historial-mantenimiento/models/modelsForQuery.model';
import { InsumoExistencia } from './../models/insumo-existencia.model';
import { InsumoExistenciaCriteria } from './../models/insumo-existencia-criteria.model';
import { CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA } from './../insumoExistencia.constant';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { InsumoExistenciaService } from '../services/insumo-existencia.service';
import { InsumoExistenciaDatasource } from '../services/insumo-existencia.datasource';
import { InsumoExistenciaEditComponent } from '../insumo-existencia-edit/insumo-existencia-edit.component';
import { InsumoExistenciaDetailComponent } from '../insumo-existencia-detail/insumo-existencia-detail.component';
import { InsumoExistenciaDeleteComponent } from '../insumo-existencia-delete/insumo-existencia-delete.component';

@Component({
  selector: 'sigma-produccion-insumo-existencia-list',
  templateUrl: './insumo-existencia-list.component.html'
})
export class InsumoExistenciaListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: InsumoExistenciaDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: InsumoExistenciaDatasource;

  criteria = new InsumoExistenciaCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new InsumoExistenciaCriteria();
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  showFilterTipoMezcla = false;
  unidadMedida: any;

  columns = [
    'fechaInicial',
    'fechaFinal',
    'insumo',
    'codigoInsumo',
    'unidadMedida',
    'tipoMezcla',
    'contrato',
    'inventarioInicial',
    'cantidadEntrada',
    'cantidadSalida',
    'inventarioFinal',
    'noSolicitud',
    'acciones'
  ];

  headers = [
    {
      fechaInicial: this.constants.fechaInicial,
      fechaFinal: this.constants.fechaFinal,
      insumo: this.constants.insumo,
      inventarioInicial: this.constants.inventarioInicial,
      cantidadEntrada: this.constants.cantidadEntrada,
      cantidadSalida: this.constants.cantidadSalida,
      inventarioFinal: this.constants.inventarioFinal,
      activo: this.constants.activo,
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
  */
  constructor(
    private servicio: InsumoExistenciaService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
  ) { }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new InsumoExistenciaDatasource(this.servicio);
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
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(formato: InsumoExistencia): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formato;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(InsumoExistenciaEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(formato: InsumoExistencia): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formato;
    dialogConfig.width = '50';

    const dialogRef = this.dialog.open(InsumoExistenciaDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(formato: InsumoExistencia): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formato;

    const dialogRef = this.dialog.open(InsumoExistenciaDeleteComponent, dialogConfig);

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
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.unidadMedida = '';
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  itemChange(event) {
    this.showFilterTipoMezcla = false;
    this.unidadMedida = event.unidadMedida;
    if (event.claseInsumo && event.claseInsumo.descripcion === 'MEZCLAS') {
      this.showFilterTipoMezcla = true;
    }
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.dataSourceExport = new InsumoExistenciaDatasource(this.servicio);
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
          content = this.dataSourceExport.registroData.map((registro: InsumoExistencia) => {
            return {
              activo: registro.activo ? this.constants.si : this.constants.no,
              fechaInicial: registro.fechaInicial,
              fechaFinal: registro.fechaFinal,
              insumo: registro.insumo ? registro.insumo.nombre : '',
              inventarioInicial: registro.inventarioInicial,
              cantidadEntrada: registro.cantidadEntrada,
              cantidadSalida: registro.cantidadSalida,
              inventarioFinal: registro.inventarioFinal,
            };
          });
          this.dataExport = [...this.headers, ...content];
          const order = [
            'fechaInicial',
            'fechaFinal',
            'insumo',
            'inventarioInicial',
            'cantidadEntrada',
            'cantidadSalida',
            'inventarioFinal',
            'activo',
          ];
          this.excelService.exportAsExcelFileCustom(this.dataExport, 'Existencia materiales', true, order);
          this.cargandoExcel = false;
        } catch (error) { }
      }
    });
  }


}
