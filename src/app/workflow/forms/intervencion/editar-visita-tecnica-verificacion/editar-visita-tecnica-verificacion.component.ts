import { MapService } from './../../../../shared/services/map.service';
import { Component, OnInit, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
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
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { ProfileService } from 'src/app/seguridad/services/profile.service';

@Component({
  selector: 'app-editar-visita-tecnica-verificacion',
  templateUrl: './editar-visita-tecnica-verificacion.component.html'
})
export class EditarVisitaTecnicaVerificacionComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'upla',
    'barrio',
    'descripcionActividadAgrupada',
    'kmCarrilImpacto',
    'radicadoIntervencion',
    'responsable'
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
    'actividadAgrupada',
    'radicadoInterExclusivo'
  ];

  acciones = [];
  defaultFilters = [];
  private loading = false;

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
    private profileService: ProfileService
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService,
      excelService, utilitiesServices, snackBar, tokenStorageService, mapService);
    
      this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    let isPermisoRegistrarVisita = false;
    let isPermisoConsultarVisitasProgramadas = false;
    let isPermisoConsultarVisitasProgramadas_verTodas = false;

    const permisoRegistrarVisita = 'INTERVENCION_REGISTRO_VISITA_TECNICA_VERIFICACION_BOTON_REGISTRAR_VISITA';
    const permisoConsultarVisitasProgramadas = 'INTERVENCION_REGISTRO_VISITA_TECNICA_VERIFICACION_BOTON_CONSULTAR_VISITA';
    // tslint:disable-next-line: max-line-length
    const permisoConsultarVisitasProgramadas_verTodas = 'INTERVENCION_REGISTRO_VISITA_TECNICA_VERIFICACION_BOTON_CONSULTAR_VISITA_VER_TODAS';

    this.profileService.isGranted(permisoRegistrarVisita).subscribe(data => {
      if (data.state) {
        isPermisoRegistrarVisita = true;
      }
    });

    this.profileService.isGranted(permisoConsultarVisitasProgramadas).subscribe(data => {
      if (data.state) {
        isPermisoConsultarVisitasProgramadas = true;
      }
    });

    this.profileService.isGranted(permisoConsultarVisitasProgramadas_verTodas).subscribe(data => {
      if (data.state) {
        isPermisoConsultarVisitasProgramadas_verTodas = true;
      }
    });

    if (isPermisoRegistrarVisita) {
      this.acciones.push(
        { nombre: 'RegistrarVisita', label: 'Registrar visita', icono: 'note_add', color: 'primary' });
    }
    if (isPermisoConsultarVisitasProgramadas) {
      this.acciones.push(
        { nombre: 'ConsultarVisitas', label: 'Consultar visitas programadas', icono: 'visibility', color: 'primary' });
    }

    if (isPermisoConsultarVisitasProgramadas_verTodas) {
      this.defaultFilters.push({key: 'permisoId', value: 1});
    }

    this.commonService.getCondicionByNombre('PK_REGISTRO_VISITA_TECNICA_VERIFICACION').subscribe(condicion => {
      this.condicion = condicion;
    });

    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t =>
        t.nombre === 'Enviar a Registrar programación periodica de intervención');
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
    }
    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
    this.loading$.subscribe( status => {
      this.loading = status;
    });
  }

  onProcessing(event) {
   this.processing = event;
  }

  saveTransicionFunction(event) {
    this.data.mantenimiento = event.mantenimiento;
    this.applySingleTransitionTo();
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    this.mapService.getVisor().visible = false;
    this.currentAction = event.accion;
    this.mantenimiento = event.mantenimiento;
    this.utilitiesServices.scrollToTop();
  }

  saveFunction(event) {
    this.data.mantenimiento = event.mantenimiento;
    this.data.transicion = null;
    super.saveMantenimientoGrid('list');
    this.mapService.getVisor().visible = true;
  }

  saveFunctionAll(event) {
    this.data.mantenimiento = event.mantenimiento;
    this.data.transicion = null;
    super.saveMantenimientoGrid(null);
  }

  back(event) {
    this.mapService.getVisor().visible = true;
    this.currentAction = event.currentAction;
    setTimeout(() => {
      this.seleccionarGrid(0);
      this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    }, 500);
  }

}
