import { MapService } from './../../../../shared/services/map.service';
import { Component, OnInit, AfterViewInit, Output, EventEmitter, OnDestroy, ViewChildren, QueryList, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { CONST_ASIGNAR_VISITA_PREDISENIO } from './asignar-visita-predisenio.constants';
import { environment } from 'src/environments/environment';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { VisitaPredisenoAsignarService } from 'src/app/workflow/services/visitaPredienoAsignacion.service';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

@Component({
  selector: 'app-asignar-visita-predisenio',
  templateUrl: './asignar-visita-predisenio.component.html'
})
export class AsignarVisitaPredisenioComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  dataTab: WorkflowMantenimientoActividadModel;
  @ViewChildren('grid') grids: QueryList<GridMantenimientosComponent>;
  _gridSeleccion: GridMantenimientosComponent;

  condicionAsignarVisitaPredisenio: WorkflowCondicionModel;
  condicionAsignarIngenieroPredisenio: WorkflowCondicionModel;
  condicionVerAsignacionIngenieroPredisenio: WorkflowCondicionModel;
  ingenieroDisenio: Persona;
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];
  grid: GridMantenimientosComponent;
  formularioAsignarIngenieroDisenio: FormGroup;
  /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_VISITA_PREDISENIO;
  ingenieros: any = [];
  loadingIngeniero = false;
  petitionIngeniero: any;

  defaulFiltersVerAsignaciones: KeyValuePair[] = [];

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  columnsAsignar = [
    'pk',
    'civ',
    'origen',
    'localidad',
    'zona',
    'cuadrante'
  ];

  columnsTransicion = [
    'pk',
    'civ',
    'origen',
    'localidad',
    'zona',
    'cuadrante',
    'ingenieroDisenio',
    'fechaAsignacionIngenieroDisenio'
  ];

  columnsVerAsignacion = [
    'pk',
    'civ',
    'origen',
    'localidad',
    'zona',
    'cuadrante',
    'direccion',
    'ingenieroDisenio',
    'fechaAsignacionIngenieroDisenio'
  ];

  filtersAsignar = [
    'pk'
  ];

  filtersVerAsignacion = [
    'pk',
    'listaIngenierosDisenio',
    'fechaAsignacionIngenieroDisenio'
  ];

  filtersProgramarAsignacion = [
    'pk',
    'listaIngenierosDisenio'
  ];

  asignarIngenieroDisenio: GridAccion[] = [
    { nombre: 'ingenieroDisenio', label: 'Asignar ingeniero de diseño', icono: 'call_made', color: 'primary' },
  ];

  // Constructor del componente
  constructor(
    servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    mapService: MapService,
    private dialog: MatDialog,
    private visitaPredisenioAsginarService: VisitaPredisenoAsignarService
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.formularioAsignarIngenieroDisenio = this.formBuilder.group({
      ingenieroDisenio: [null, Validators.compose([Validators.required])]
    });

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mapService.forceShowMap();
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }

    this.commonService.getCondicionByNombre('PK_PENDIENTE_ASIGNAR_INGENIERO_VISITA_PREDISENIO').subscribe(_condicion => {
      this.condicionAsignarIngenieroPredisenio = _condicion;
    });

    this.commonService.getCondicionByNombre('PK_PENDIENTE_ASIGNAR_VISITA_PREDISENIO').subscribe(_condicion => {
      this.condicionAsignarVisitaPredisenio = _condicion;
    });

    this.defaulFiltersVerAsignaciones.push({key: 'permisoId', value: '1'});
    this.commonService.getCondicionByNombre('PK_VER_ASIGNACION_INGENIERO_VISITA_PREDISENIO').subscribe(_condicion => {
      this.condicionVerAsignacionIngenieroPredisenio = _condicion;
    });
  }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event) {
    switch (event.accion) {
      case 'ingenieroDisenio':
        this.listIngenierosDisenio();
        this.asigIngenieroDisenio(event);
        break;
    }
  }

  public asigIngenieroDisenio(event: any) {

    if (event.grid.dataSource._totalElements > 0) {
      this.cargarFormularioAsigIngeniero(event);
    } else {

      if (event.grid.PksSeleccionados.length > 0) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'custom-modalbox';
        dialogConfig.width = '30%';
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          mensaje: this.constants.mensajeConfirmacion + event.grid.PksSeleccionados.join(', ')
        };

        const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

        dialogRef.beforeClosed().subscribe(
          val => {
            if (val === 1) {
              this.cargarFormularioAsigIngeniero(event);
            }
          }
        );
      }
    }
  }

  private cargarFormularioAsigIngeniero(event: any) {
    this.limpiarVariablesDeFormulario();
    this.mantenimientosSeleccionados = event.mantenimientos;
    this.grid = event.grid;
    this.currentAction = 'asignarIngenieroVisitaPredisenio'
  }

  private limpiarVariablesDeFormulario() {
    this.ingenieroDisenio = null;
  }

  listIngenierosDisenio() {
    this.loadingIngeniero = true;
    let path = environment.backend;

    if (this.petitionIngeniero) {
      this.petitionIngeniero.unsubscribe();
    }

    path += `${this.constants.path_personas_con_usuarios_y_rol_ingeniero_disenio}`;
    this.petitionIngeniero = this.visitaPredisenioAsginarService.listIngenierosDisenio(path).subscribe(data => {
      this.ingenieros = data;
      this.loadingIngeniero = false;
    }, () => {
      this.loadingIngeniero = false;
      this.ingenieros = [];
    });
  }

  saveIngenieroDisenio(): void {

    this.mantenimientosSeleccionados.forEach(mantenimiento => {
      mantenimiento.ingenieroDisenio = this.ingenieroDisenio;
    });
    this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, this.grid);
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.limpiarVariablesDeFormulario();
          this.currentAction = 'list';
          this.back.emit({ currentAction: this.currentAction });
        }
      }
    );
  }

  // public aseleccionarGrid(tab: number) {
  //   this._gridSeleccion = this.grids.toArray()[tab];
  //   this._gridSeleccion.clear();
  //   this.data.transicion = null;
  //   this.seleccionarGrid(tab);
  // }

}
