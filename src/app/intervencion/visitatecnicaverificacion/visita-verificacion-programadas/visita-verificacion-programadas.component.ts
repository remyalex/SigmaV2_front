import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatSort, MatSortable } from '@angular/material';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Intervencion } from '../../models/intervencionModel.model';
import { PeriodicElement } from './models/PeriodicElement';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { MapService } from 'src/app/shared/services/map.service';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { PeriodicElementCriteria } from './models/periodic-element-criteria';
import { SigmaFormAutocompleteComponent } from 'src/app/shared/component/sigma-form-autocomplete/sigma-form-autocomplete.component';
import { VisitaVerificacionService } from '../services/visitaVerificacion.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-visita-verificacion-programadas',
  templateUrl: './visita-verificacion-programadas.component.html'
})
export class VisitaVerificacionProgramadasComponent implements OnInit, AfterViewInit {
  @Input() mantenimiento: WorkflowMantenimientoModel;
  private urlImagenMapa: string;
  private subscribeToUrlMap: any;
  periodicsElement: PeriodicElement[] = [];
  criteria: PeriodicElementCriteria = null;
  filtersJson: any[];
  @ViewChild('directorObraComponent') directorObraComponent: SigmaFormAutocompleteComponent;
  /** Listado de filtros aplicados a la tabla de la grilla */
  tableFiltersLimitesAplicados: any[];
  errorMensaje = 'No se encuentran resultados.';
  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private mantenimientoServices: MantenimientoService,
    private visitaVerificacionService: VisitaVerificacionService,
    private mapService: MapService, private snackBar: MatSnackBar
  ) {
    this.criteria = new PeriodicElementCriteria();
  }

  /** Constantes a usar en el componente */
  constants = CONST_INTERVENCION_VISITA_VERIFICACION;

  displayedColumns: string[] = [
    'nroActa',
    'fechaInicio',
    'fechaFinal',
    'fechaVisita',
    'estadoProgramacion.descripcion',
    'radicadoIntervencion',
    'zona.nombre',
    'localidad.nombre',
    'directorObra.nombresYApellidos',
    'tipoIntervencion',
    'requiereActualizacion',
    'acciones'
  ];

  fieldsExclude = ['Con solicitud de actualización de diagnóstico', 'EN_EJECUCION', 'PROGRAMADO'];
  dataSource: any;
  lengthList: any;
  loading = true;
  public petition = null;

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  ngAfterViewInit() {
    //this.loadData();
    this.reloadData();
    this.mapService.getVisor().updateImageUrlParameters(this.mantenimiento.pk);
    if (this.subscribeToUrlMap) {
      this.subscribeToUrlMap.unsubscribe();
    }

    this.subscribeToUrlMap = this.mapService.getVisor().imageUrlParameters$.subscribe(url => {
      this.urlImagenMapa = url;
      this.mantenimiento.posicionesBox = this.mapService.extraerPosicionesBoxImagenMapa(this.mantenimiento.posicionesBox, url);
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */

  loadData(): void {
    if (this.petition) {
      this.petition.unsubscribe();
    }
    // tslint:disable-next-line: max-line-length
      this.dataSource = new MatTableDataSource(this.orderData(this.periodicsElement));
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'estadoProgramacion.descripcion': return item.estadoProgramacion ? item.estadoProgramacion.descripcion : '';
          case 'localidad.nombre': return item.localidad ? item.localidad.nombre : '';
          // tslint:disable-next-line: max-line-length
          case 'directorObra.nombresYApellidos': return item.directorObra ? item.directorObra.nombres + ' ' + item.directorObra.apellidos : '';
          default: return item[property];
        }
      };
      this.sort.sort(({ id: 'id', start: 'asc'}) as MatSortable);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.lengthList = this.dataSource.filteredData.length;
      this.dataSource.filterPredicate =
        (data: PeriodicElement, filtersJson: string) => {
          const matchFilter = [];
          const filters = JSON.parse(filtersJson);
          const _this = this;
          filters.forEach(filter => {
            const rowData = data[filter.id] === null ? '' : data[filter.id];
            switch (typeof rowData) {
              case 'string':
                // Para campos cadenas
                matchFilter.push(rowData.includes(filter.value));
                break;
              case 'object':
                const rowDataListItem = rowData as ListaItem;
                matchFilter.push(rowDataListItem.id === filter.value);
                break;
              case 'boolean':
                matchFilter.push(rowData.toString() === filter.value);
                break;
            }
          });
          return matchFilter.every(Boolean);
        };
        this.search();
  }

  reloadData() {
    const mantenimiento = this.mantenimiento;
    this.periodicsElement = [];
    this.loading = true;
    this.visitaVerificacionService.listIntervencionByMantenimiento(mantenimiento.pk).subscribe( (intervenciones: Intervencion[]) => {
      this.loading = false;
      intervenciones.forEach((intervencion: Intervencion) => {
        const item = new PeriodicElement();
        item.id = intervencion.id;
        item.mantenimientoId = intervencion.mantenimiento.id;
        // tslint:disable-next-line: radix
        item.nroId = parseInt(intervencion.nroActa + '');
        item.fechaInicio = intervencion.mantenimiento.fechaInicioVisita;
        item.fechaFinal = intervencion.mantenimiento.fechaFinVisita;
        item.fechaVisita = intervencion.fechaVisita;
        item.nroActa = this.mantenimiento.pk + ' - ' + intervencion.nroActa;
        item.radicadoIntervencion = intervencion.mantenimiento.radicadoIntervencion;
        item.zona = intervencion.mantenimiento.zona;
        item.estadoProgramacion = intervencion.mantenimiento.estadoProgramacionPk !== null ?
        intervencion.mantenimiento.estadoProgramacionPk : null;
        item.localidad = intervencion.mantenimiento.localidad;
        item.directorObra = intervencion.mantenimiento.directorObra ?
          mantenimiento.directorObra.id ? mantenimiento.directorObra : null : null;
        item.tipoIntervencion = intervencion.mantenimiento.actividad;
        item.requiereActualizacion = intervencion.requiereActualizacionDiag;
        this.periodicsElement.push(item);
        this.loadData();
      });
    }, err => {
      this.loading = false;
      this.dataSource = [];
      this.periodicsElement = [];
      this.snackBar.open(
        'Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      });
    });
  }

  orderData(data: any) {
    this.periodicsElement = data.sort(function (a, b) {
      return b.fechaVisita - a.fechaVisita;
    });
    return this.periodicsElement;
  }

  /** Metodo encargado de realizar la búsqueda de los pks seleccionados en la grilla */
  search() {
    let tableFilters = [];

    tableFilters = this.getFiltersPksSeleccionados(tableFilters);
    this.filtersJson = tableFilters;

    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  findFilterTableLimitesAplicadosByName(name: string, data: any, _this: any) {
    for (let i = 0; i < _this.tableFiltersLimitesAplicados.length; i++) {
      if (_this.tableFiltersLimitesAplicados[i].id === name && _this.tableFiltersLimitesAplicados[i].data === data) {
        return true;
      }
    }
    return false;
  }

  /**
   * Método encargado de contruir los filtros por los cuales se realizará
   * la consulta según selección realizada por el usuario.
   * @param tableFilters Tabla de filtros expuesta en el componente que solicitó la grilla
   */
  getFiltersPksSeleccionados(tableFilters: any[]) {
    this.tableFiltersLimitesAplicados = [];
    if (this.criteria.directorDeObra !== undefined && this.criteria.directorDeObra !== null) {
      tableFilters.push({
        id: 'directorObra',
        value: this.criteria.directorDeObra.id
      });
    }
    if (this.criteria.estadoProgramacion !== undefined && this.criteria.estadoProgramacion !== null) {
      tableFilters.push({
        id: 'estadoProgramacion',
        value: this.criteria.estadoProgramacion.id
      });
    }
    if (this.criteria.tipoIntervencion !== undefined && this.criteria.tipoIntervencion !== null) {
      tableFilters.push({
        id: 'tipoIntervencion',
        value: this.criteria.tipoIntervencion.valor
      });
    }
    return tableFilters;
  }

  exportarPDF(nombreReporte: string, mantenimientoId: number) {
    this.mantenimientoServices.generarPDF(mantenimientoId, this.urlImagenMapa, nombreReporte);
  }

  clear() {
    this.criteria.directorDeObra = null;
    this.criteria.estadoProgramacion = null;
    this.criteria.tipoIntervencion = null;
    this.search();
  }

}
