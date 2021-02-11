import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
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
import { CONST_GESTION_AMBIENTAL } from '../gestion-ambietal.constant';
import { BanosPortatilesModel } from 'src/app/gestion-ambiental/models/banos.portatiles.model';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { WorkflowCondicionModel } from '../../../models/workflow-condicion.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-registrar-banios-portatiles',
  templateUrl: './registrar-banios-portatiles.component.html'
})
export class RegistrarBaniosPortatilesComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  public constants = CONST_GESTION_AMBIENTAL;
  condicion: WorkflowCondicionModel;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'pk',
    'civ',
    'zona',
    'localidad',
    'nombreResidenteAmbiental',
    'fechaProgramacionIntervencion',
    'turnoEjecucionIntervencion',
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'posicion',
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'barrio',
    'pk',
    'civ',
    'fechaProgramacionIntervencion'
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
     // tslint:disable-next-line: max-line-length
    { nombre: this.constants.currentAction.programarBanosPortatiles, label: this.constants.programarBanosPortatiles, icono: 'note_add', color: 'primary' },
    // tslint:disable-next-line: max-line-length
    { nombre: this.constants.currentAction.consolidadoBanosPortatiles, label: this.constants.consolidadoBanosPortatiles, icono: 'visibility', color: 'primary' },
  ];

  public banoPortatiles: BanosPortatilesModel = new BanosPortatilesModel();
  criteriaMap: GridMantenimientoCriteria;

  defaulFilters: KeyValuePair[] = [];

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
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
    this.defaulFilters.push({key: 'actividadActualProcesoParaleloId', value: this.data.actividad.id.toString()});
    this.commonService.getCondicionByNombre('PK_REGISTRAR_BANIO_PORTATILES').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  executeSingleAction(event) {
    switch (event.accion) {
      case this.constants.currentAction.programarBanosPortatiles:
        this.currentAction = event.accion;
        this.utilitiesServices.scrollToTop();
        this.mantenimiento = event.mantenimiento;
        this.mapService.getVisor().visible = false;
        break;
      case this.constants.currentAction.consolidadoBanosPortatiles:
        this.currentAction = event.accion;
        this.utilitiesServices.scrollToTop();
        this.mantenimiento = event.mantenimiento;
        this.mapService.getVisor().visible = false;
        break;
      default:
        break;
    }
  }

  closeRegistro(event) {
    if (event.close) {
      this.utilitiesServices.scrollToTop();
      this.currentAction = this.constants.currentAction.list;

      setTimeout(() => {
        this.mapService.getVisor().visible = true;
      }, 10);
    }
  }
}
