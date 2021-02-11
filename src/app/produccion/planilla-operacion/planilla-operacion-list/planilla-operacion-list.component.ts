import { ViewChild, Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { PlanillaOperacionService } from '../services/planilla-operacion.service';
import { PlanillaOperacionCriteria } from '../models/planilla-operacion-criteria.model';
import { PlanillaOperacionDatasource } from '../services/planilla-operacion.datasource';
import { PlanillaOperacion } from '../models/planilla-operacion.model';
import { PlanillaOperacionEditComponent } from '../planilla-operacion-edit/planilla-operacion-edit.component';
import { PlanillaOperacionDetailComponent } from '../planilla-operacion-detail/planilla-operacion-detail.component';
import { PlanillaOperacionDeleteComponent } from '../planilla-operacion-delete/planilla-operacion-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../planilla-operacion.constant';
import * as _moment from 'moment';


@Component({
  selector: 'sigma-pruduccion-planilla-operacion-list',
  templateUrl: './planilla-operacion-list.component.html'
})

export class PlanillaOperacionListComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: PlanillaOperacionDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new PlanillaOperacionCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new PlanillaOperacionCriteria();
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'numeroTarjeta',
    'fechaOperacion',
    'equipoConductor',
    'acciones',
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    numeroInterno: this.constants.numeroInterno,
    placaInventario: this.constants.placaInventario,
    placa: this.constants.placa,
    movil: this.constants.movil,
    claseEquipoId: this.constants.claseEquipoId,
    tipoEquipoId: this.constants.tipoEquipoId,
    activo: this.constants.activo,
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: any;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: PlanillaOperacionService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) {

  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new PlanillaOperacionDatasource(this.servicio);
    let now = _moment();
    this.criteria.fechaHasta = now.format("DD-MM-YYYY");
    this.loadData();

  }


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
  edit(equipo: any): void {
    let dialogConfig = new MatDialogConfig();
    let equipo_edit: any = { ...equipo };
    equipo_edit.horaInicial = equipo.horaInicial;
    equipo_edit.horaFinal = equipo.horaFinal;
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo_edit;
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(PlanillaOperacionEditComponent, dialogConfig)
      .afterClosed().subscribe(result => {
        this.clear();
      });
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(equipo: PlanillaOperacion): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PlanillaOperacionDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(equipo: PlanillaOperacion): void {
    let dataDelete: any = {
      data: equipo,
      bandera: 'Eliminar_List'
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = dataDelete;

    const dialogRef = this.dialog.open(PlanillaOperacionDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.clear();
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

  setClaseEquipoEquipo(event) {
    this.criteria.claseEquipoId = event;
  }

  setTipoEquipoEquipo(event) {
    this.criteria.tipoEquipoId = event;
  }
  getHumanDate(_date: number) {
    const date = new Date(+_date);
    return date.toISOString().split('T')[0];
  }


  exportAsXLSX(): void {
    this.cargandoExcel = true;
    this.dataSourceExport = new PlanillaOperacionDatasource(this.servicio);
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
          content = this.dataSourceExport.equipoData.content.map((equipo: any) => {
            return {
              activo: equipo.activo ? 'Si' : 'No',
              claseEquipoId: equipo.claseEquipo ? equipo.claseEquipo.valor : '',
              movil: equipo.movil,
              numeroInterno: equipo.numeroInterno,
              placa: equipo.placa,
              placaInventario: equipo.placaInventario,
              tipoEquipoId: equipo.equipoTipo ? equipo.equipoTipo.valor : ''
            };
          });
        } catch (error) {
        }
        this.dataExport = [...this.headers, ...content];
        const order = ['numeroInterno', 'placaInventario', 'placa', 'movil', 'claseEquipoId', 'tipoEquipoId', 'activo'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'equipo', true, order);
        this.cargandoExcel = false;
      }
    });
  }


}
