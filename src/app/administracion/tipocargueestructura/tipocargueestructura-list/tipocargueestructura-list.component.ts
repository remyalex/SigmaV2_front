import { Tipocargueestructura } from './../models/tipocargueestructura.model';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { TipocargueestructuraService } from '../services/tipocargueestructura.service';
import { TipocargueestructuraCriteria } from '../models/tipocargueestructura-criteria.model';
import { TipocargueestructuraDatasource } from '../services/tipocargueestructura.datasource';
import { TipocargueestructuraEditComponent } from '../tipocargueestructura-edit/tipocargueestructura-edit.component';
import { TipocargueestructuraDetailComponent } from '../tipocargueestructura-detail/tipocargueestructura-detail.component';
import { TipocargueestructuraDeleteComponent } from '../tipocargueestructura-delete/tipocargueestructura-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA } from './../tipocargueestructura.constant';
import { TipocargueestructuraCreateComponent } from '../tipocargueestructura-create/tipocargueestructura-create.component';
import { pluck } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Tipocargue } from '../../tipocargue/models/tipocargue.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la visualización del listados de tipoCargueEstructura */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-tipocargueestructura-list',
  templateUrl: './tipocargueestructura-list.component.html'
})

export class TipocargueestructuraListComponent implements OnInit, AfterViewInit {

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: TipocargueestructuraService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private router: Router,
    private utilitiesService: UtilitiesService,
  ) { }

  /** Objeto usado para enviar al servicio de CRUD*/
  tipoCargue = new Tipocargue();
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource = new MatTableDataSource();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new TipocargueestructuraCriteria();
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'campo',
    'descripcion',
    'requeridoId',
    'tipoDatoId',
    'activo',
    'acciones'
  ];

  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    campo: this.constants.campo,
    descripcion: this.constants.descripcion,
    requeridoId: this.constants.requeridoId,
    tipoDatoId: this.constants.tipoDatoId,
    activo: this.constants.activo,
  }];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort) sort: MatSort;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.tipoCargue = this.servicio.tipoCargue;
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
  * Método encargado de solicitar el listado de los pks al servicio
  */
  loadData(): void {
    this.dataSource = new MatTableDataSource(this.tipoCargue.estructuras);
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
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   * @param tipocargueestructura Objeto que encapsula los datos del registro seleccionado
   */
  create(tipocargueestructura: Tipocargueestructura): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipocargueestructura;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipocargueestructuraCreateComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
          this.servicio.setChangeNoticeTipoCargueEstructura(true);
        }
      }
    );
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   * @param key Objeto que encapsula los datos del registro seleccionado
   * @param tipocargueestructura Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(key: number, tipocargueestructura: Tipocargueestructura): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      key: key,
      tipocargueestructura: tipocargueestructura
    };
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipocargueestructuraEditComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
          this.servicio.setChangeNoticeTipoCargueEstructura(true);
        }
      }
    );
  }

  /**
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   *
   * @param tipocargueestructura Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(tipocargueestructura: Tipocargueestructura): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipocargueestructura;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipocargueestructuraDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   * @param key Objeto que encapsula los datos del registro seleccionado
   * @param tipocargueestructura Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(key: number, tipocargueestructura: Tipocargueestructura): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      key: key,
      tipocargueestructura: tipocargueestructura
    };

    const dialogRef = this.dialog.open(TipocargueestructuraDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
          this.servicio.setChangeNoticeTipoCargueEstructura(true);
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

    const content = this.tipoCargue.estructuras.map((tipocargueestructura: any) => {
      return {
        campo: tipocargueestructura.campo,
        descripcion: tipocargueestructura.descripcion,
        requeridoId: tipocargueestructura.requerido ? this.constants.si : this.constants.no,
        tipoDatoId: tipocargueestructura.tipoDato ? tipocargueestructura.tipoDato.valor : '',
        activo: tipocargueestructura.activo ? this.constants.si : this.constants.no,
      };
    });
    this.dataExport = [...this.headers, ...content];
    const order = ['campo', 'descripcion', 'requeridoId', 'tipoDatoId',];
    this.excelService.exportAsExcelFileCustom(this.dataExport, 'tipocargueestructura', true, order);
    this.cargandoExcel = false;
  }

  /** Método encargado reemplazar el valor tipoCargueId del objeto criteria
   * @param _id objeto lista que reemplazará
   */
  setTipoCargueTipocargueestructura(_id: string) {
    this.criteria.tipoCargueId = _id;
  }

}
