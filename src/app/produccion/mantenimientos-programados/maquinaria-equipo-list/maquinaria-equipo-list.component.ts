import { ViewChild, Component, OnInit, AfterViewInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { EquipoEditComponent } from '../../../administracion/equipo/equipo-edit/equipo-edit.component';
import { EquipoDetailComponent } from '../../../administracion/equipo/equipo-detail/equipo-detail.component';
import { EquipoDeleteComponent } from '../../../administracion/equipo/equipo-delete/equipo-delete.component';
import { EquipoService } from '../../../administracion/equipo/services/equipo.service';
import { EquipoCriteria } from '../../../administracion/equipo/models/equipo-criteria.model';
import { EquipoDatasource } from '../../../administracion/equipo/services/equipo.datasource';
import { Equipo } from '../../../administracion/equipo/models/equipo.model';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_PRODUCCION_MANTENIMIENTOS_PROGRAMADOS } from '../mantenimientos-programados.constant';
import { MantenimientosProgramadosService } from '../services/mantenimientos-programados.service';
import { MantenimientoProgramado } from '../models/mantenimientos-programados.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'sigma-maquinaria-equipo-list',
  templateUrl: './maquinaria-equipo-list.component.html'
})

export class MaquinariaEquipoListComponent implements OnInit, AfterViewInit, OnDestroy {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MANTENIMIENTOS_PROGRAMADOS;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: EquipoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new EquipoCriteria();
  equipoSeleccionado: Equipo = new Equipo();
  equipoAcciones: any = {};
  placaInventarioCriteria: Equipo;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [];
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'numeroInterno',
    'equipoTipo.valor',
    'claseEquipo.valor',
    'placaInventario',
    'marcaEquipo.valor',
    'estadoEquipo.valor',
    'lugar.nombre',
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

  @Output()
  scheduleMaintance: EventEmitter<Equipo>;

  @Output()
  cancelMaintance: EventEmitter<MantenimientoProgramado>;

  dataSourceExport: any;
  loadDataSubscription: Subscription;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: EquipoService,
    private mantenimientoService: MantenimientosProgramadosService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) {
    this.scheduleMaintance = new EventEmitter<Equipo>();
    this.cancelMaintance = new EventEmitter<MantenimientoProgramado>();
  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new EquipoDatasource(this.servicio);
    this.loadDataSubscription = this.dataSource.loading$.subscribe((loading) => {
      if (!loading && this.dataSource.equipoData) {
        this.getActions();
      }
    });
    this.loadData();

  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy() {   if (this.loadDataSubscription) {
      this.loadDataSubscription.unsubscribe();
    }
  }


  search(): void {
    this.criteria.placaInventario = this.placaInventarioCriteria ? this.placaInventarioCriteria.placaInventario : '';
    console.log(JSON.stringify(this.criteria));

    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.criteria.origenEquipoId = '323566';
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

  runAction(equipo: Equipo, action: string): void {
    switch (action) {
      case 'ScheduleMaintance':
        this.scheduleMaintance.emit(equipo);
        break;
      case 'CancelMaintance':
        this.cancelMaintance.emit(this.equipoAcciones[equipo.id].mantenimiento);
        break;
      default:
        break;
    }
  }



  clear(): void {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
        this.placaInventarioCriteria = null;
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

  getActions() {
    this.dataSource.equipoData.content.map(equipo => {
      if (equipo.estadoEquipo && equipo.estadoEquipo.valor === 'DISPONIBLE' && !this.equipoAcciones[equipo.id]) {
        this.updateAction(equipo.id);
      }
    });
  }


  onRowSelected(equipo: Equipo) {
    if (equipo.estadoEquipo && equipo.estadoEquipo.valor !== 'DISPONIBLE') {
      this.equipoSeleccionado = equipo;
      return;
    }
    if (equipo !== this.equipoSeleccionado) {
      this.equipoSeleccionado = equipo;

      if (!this.equipoAcciones[equipo.id]) {
        this.updateAction(equipo.id);
      }
    }
  }

  updateAction(equipoId) {
    this.equipoAcciones[equipoId] = {
      loading: true,
      mantenimiento: undefined
    };

    this.mantenimientoService.getActivesByEquipo(equipoId).subscribe((result) => {
      this.equipoAcciones[equipoId] = {
        loading: false,
        mantenimiento: result.content[0]
      };
      console.log('resultado busqueda', this.equipoAcciones);
    }, error => {
      console.error('Error en la búsqueda', error);
      this.equipoAcciones[equipoId] = {
        loading: false,
        mantenimiento: undefined
      };
      console.log('resultado busqueda', this.equipoAcciones);
    });
  }

  public actionNeedsUpdate(equipoId) {
    console.log('las acciones de un equipo necesitan ser actualizado', equipoId);
    this.equipoAcciones[equipoId]['needsUpdate'] = true;
    this.updateAction(equipoId);
  }




}
