import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { CONST_PRODUCCION_MEZCLA } from '../produccion-mezcla.constants';
import { SolicitudMezclaCriteria } from '../models/solicitud-mezcla.criteria';
import { SolicitudMezclaDataSource } from '../services/solicitud-mezcla.datasource';
import { SolicitudMezclaService } from '../services/solicitud-mezcla.service';
import { SolicitudMezcla } from '../models/solicitud-mezcla.model';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-programar-mezcla-solicitud-list',
  templateUrl: './programar-list.component.html'
})
export class ProgramarListComponent implements OnInit, AfterViewInit {

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MEZCLA;

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  @Output() trabajarSolicitud = new EventEmitter();

  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = ['numero', 'fechaSolicitud', 'tipoMaterial.descripcion', 'turno.descripcion', 'catidadTotal', 'acciones'];
  criteria: SolicitudMezclaCriteria;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: SolicitudMezclaDataSource;

  solicitud: SolicitudMezcla;
  cargandoExcel = false;

  headers = [{
    numero: this.constants.numeroSolicitud,
    fechaSolicitud: this.constants.fechaSolicitud,
    tipoMaterial: this.constants.tipoMaterial,
    turno: this.constants.turno,
    catidadTotal: this.constants.cantidad,
  }];



  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: SolicitudMezclaService,
    private utilitiesService: UtilitiesService,
    private snackBar: MatSnackBar,
    private excelService: ExcelService
  ) {
    this.criteria = new SolicitudMezclaCriteria(this.utilitiesService);
    this.dataSource = new SolicitudMezclaDataSource(this.servicio);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clear();
  }

  search() {
    this.loadData();
  }

  clear() {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters', 'utilitiesService'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  trabajar(solicitud: SolicitudMezcla) {
    this.solicitud = solicitud;
    this.trabajarSolicitud.emit({solicitud: this.solicitud});
  }

  loadData() {
    this.dataSource.loadData(this.criteria);
  }

  ngAfterViewInit() {
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

  exportar(): void {
    this.cargandoExcel = true;
    let dataExport: any = [];
    let content = [];
    content = this.dataSource.solicitudes.map(solicitud => {
      return {
        numero: solicitud.numero,
        fechaSolicitud: solicitud.fechaSolicitud ? solicitud.fechaSolicitud : '',
        tipoMaterial: solicitud.tipoMaterial ? solicitud.tipoMaterial.descripcion : '',
        turno: solicitud.turno ? solicitud.turno.descripcion : '',
        catidadTotal: solicitud.catidadTotal ? solicitud.catidadTotal : ''
      };
    });

    dataExport = [...this.headers, ...content];
    const order = [ 'numero', 'fechaSolicitud', 'tipoMaterial', 'turno', 'catidadTotal'];
    this.excelService.exportAsExcelFileCustom(dataExport, 'SolicitudMezclaDetalle', true, order);
      this.cargandoExcel = false;
    }

}
