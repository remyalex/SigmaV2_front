import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../../diagnostico/shared/diagnostico.constants';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { VisitaModel } from 'src/app/workflow/models/visita.model';

@Component({
  selector: 'app-actualizar-visita-diagnostico',
  templateUrl: './actualizar-visita-diagnostico.component.html'
})
export class ActualizarVisitaDiagnosticoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  // constants
 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id',
    'pk',
    'civ',
    'solicitudRadicadoEntrada',
    'solicitudRadicadoSalida',
    'origen',
    'estadoPk',
    'fechaAsignacion',
    'fechaVencimiento',
    'responsable'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'id',
    'pk',
    'civ',
    'estadoPk',
    'solicitudRadicadoEntrada',
    'origen',
    'fechaAsignacion',
    'fechaVencimiento',
    'vencimiento',
    'responsable'
  ];

  actions: GridAccion[] = [
    { nombre: 'work', label: 'Trabajar', icono: 'edit', color: 'primary' }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;

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
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    // Definición de formularios

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
    this.commonService.getCondicionByNombre('PK_DIAGNOSTICO_ACTUALIZAR').subscribe(_condicion => {
      this.condicion = _condicion;
    });

  }

  ngAfterViewInit() {
    if (this.accion) {
      switch (this.accion) {
        case 'work':
          this.work(this.data.mantenimiento);
          break;
      }
    }
  }


  ejecutar(event: any) {
    switch (event.accion) {
      case "work":
        this.work(event.mantenimiento);
        break;
      case "route":
        this.mostrarRuta(event.mantenimiento);
        break;
    }
  }

  work(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.disconectGrid();
    this.mapService.getVisor().limpiar();
    this.mapService.getVisor().visible = false;
    super.work(mantenimiento, true);
  }

  mostrarRuta(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.getVisor().limpiar();
    if (mantenimiento.visitas !== null && mantenimiento.visitas.length > 0) {
      const visita: VisitaModel = mantenimiento.visitas[0];
      if (visita.rutaMapa !== null) {
        this.mapService.getVisor().dibujarRutaJson(visita.rutaMapa);
      } else {
        this.snackBar.open('No hay una ruta para el mantenimiento seleccionado', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
      }
    } else {
      this.snackBar.open('No hay una ruta para el mantenimiento seleccionado', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }


  executeTransition(): void {
    this.data.mantenimiento = this.clone;
    this.applySingleTransitionTo();
  }

  actualizarMantenimiento(event): void {
    this.clone = JSON.parse(event.mantenimiento);
  }

  isValid(): boolean {

    let resultado = true;
    if (this.clone === null || this.clone === undefined) { return false; }
    if (this.clone.diagnostico === null || this.clone.diagnostico === undefined) { return false; }
    if (this.clone.diagnostico.encabezado === null || this.clone.diagnostico.encabezado === undefined) { return false; }
    if (this.clone.tipoSuperficie === null || this.clone.tipoSuperficie === undefined) { return false; }

    switch (this.clone.tipoSuperficie.descripcion) {
      case 'RÍGIDO':
      case 'FLEXIBLE':
      case 'ADOQUÍN CONCRETO':
      case 'ADOQUÍN ARCILLA':
        resultado = this.clone.diagnostico.fallas.length > 0;
        if (!resultado) { return false; }
        resultado = this.clone.diagnostico.muestreos.length > 0;
        break;

      case 'MIXTOS':
        resultado = this.clone.diagnostico.fallas.length > 0;
        if (!resultado) { return false; }
        break;
    }

    if (this.clone.diagnostico.fotos === null ||
      this.clone.diagnostico.fotos === undefined ||
      this.clone.diagnostico.fotos.length === 0) { return false; }

    if (this.clone.diagnostico.priorizacion === undefined ||
      this.clone.diagnostico.priorizacion === null ||
      this.clone.diagnostico.priorizacion.id === undefined) { return false; }

    return resultado;
  }

  back(event) {
    this.currentAction = 'list';
    this.accion = null;
    setTimeout(() => {
      super.seleccionarGrid(0);
    }, 500);
  }

}
