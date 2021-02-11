import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
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
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { CONST_REGISTRAR_MEZCLA_INSUMOS } from '../registro-mezcla-insumos.constant';
import { RegistroMezclaInsumosService } from '../services/registro-mezcla-insumos.service';
import { Router } from '@angular/router';
import { RegistroMezclaInsumoDatasource } from '../services/registro-mezcla-insumos.datasource';
import { RegistroMezclaInsumoCriteria } from '../models/registro-mezcla-insumos-criteria.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-prod-registro-mezcla-insumos',
  templateUrl: './registro-mezcla-insumos.component.html'
})

export class RegistroMezclaInsumoComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {
  /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_MEZCLA_INSUMOS;
  urlBack: string;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  dataSourceSol: RegistroMezclaInsumoDatasource;
  criteriaSol = new RegistroMezclaInsumoCriteria();
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'localidad',
    'zona',
    'barrio',
    'upla',
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'upla',
    'barrio',
  ];

  defaultFilter: KeyValuePair[] = [
    { key: 'actividadActualId', value: '28' },
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'accionSimple', label: 'Solicitudes', icono: 'assignment_ind', color: 'primary' },
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
    private router: Router,
    private servicioSol: RegistroMezclaInsumosService,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
      this.commonService.getCondicionByNombre('PK_CON_SOLICITUD_TIPO_MATERIAL').subscribe(_condicion => {
        this.condicion = _condicion;
      });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.data = new WorkflowMantenimientoActividadModel();
    this.loadMantenimientoActividad();
  }

  loadMantenimientoActividad() {
    const procesoUrl = 'produccion';
    const actividadUrl = 'registro-mezcla-insumos';

    // tslint:disable-next-line: max-line-length
    this.servicioSol._getMantenimientoActividad(procesoUrl, actividadUrl).subscribe(mantenimientoActividad => {
      this.data = mantenimientoActividad;
      this.servicioSol._setListenerMantenimientoActividad(this.data);
      this.loadDataMantenimientoActividad();
    });
  }

  loadDataMantenimientoActividad() {
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
  }

  executeSingleAction(event) {
    localStorage.setItem('dataMapa', JSON.stringify(event.mantenimiento));
    this.router.navigate(['produccion/registro-mezcla-insumos/solicitudes']);
  }

  executeMasiveTransition(event: any): void {
    super.applyMasiveTransitionTo(event.mantenimientos, event.grid);
  }

  executeTransition(event) {

  }

}