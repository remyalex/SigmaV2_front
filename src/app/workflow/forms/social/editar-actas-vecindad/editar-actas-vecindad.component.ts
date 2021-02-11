import { MapService } from './../../../../shared/services/map.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from 'src/app/gestion-social/registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { ActaVolanteResidenteModel } from 'src/app/gestion-social/registrar-acta-vecindad-volante/models/acta-volante-residente.model';
import { ActaVolanteService } from 'src/app/gestion-social/registrar-acta-vecindad-volante/services/acta-volante.service';

@Component({
  selector: 'app-editar-actas-vecindad',
  templateUrl: './editar-actas-vecindad.component.html'
})
export class EditarActasVecindadComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  // constants
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;


  columns = [
    'pk',
    'civ',
    'fechaInicioVisita',
    'fechaFinVisita',
    'turnoResidenteSocial',
    'zona',
    'responsable',
//    'barrio',
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
    'fechasIntervencion'
  ];

  actions: GridAccion[] = [
    { nombre: 'listVolantes', label: 'Registro de volante', icono: 'note_add', color: 'primary' },
    { nombre: 'consultaSocialVolante', label: 'Consulta solcializacion volante', icono: 'visibility', color: 'primary' },
    { nombre: 'aficheVolante', label: 'Afiche o Volante', icono: 'add_photo_alternate', color: 'primary' }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;

  actaVolanteResidenteCrear: ActaVolanteResidenteModel = new ActaVolanteResidenteModel();

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
    private service: ActaVolanteService
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    // Definición de formularios
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    //    this.data = new WorkflowMantenimientoActividadModel();
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

    this.commonService.getCondicionByNombre('PK_PARA_ACTASVOLANTE').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    console.log(event);
    switch (event.accion) {
      case 'listVolantes':
      case 'aficheVolante':
        this.listar(event.mantenimiento, event.accion);
        break;
      case 'consultaSocialVolante':
        this.listar(event.mantenimiento, event.accion);
        break;
    }
  }

  listar(mantenimiento: WorkflowMantenimientoModel, currentAction: any) {
    this.mantenimiento = mantenimiento;
    this.data.mantenimiento = this.mantenimiento;
    this.mapService.disconectGrid();
    this.currentAction = currentAction;
  }

  listarVolantes(mantenimiento: WorkflowMantenimientoModel, currentAction: any) {
    this.mantenimiento = mantenimiento;
    this.data.mantenimiento = this.mantenimiento;
    this.mapService.disconectGrid();
    this.currentAction = currentAction;
  }

  listarAfiches(mantenimiento: WorkflowMantenimientoModel, currentAction: any) {
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
    this.currentAction = 'crearVolantes';
  }

  onBack(event) {
    this.currentAction = 'list';
  }

}
