import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-mantenimientos-seleccionados-ambiental',
  templateUrl: './mantenimientos-seleccionados-ambiental.component.html'
})
export class MantenimientosSeleccionadosAmbientalComponent implements OnInit {

  @Input() mantenimientos: WorkflowMantenimientoModel[];
  @Output() mantenimientosSelectEmit = new EventEmitter();
  @Input() estadoAsignacion = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  columns: string[] = [
    'select',
    'posicion',
    'pk',
    'civ',
    'fechaInicioVisita',
    'fechaFinVisita',
    'turnoEjecucion',
    'nombreZona',
    'nombreLocalidad',
    'nombreUpla',
    'nombreCuadrante',
    'nombreBarrio',
    'nombreResidenteAmbiental'
  ];
  //  dataSource = new MatTableDataSource<WorkflowMantenimientoModel>(this.mantenimientos);
  dataSource = new MatTableDataSource<WorkflowMantenimientoModel>();
  zona: ListaItem;
  turno: ListaItem;
  clone: WorkflowMantenimientoModel[] = [];
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];
  /** objeto que se usa para determinar el tamaño de la grilla del componente */
  lengthList: Number;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria: GridMantenimientoCriteria = new GridMantenimientoCriteria();


  /**
  * Método encargado de construir una instancia
  */
  constructor(private _snackBar: MatSnackBar,
    private _servicioGeneral: DataGenericService,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    for (const key in this.mantenimientos) {
      this.mantenimientos[key].nombreZona = this.mantenimientos[key].zona ? this.mantenimientos[key].zona.nombre : '';
      this.mantenimientos[key].nombreLocalidad = this.mantenimientos[key].localidad ? this.mantenimientos[key].localidad.nombre : '';
      this.mantenimientos[key].nombreUpla = this.mantenimientos[key].upla ? this.mantenimientos[key].upla.nombre : '';
      this.mantenimientos[key].nombreCuadrante = this.mantenimientos[key].cuadrante ? this.mantenimientos[key].cuadrante.nombre : '';
      this.mantenimientos[key].nombreBarrio = this.mantenimientos[key].barrio ? this.mantenimientos[key].barrio.nombre : '';
      this.mantenimientos[key].nombreResidenteAmbiental =
        this.mantenimientos[key].intervenciones[0].residenteAmbiental ?
          this.mantenimientos[key].intervenciones[0].residenteAmbiental.nombres + ' ' +
          this.mantenimientos[key].intervenciones[0].residenteAmbiental.apellidos : '';
    }

    this.clone = JSON.parse(JSON.stringify(this.mantenimientos));
    this.dataSource = new MatTableDataSource(this.mantenimientos);
    this.paginator._intl.itemsPerPageLabel = "Elementos por página";
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.mantenimientosSeleccionados = [];
    this.loadData();

  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
    });

/*
    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.loadData();
    });
*/
   
  }

  seleccionMantenimiento(mantenimiento: WorkflowMantenimientoModel, event: any) {
    if (event.checked) {
      this.mantenimientosSeleccionados.push(mantenimiento);
    } else {
      mantenimiento.intervenciones[0].residenteAmbiental = null;
      const index = this.mantenimientosSeleccionados.findIndex(m => m.id === mantenimiento.id);
      this.mantenimientosSeleccionados.splice(index, 1);
    }
    this.mantenimientosSelectEmit.emit(this.mantenimientosSeleccionados);
  }

  seleccionarTodos(event: any) {
    if (event.checked) {
      this.mantenimientosSeleccionados = JSON.parse(JSON.stringify(this.mantenimientos));
    } else {
      this.mantenimientosSeleccionados = [];
    }
    this.mantenimientosSelectEmit.emit(this.mantenimientosSeleccionados);
  }

  check(mantenimiento: WorkflowMantenimientoModel): boolean {
    const index = this.mantenimientosSeleccionados.findIndex(m => m.id === mantenimiento.id);
    if (index >= 0) {
      this.mantenimientosSeleccionados[index] = mantenimiento;
      return true;
    } else {
      return false;
    }
  }

  filtrar() {
    this.mantenimientosSeleccionados = [];
    this.mantenimientosSelectEmit.emit(this.mantenimientosSeleccionados);
    try {
      if (this.zona === undefined) {
        this.mantenimientos = JSON.parse(JSON.stringify(this.clone));
      } else {
        this.mantenimientos = this.clone.filter(m => m.zona !== null && m.zona.id === this.zona.id);
      }
      this.dataSource.data = this.mantenimientos;
    } catch (error) {
      this._snackBar.open(error, 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      });
    }
  }

  limpiar() {
    this.mantenimientos = JSON.parse(JSON.stringify(this.clone));
    this.dataSource.data = [];
    this.zona = null;
    setTimeout(() => {
      this.dataSource.data = this.mantenimientos;
      this.mantenimientosSeleccionados = [];
      this.mantenimientosSelectEmit.emit(this.mantenimientosSeleccionados);
    }, 30);
  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    this.lengthList = this.dataSource.filteredData.length;
/*
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property !== 'turnoEjecucion') {
        switch (property) {
          case 'fechaInicioVisita': return new Date(item.fechaInicioVisita);
          case 'fechaFinVisita': return new Date(Number(item.fechaInicioVisita.split('-')[0]),
            Number(item.fechaInicioVisita.split('-')[1]),
            Number(item.fechaInicioVisita.split('-')[2]));
          default: return item[property];
        }
      }
    };
    */
/*
    // Obtiene la lista de barrios
    this._servicioGeneral.queryList = this.mantenimientos;
    this._servicioGeneral.listQuery$
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.mantenimientos = data.content;
      });
      */
  }
}
