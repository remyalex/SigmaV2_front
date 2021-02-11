import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-mantenimientos-seleccionados-sst',
  templateUrl: './mantenimientos-seleccionados-sst.component.html'
})
export class MantenimientosSeleccionadosSstComponent implements OnInit {

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
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'barrio',
    'nombreResidente'
  ];
  dataSource = new MatTableDataSource<WorkflowMantenimientoModel>(this.mantenimientos);
  zona: ListaItem;
  turno: ListaItem;
  clone: WorkflowMantenimientoModel[] = [];
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];


  /**
  * Método encargado de construir una instancia
  */
  constructor(private _snackBar: MatSnackBar) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.dataSource.data = this.mantenimientos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.clone = JSON.parse(JSON.stringify(this.mantenimientos));
    this.mantenimientosSeleccionados = [];
  }

  seleccionMantenimiento(mantenimiento: WorkflowMantenimientoModel, event: any) {
    if (event.checked) {
      this.mantenimientosSeleccionados.push(mantenimiento);
    } else {
      mantenimiento.intervenciones[0].residenteSST = null;
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

}
