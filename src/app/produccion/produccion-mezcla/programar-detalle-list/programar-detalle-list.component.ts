import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit, ViewChildren, QueryList, DoCheck } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { CONST_PRODUCCION_MEZCLA } from '../produccion-mezcla.constants';
import { SolicitudMezclaDetalle } from '../models/solicitud-mezcla-detalle.model';
import { SolicitudMezcla } from '../models/solicitud-mezcla.model';
import { SigmaFormCalendarComponent } from 'src/app/shared/component/sigma-form-calendar/sigma-form-calendar.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MapService } from 'src/app/shared/services/map.service';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-programar-detalle-list',
  templateUrl: './programar-detalle-list.component.html'
})
export class ProgramarDetalleListComponent implements OnInit, AfterViewInit, DoCheck {

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MEZCLA;

  @Input() solicitud: SolicitudMezcla;
  @Output() programacionValida = new EventEmitter();

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  cargandoExcel: boolean;
  /** Definición de las columnas presentadas en la grilla */
  columns = ['cantidad', 'unidad', 'pk', 'civ',
             'localidad', 'barrio', 'viaDestino', 'desde',
             'hasta', 'personasContacto', 'horaRetiro',
             'fechaRetiro', 'quienRecibe', 'programado-reprogramar',
             'fechaReprogramacion',
             'observaciones'];
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<SolicitudMezclaDetalle> = new MatTableDataSource<SolicitudMezclaDetalle>();
  mantenimientos: WorkflowMantenimientoModel[] = [];

  @ViewChildren('calendar') calendars: QueryList<SigmaFormCalendarComponent>;
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    cantidad: this.constants.cantidad,
    unidad: this.constants.unidad,
    pk: this.constants.pk,
    civ: this.constants.civ,
    localidad: this.constants.localidad,
    barrio: this.constants.barrio,
    viaDestino: this.constants.viaDestino,
    placaNumeroInterno: this.constants.placaNumeroInterno,
    desde: this.constants.ejeVialDesde,
    hasta: this.constants.ejeVialHasta,
    personasContacto: this.constants.personasContacto,
    horaRetiro: this.constants.horaRetiro,
    fechaRetiro: this.constants.fechaRetiro,
    quienRecibe: this.constants.quienRecibe,
    programadoReprogramar: this.constants.programadoReprogramar,
    capacidadDespachar: this.constants.capacidadDespachar,
    fechaReprogramacion: this.constants.fechaReprogramacion,
    observaciones: this.constants.observaciones
  }];

  subtotal: number;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private mapService: MapService,
    private excelService: ExcelService,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    for (const item of this.solicitud.items) {
      if (item.programado == null) {
        item.programado = true;
        item.reprogramar = false;
      }
      this.mantenimientos.push(item.intervencion.mantenimiento);
    }
    if (this.solicitud.items.length > 0) {
      this.dataSource.data = this.solicitud.items;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.calcularCantidadTotal();
    }
    this.mapService.getVisor().seleccionarMantenimientos(this.mantenimientos);
  }

  cambioRadioButton(item: SolicitudMezclaDetalle) {
    if (item.programado === null || item.programado === true) {
      item.reprogramar = false;
      item.fechaReprogramacion = null;
      item.observaciones = null;
      item.capacidadDespachar = null;
    } else {
      item.reprogramar = true;
    }
    this.calcularCantidadTotal();
  }

  calcularCantidadTotal() {
    this.subtotal = 0;
    for (const detalle of this.solicitud.items) {
      if (detalle.programado) {
        this.subtotal = this.subtotal + detalle.cantidad;
      }
    }
  }

  ngDoCheck() {
    this.validate();
  }

  validate() {
    let valid = true;
    if (this.solicitud.items.length > 0) {
      for (const item of this.solicitud.items) {
        if (item.reprogramar) {
          if (item.fechaReprogramacion == null || item.observaciones == null || item.observaciones === ''
          || item.capacidadDespachar == null || item.capacidadDespachar < 0 ) {
            valid = false;
          }
        }
      }
    } else {
      valid = false;
    }
    this.programacionValida.emit(valid);
  }

  localizarPk(item: SolicitudMezclaDetalle) {
    this.mapService.getVisor().localizar(item.intervencion.mantenimiento);
  }

  cancelar() {

  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    for (const calendar of this.calendars.toArray()) {
    }
  }

  exportar(): void {
    this.cargandoExcel = true;
    let dataExport: any = [];
    let content = [];
    content = this.solicitud.items.map((item: SolicitudMezclaDetalle) => {
      return {
        cantidad: item.cantidad,
        unidad: item.unidad.descripcion ? item.unidad.descripcion : '',
        pk: item.intervencion ? item.intervencion.mantenimiento ? item.intervencion.mantenimiento.pk : '' : '',
        civ: item.intervencion ? item.intervencion.mantenimiento ? item.intervencion.mantenimiento.civ : '' : '',
        localidad: item.intervencion ? item.intervencion.mantenimiento ? item.intervencion.mantenimiento.localidad ?
          item.intervencion.mantenimiento.localidad.nombre : '' : '' : '',
        barrio: item.intervencion ? item.intervencion.mantenimiento ? item.intervencion.mantenimiento.barrio ?
          item.intervencion.mantenimiento.barrio.nombre : '' : '' : '',
        ejeVial: '',
        placaNumeroInterno: '',
        desde: item.intervencion ? item.intervencion.mantenimiento ? item.intervencion.mantenimiento.desde : '' : '',
        hasta: item.intervencion ? item.intervencion.mantenimiento ? item.intervencion.mantenimiento.hasta : '' : '',
        personasContacto: '',
        horaRetiro: item.horaRetiro,
        fechaRetiro: item.fechaRetiro,
        quienRecibe: item.quienRecibe ? item.quienRecibe.nombres + ' ' + item.quienRecibe.apellidos : '',
        programadoReprogramar: item.programado ? 'Programado' : 'Reprogramado',
        capacidadDespachar: item.capacidadDespachar,
        fechaReprogramacion: item.fechaReprogramacion,
        observaciones: item.observaciones
      };
    });

    dataExport = [...this.headers, ...content];
    const order = [ 'cantidad', 'unidad', 'pk', 'civ', 'localidad', 'barrio', 'viaDestino', 'placaNumeroInterno', 'desde',
    'hasta', 'personasContacto', 'horaRetiro', 'fechaRetiro', 'quienRecibe', 'programadoReprogramar',
    'capacidadDespachar', 'fechaReprogramacion',
    'observaciones'];
    this.excelService.exportAsExcelFileCustom(dataExport, 'SolicitudMezclaDetalle', true, order);
      this.cargandoExcel = false;
    }

}
