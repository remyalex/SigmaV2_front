import { ViewChild, Component, Input, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ProcesotransicionobjetoService } from './services/procesotransicionobjeto.service';
import { ProcesotransicionobjetoCriteria } from './models/procesotransicionobjeto-criteria.model';
import { ProcesotransicionobjetoDatasource } from './services/procesotransicionobjeto.datasource';
import { Procesotransicionobjeto } from './models/procesotransicionobjeto.model';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PROCESOTRANSICIONOBJETO } from './sigma-proceso-detalle.constant';

/** Componente encargado de gestionar los detalles de procesos */
@Component({
  selector: 'sigma-proceso-detalle',
  templateUrl: './sigma-proceso-detalle.component.html',
  styleUrls: ['./sigma-proceso-detalle.component.scss']
})

export class SigmaProcesoDetalleComponent implements OnInit, AfterViewInit, OnChanges {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOTRANSICIONOBJETO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: ProcesotransicionobjetoDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: ProcesotransicionobjetoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ProcesotransicionobjetoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new ProcesotransicionobjetoCriteria();
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [];
  /** Variable usada para recibir nombre del proceso en la invocación del componente */
  @Input('nombreProceso') nombreProceso: string;
  /** Variable usada para recibir etiqueta del proceso en la invocación del componente */
  @Input('etiquetaProceso') etiquetaProceso: string = 'Histórico';
  /** Variable usada para recibir id de objeto en la invocación del componente */
  @Input('objetoId') objetoId: any;

  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'id',
    'descripcionActividad',
    'fechaAsignacion',
    'vencimiento',
    'fechaInicio',
    'fechaFin',
    'observacion',
    'usuarioAsignado',
    //'activo',
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    id: this.constants.id,
    descripcionActividad: this.constants.descripcionActividad,
    fechaAsignacion: this.constants.fechaAsignacion,
    vencimiento: this.constants.vencimiento,
    fechaInicio: this.constants.fechaInicio,
    fechaFin: this.constants.fechaFin,
    observacion: this.constants.observacion,
    usuarioAsignado: this.constants.usuarioAsignado,
    //activo: this.constants.activo,
  }];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private servicio: ProcesotransicionobjetoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,

  ) {

  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new ProcesotransicionobjetoDatasource(this.servicio);
  }

  loadData(nombreProceso: string, objetoId: number): void {
    this.dataSource.loadData(nombreProceso, objetoId);
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.loadData(this.nombreProceso, this.objetoId);
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.paginator.pageIndex = 0;
      this.loadData(this.nombreProceso, this.objetoId);
    });
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
    this.loadData(this.nombreProceso, this.objetoId);
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.dataSourceExport = new ProcesotransicionobjetoDatasource(this.servicio);
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

    this.dataSourceExport.loadData(this.nombreProceso, this.objetoId);

    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        let content = [];
        try {
          content = this.dataSourceExport.procesotransicionobjetoData.map((procesotransicionobjeto: any) => {
            return {
              activo: procesotransicionobjeto.activo ? this.constants.si : this.constants.no,
              asignadoId: procesotransicionobjeto.asignadoValor,
              documentoId: procesotransicionobjeto.documentoValor,
              fecha: procesotransicionobjeto.fecha,
              id: procesotransicionobjeto.id,
              objeto: procesotransicionobjeto.objeto,
              observacion: procesotransicionobjeto.observacion,
              procesoTransicionId: procesotransicionobjeto.procesoTransicionValor,
              usuarioId: procesotransicionobjeto.usuarioValor,
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = ['id', 'descripcionActividad', 'fechaAsignacion', 'vencimiento',
          'fechaInicio', 'fechaFin', 'observacion', 'usuarioAsignado',];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'procesotransicionobjeto', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /** Método encargado de ejecutarse una vez que cargue el componente
   * @param changes objeto a evaluar
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.objetoId.currentValue !== 'undefined') {
      this.loadData(this.nombreProceso, this.objetoId);
    }
  }

}
