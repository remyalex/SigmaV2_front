import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { MatSnackBar, MatSort } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { CONST_ADMINISTRACION_MIGESTION } from '../migestion.constant';
import { MiGestionDatasource } from '../services/migestion.datasource';
import { MiGestionService } from '../services/migestion.service';
import { Router } from '@angular/router';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { FormGroup } from '@angular/forms';
import { MiGestionWidgetCriteria } from '../models/migestion-widget-criteria.model';

/** Componente encargado de presentar resumen de asignación al usuario por widget */
@Component({
  selector: 'sigma-administracion-migestion-widget',
  templateUrl: './migestion-widget.component.html'
})
export class MiGestionWidgetComponent implements OnInit{
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MIGESTION;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MiGestionDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new MiGestionWidgetCriteria();
  /** Servicio a traves del cual se invocan acciones de workflow*/
  workflowService: WorkflowService;
  /** Servicio a través del cual se invocan peticiones del token de usuario*/
  tokenStorageService: TokenStorageService;
  /** Objeto en el cual se almacena última activiad del workflow */
  mantenimientoActividad: WorkflowMantenimientoActividadModel;
  /** Formulario contenedor del componente */
  forms: FormGroup[] = [];
  /** Componente usado para abrir un recuadro modal */
  snackBar: MatSnackBar;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'actividadActual',
    'fecha',
    'estadoPk',
    'acciones'
  ];


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param _workflowService Servicio a traves del cual se invocan acciones de workflow
   * @param tokenStorageService Servicio a través del cual se invocan peticiones del token de usuario
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: MiGestionService,
    _workflowService: WorkflowService,
    tokenStorageService: TokenStorageService,
    private router: Router,
    private utilitiesService: UtilitiesService,
    snackBar: MatSnackBar,
  ) {
    this.workflowService = _workflowService;
    this.criteria = new MiGestionWidgetCriteria();
    this.tokenStorageService = tokenStorageService;
    this.snackBar = snackBar;
  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.dataSource = new MiGestionDatasource(this.servicio);
    this.loadData();
  }

  /** Método a través del cual se inicializan los criterios de busqueda del formulario */
  defaultCriteria(): void {
    this.criteria.responsableId = this.tokenStorageService.getId();
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.criteria.page = 0;
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.defaultCriteria();
    this.dataSource.loadDataToWidget(this.criteria);
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters', 'tieneActividadActual'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.loadData();
  }

  /**
   * Método encargado de redireccionar la acción del usuario a la acción del servicio
   *
   * @param mantenimiento Mantenimiento al cual se le va a aplicar la
   * accion realizada por el usuario
   */
  work(mantenimiento: any) {
    if (mantenimiento.actividadActual.id === 75) {
      this.router.navigate(['/produccion/programar-personal-planta/admin/' + mantenimiento.pk]);
    } else {
    this.workflowService.work(mantenimiento.id, mantenimiento.actividadActual.id).subscribe((data) => {
      this.mantenimientoActividad = data;
      // const actividadBase = mantenimiento.actividadActual.nombre.toLocaleLowerCase();
      this.router.navigate(['/workflow/' + this.mantenimientoActividad.actividad.proceso.url + '/'
        + this.mantenimientoActividad.actividad.url + '/'
        + mantenimiento.id
        + '/work'
        ]);
      },
      error => {
          this.utilitiesService.formErrorMessages(error, this.forms, this.snackBar);
      });
    }
  }

}
