import { GestionSocialAdelantadaModel } from './../../../../gestion-social/gestion-social-adelantada/models/gestion-social-adelantada.model';
import { CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA } from './../../../../gestion-social/gestion-social-adelantada/gestion-social-adelantada.constant';
import { WorkflowCondicionModel } from './../../../models/workflow-condicion.model';
import { GestionSocialAdelantadaService } from './../../../../gestion-social/gestion-social-adelantada/services/gestion-social-adelantada.service';
import { WorkflowMantenimientoModel } from './../../../models/workflow-mantenimiento.model';
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
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-registrar-gestion-social-adelantada',
  templateUrl: './registrar-gestion-social-adelantada.component.html'
})
export class RegistrarGestionSocialAdelantadaComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  columns = [
    'posicion',
    'pk',
    'civ',
    'fechaProgramacionIntervencion', // fecha inicial de programacion de intervención
    'fechaProgramacionIntervencion', // requiere fecha final de programacion de intervención
    'turnoEjecucionIntervencion',
    'zona',
    'responsable',
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'barrio',
    'fechaProgramacionIntervencion',
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  defaulFilters: KeyValuePair[] = [];
 /** Constantes a usar en el componente */
  constants = CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA;
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'registrarGestionSocial', label: 'Registrar gestión social', icono: 'note_add', color: 'primary' },
    { nombre: 'consultaGestionSocial', label: 'Consultar gestión social', icono: 'visibility', color: 'primary' },
  ];

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
    private service: GestionSocialAdelantadaService
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case 'registrarGestionSocial':
        this.registrar(event.mantenimiento, event.accion);
        break;
      case 'consultaGestionSocial':
        this.listar(event.mantenimiento, event.accion);
        break;
    }
  }

  registrar(mantenimiento: WorkflowMantenimientoModel, currentAction: any) {
      this.mapService.getVisor().visible = false;
      this.mantenimiento = mantenimiento;
      this.data.mantenimiento = this.mantenimiento;
      this.mapService.disconectGrid();
      this.currentAction = currentAction;
  }

  listar(mantenimiento: WorkflowMantenimientoModel, currentAction: any) {
    this.mapService.getVisor().visible = false;
    this.mantenimiento = mantenimiento;
    this.data.mantenimiento = this.mantenimiento;
    this.mapService.disconectGrid();
    this.currentAction = currentAction;
  }

  editar(mantenimiento: WorkflowMantenimientoModel, currentAction: any) {
    this.mapService.getVisor().visible = false;
    this.mantenimiento = mantenimiento;
    this.data.mantenimiento = this.mantenimiento;
    this.mapService.disconectGrid();
    this.currentAction = currentAction;
  }

  back(event) {
    this.currentAction = event.currentAction;
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    this.currentAction = 'create';
  }

  onBack(event) {
    this.currentAction = 'list';
  }


  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({key: 'permisoId', value: '1'});
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }

    this.service.listenerAction(this.data);
    this.mapService.getVisor().visible = true;

    this.commonService.getCondicionByNombre('PK_REGISTRAR_GESTION_SOCIAL_ADELANTADA').subscribe(_condicion => {
      this.condicion = _condicion;
    });

    this.service.gestion$.subscribe((data: GestionSocialAdelantadaModel) => {
      if (typeof( data.id ) !== 'undefined') {
        if (data.id !== 0) {
          this.constants.gObject = data;
          this.constants.mObject = data.mantenimiento;
          if (this.constants.currentActionString === 'editarGestionSocial') {
            this.editar(this.constants.mObject, this.constants.currentActionString );
          } else {
            this.listar(this.constants.mObject, this.constants.currentActionString );
          }
        } else {
          this.currentAction = 'list';
          this.mapService.getVisor().visible = true;
          this.loadData();
        }

      }
    });

  }

}
