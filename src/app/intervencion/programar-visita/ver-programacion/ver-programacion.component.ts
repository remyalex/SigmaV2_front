import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ResumenDirectorObraModel } from '../../models/ResumenDirectorObra';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../../../workflow/forms/diagnostico/shared/diagnostico.constants';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { BaseGridComponent } from '../../../shared/component/grid-mantenimientos/base-grid-component';
import { GridMantenimientosComponent } from '../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';

@Component({
  selector: 'app-ver-programacion',
  templateUrl: './ver-programacion.component.html'
})
export class VerProgramacionComponent implements OnInit {

  @ViewChild('grid') grid: GridMantenimientosComponent;

  /** Constantes a usar en el componente */
  public constants = CONST_WORKFLOW_DIAGNOSTICO;
  public data: WorkflowMantenimientoActividadModel = new WorkflowMantenimientoActividadModel();
  public directorObra: ResumenDirectorObraModel = new ResumenDirectorObraModel();
  public filters = [];
  public columns = [
    'posicion', 'pk', 'civ', 'fechaProgramacionVisita', 'fechaInicioVisita', 'fechaFinVisita', 'directorDeObra'
  ];
  public columnsToExport = [
    'posicion', 'pk', 'civ', 'zona', 'localidad', 'upla', 'barrio', 'direccion', 'desde', 'hasta', 'numeroCarriles',
    'tipoIntervencion', 'intervencionAgrupada', 'intervencionDetallada', 'estrategia', 'indicePriorizacion',
    'fechaAsignacion', 'origen', 'estadoProgramacion', 'estadoPk', 'radicadoIntervencion', 'fechaProgramacionVisita',
    'fechaInicioVisita', 'fechaFinVisita', 'directorDeObra', 'ancho', 'area', 'longitud', 'kmCarrilImpacto', 'tipoMalla'
  ];


  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán de forma predeterminada en este componente */
  public defaultFilters: KeyValuePair[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) data: { directorObra: ResumenDirectorObraModel, data: WorkflowMantenimientoActividadModel },
    private dialogRef: MatDialogRef<VerProgramacionComponent>,
  ) {
    this.data = data.data;
    this.directorObra = data.directorObra;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaultFilters.push({
      key: 'directorDeObra',
      value: this.directorObra.directorObraId.toString()
    });
    this.defaultFilters.push({
      key: 'permisoId',
      value: '0'
    });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit(): void {
    this.loadData();
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  loadData() {
    this.grid.loadBasicGrid();
  }

}
