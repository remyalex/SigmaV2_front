import { TipointervencionDeleteComponent } from './../tipointervencion-delete/tipointervencion-delete.component';
import { TipointervencionDetailComponent } from '../tipointervencion-detail/tipointervencion-detail.component';
import { TipointervencionEditComponent } from './../tipointervencion-edit/tipointervencion-edit.component';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { TipointervencionCriteria } from './../models/tipointervencion-criteria.model';
import { TipointervencionDatasource } from './../services/tipointervencion.datasource';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Tipointervencion } from '../models/tipointervencion.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipointervencionService } from '../services/tipointervencion.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_TIPOINTERVENCION } from '../tipointervencion.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la visualización del listados de tipos de intervención */
@Component({
  selector: 'sigma-administracion-tipointervencion-list',
  templateUrl: './tipointervencion-list.component.html'
})

export class TipointervencionListComponent implements OnInit, AfterViewInit {

  /**
	* Método encargado de construir una instancia de componente
	*
	* @param servicio Servicio usado en el componente para gestionar las peticiones
	* @param snackBar Componente usado para abrir un recuadro modal
	* @param dialog Componente gráfico usado para presentar cuadros de dialogo
	* @param excelService Servicio usado en el componente para peticiones de archivos de Excel
	*/
  constructor (
    private servicio: TipointervencionService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
  ) { }

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOINTERVENCION;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: TipointervencionDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: TipointervencionDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new TipointervencionCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new TipointervencionCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'referenciaIntervencionId',
    'tipoSuperficieId',
    'descripcion',
    'valor',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    referenciaIntervencionId: this.constants.referenciaIntervencionId,
    tipoSuperficieId: this.constants.tipoSuperficieId,
    descripcion: this.constants.descripcion,
    valor: this.constants.valor,
    activo: this.constants.activo,
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
    this.dataSource = new TipointervencionDatasource(this.servicio);
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
  * Método encargado de solicitar el listado los datos de la grilla
  */
  loadData (): void {
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
      this.loadData ();
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
   * @param tipointervencion Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit (tipointervencion: Tipointervencion):void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipointervencion;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipointervencionEditComponent, dialogConfig);
  }

   /**
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   *
   * @param tipointervencion Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail (tipointervencion: Tipointervencion): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipointervencion;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipointervencionDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param tipointervencion Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(tipointervencion: Tipointervencion): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipointervencion;

    const dialogRef = this.dialog.open(TipointervencionDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if ( val ) {
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
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        if (key === 'tipoSuperficie') {
          this.criteria[key] = null;
        } else {
          this.criteria[key] = '';
        }
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
    this.dataSourceExport = new TipointervencionDatasource(this.servicio);
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
        content = this.dataSourceExport.tipointervencionData.map((tipointervencion: any) => {
          return {
            tipoSuperficieId: tipointervencion.tipoSuperficie != null ? tipointervencion.tipoSuperficie.descripcion : '',
            descripcion: tipointervencion.descripcion,
            valor: tipointervencion.valor,
            activo: tipointervencion.activo ? this.constants.si : this.constants.no,
          };
        });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = [ 'tipoSuperficieId', 'descripcion', 'valor', 'activo', ];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'tipointervencion', true, order);
        this.cargandoExcel = false;
      }
    });
  }


}
