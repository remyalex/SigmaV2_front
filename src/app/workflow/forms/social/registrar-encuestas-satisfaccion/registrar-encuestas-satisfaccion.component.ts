import { Component, OnInit, AfterViewChecked, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { CONST_ENCUESTA_SATISFACCION } from 'src/app/gestion-social/encuesta-satisfaccion/encuesta-satisfaccion.constant';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-registrar-encuestas-satisfaccion',
  templateUrl: './registrar-encuestas-satisfaccion.component.html'
})
export class RegistrarEncuestasSatisfaccionComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  constants = CONST_ENCUESTA_SATISFACCION;

  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'fechaInicioVisita',
    'fechaFinVisita',
    'turnoResidenteSocial',
    'zona',
    'nombreResidenteSocial'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'barrio',
    'pk',
    'civ',
    'fechasIntervencion',
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'adicionar', label: 'Registrar Encuesta de Satisfacción', icono: 'note_add', color: 'primary' },
    { nombre: 'listar', label: 'Consultar Resultados de Encuestas', icono: 'visibility', color: 'primary' },
  ];

  accionesMasivas: GridAccion[] = [
    { nombre: 'validarTieneEncuestas', label: 'Guardar todo', icono: 'save', color: 'primary' }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;

  defaulFilters: KeyValuePair[] = [];

  verTransicion = false;
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];
  @ViewChild('grid') grid: GridMantenimientosComponent;

  constructor(
    servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    mapService: MapService
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({key: 'actividadActualProcesoParaleloId', value: this.data.actividad.id.toString()});
    this.commonService.getCondicionByNombre('PK_REGISTRAR_ENCUESTA_SATISFACCION').subscribe(_condicion => {
      this.condicion = _condicion;
    });
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
    }
  }
  onSearch(event): void {
    this.verTransicion = false;
    this.grid.PksSeleccionados = [];
    this.grid.clearMantenimientosSelected();
    super.search();
  }

  ejecutar(event) {
    if (event.mantenimiento === undefined && event.accion === 'validarTieneEncuestas') {
      this.validarSiPksTienenEncuestasDeSatisfaccion(event.mantenimientos);
    } else {
      this.data.mantenimiento = event.mantenimiento;
      CONST_ENCUESTA_SATISFACCION.mID = event.mantenimiento.id;
      CONST_ENCUESTA_SATISFACCION.mPK = event.mantenimiento.pk;
      CONST_ENCUESTA_SATISFACCION.mObject = event.mantenimiento;
      // tslint:disable-next-line: max-line-length
      CONST_ENCUESTA_SATISFACCION.mTurno = this.data.mantenimiento.intervenciones != null ? this.data.mantenimiento.intervenciones[0].turnoResidenteSocial ?this.data.mantenimiento.intervenciones[0].turnoResidenteSocial.descripcion : 'DIURNO' : 'DIURNO';

      switch (event.accion) {
        case 'adicionar':
          this.verTransicion = false;
          this.currentAction = 'adicionar';
          break;
        case 'listar':
          this.verTransicion = false;
          this.currentAction = 'listar';
          break;
      }
    }
  }

  validarSiPksTienenEncuestasDeSatisfaccion(mantenimientos: WorkflowMantenimientoModel[]) {
    this.verTransicion = true;
    this.mantenimientosSeleccionados = mantenimientos;
    let mensaje = '';
    mantenimientos.forEach(mantenimiento => {
      if (mantenimiento.intervenciones !== undefined && mantenimiento.intervenciones.length > 0) {
        if ( mantenimiento.encuestaSatisfaccion.length === 0) {
          mensaje = 'Uno de los PKs seleccionados no tiene registrada ninguna encuesta de satisfacción';
          this.verTransicion = false;
        }
      } else {
        this.verTransicion = false;
        mensaje = 'No se encontró información de la intervención';
      }
    });
    // @ts-ignore
    if (this.verTransicion === false) {
      this.snackBar.open(mensaje, 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      });
      return false;
    }
    return true;
  }

  mostrarSeccionGrid(event: any) {
    this.currentAction = 'list';
    this.utilitiesServices.scrollToTop();
    this.grids.first.loadData();
  }

  accionEncuestaSatisfaccion(event: any) {
    switch (event.accion) {
      case 'edit': this.currentAction = 'edit'; break;
      case 'attach': this.currentAction = 'attach'; break;
      case 'listar': this.currentAction = 'listar'; break;
    }
    this.utilitiesServices.scrollToTop();
  }

  executeTransitions(): void {
    if (this.validarSiPksTienenEncuestasDeSatisfaccion(this.mantenimientosSeleccionados)) {
      super.applyMasiveTransitionTo(this.mantenimientosSeleccionados, this.grid);
      this.verTransicion = false;
      this.grid.clearMantenimientosSelected();
      super.seleccionarGrid(0);
    }
  }

}
