import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowCondicionModel } from '../../../models/workflow-condicion.model';
import { GridMantenimientosComponent } from '../../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';

@Component({
  selector: 'app-ver-disenio',
  templateUrl: './ver-disenio.component.html'
})
export class VerDisenioComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  @ViewChild('grid') grid: GridMantenimientosComponent;

  disenio: any;
  mantenimiento: any;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'direccion',
    'fechaVisitaDisenio',
    'tipoIntervencion',
    'origen',
    'localidad',
    'zona',
    'cuadrante',
    'consultaRedes',
    'levantamientoTopografico',
    'modulacionLosas',
    'fichaEvaluacionEstructural',
    'informacionDeDisenio'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk'
  ];

  acciones = [
    { nombre: '', label: 'Trabajar', icono: 'edit', color: 'primary' }
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
    this.commonService.getCondicionByNombre('PK_REVISAR_DISENIO').subscribe(_condicion => {
      this.condicion = _condicion;
    });

   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    this.currentAction = 'work';
    this.mantenimiento = event.mantenimiento;
    this.disenio = event.mantenimiento.disenio;
    this.mapService.getVisor().localizar(this.mantenimiento);
    this.mapService.getVisor().activarSeleccion = false;
  }

  back(event) {
    this.currentAction = event.currentAction;

    if (this.currentAction === 'list') {
      this.mapService.getVisor().activarSeleccion = true;
      this.mapService.getVisor().limpiar();
      this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    }
  }

  executeTransition(): void {
    this.data.mantenimiento = this.mantenimiento;
    this.applySingleTransitionTo();
    this.mapService.getVisor().activarSeleccion = true;
    this.mapService.getVisor().limpiar();
    setTimeout(() => {
      this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    }, 4500);
  }

  ngOnDestroy(): void {
    this.mapService.getVisor().activarSeleccion = true;
    super.ngOnDestroy();
  }

}
