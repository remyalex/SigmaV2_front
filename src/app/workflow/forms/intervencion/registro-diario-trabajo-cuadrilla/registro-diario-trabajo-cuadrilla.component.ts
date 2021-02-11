import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { FormComponent } from '../../../interfaces/workflow-forms.interface';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { CommonService } from '../../../../shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from '../../../services/workflow-service.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { TokenStorageService } from '../../../../seguridad/services/token-storage.service';
import { MapService } from '../../../../shared/services/map.service';
import { ElementoAmbientalService } from '../../ambiental/realizar-inventario-elementos-ambientales/services/elemento-ambiental.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { KeyValuePair } from '../../../../shared/models/key-value-pair.model';
import { GridAccion } from '../../../../shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowCondicionModel } from '../../../models/workflow-condicion.model';
import { SigmaConfirmComponent } from '../../../../shared/sigma-confirm/sigma-confirm.component';
import { GridMantenimientosComponent } from '../../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { ProfileService } from '../../../../seguridad/services/profile.service';
// tslint:disable-next-line: max-line-length
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../../../../intervencion/registro-diario-trabajo-cuadrilla/registro-diario-trabajo-cuadrilla.constant';

@Component({
  selector: 'app-registro-diario-trabajo-cuadrilla',
  templateUrl: './registro-diario-trabajo-cuadrilla.component.html'
})
export class RegistroDiarioTrabajoCuadrillaComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  @ViewChild('grid') grid: GridMantenimientosComponent;

  /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  buttonShow: any = [];
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  nextTransition = false;
  onlyRead = false;
  componentVisible = true;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'upla',
    'barrio',
    'tipoIntervencion',
    'fechaProgramacionDiaria',
    'jornada',
    'fechaInforme',
    'estadoObra',
    'estadoRegistroDiarioCuadrilla',
    'estadoPk',
    'avancePorcentajeAcumuladoObra',
    'responsable'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'upla',
    'civ',
    'estadoPk',
    'zona',
    'localidad',
    'cuadrante',
    'barrio',
    'jornada',
    'estadoObra',
    'fechaInforme',
    'fechaProgramacionDiaria',
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [];

  excludeEstadoPk = [
    'Aprobado',
    'Buen estado',
    'Verificado',
    'Terminado (Cambio Geometria)',
    'Terminado (Sin Intervención)',
    'Terminado (Actualización diagnóstico)',
    'Terminado (Buen estado - seguimiento)',
    'Reservado',
    'Terminado (Vigencia diagnóstico)',
    'Terminado (Buen estado)',
    'Terminado (Reserva rechazada)',
    'Terminado (No viable)',
    'Historico migrado',
    'Prediagnostico',
    'Suspendido',
    'Terminado',
    'Priorizado',
    'Viable priorizacion',
    'Terminado (Excluido)',
    'Seguimiento',
    'Diagnosticado'
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
    private dialog: MatDialog,
    private servicioInventario: ElementoAmbientalService,
    private profileService: ProfileService
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.AppAccess();
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
    this.commonService.getCondicionByNombre('PK_REGISTRO_DIARIO_TRABAJO_CUADRILLA').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  AppAccess() {
    const permisoTrabajarCuadrilla = this.constants.registro_diario_cuadrilla_list_trabajar;
    const permisoConsultarCuadrilla = this.constants.registro_diario_cuadrilla_list_consultar;

    this.profileService.isGranted(permisoTrabajarCuadrilla).subscribe(data => {
      if (data.state) {
        this.buildButtonGrid('trabajar', 'Trabajar', 'note_add', 'primary');
      }
    });

    this.profileService.isGranted(permisoConsultarCuadrilla).subscribe(data => {
      if (data.state) {
        this.buildButtonGrid('consultarAprobar', 'Consultar y aprobar', 'visibility', 'primary');
      }
    });

  }

  buildButtonGrid(nombre: any, label: any, icono: any, color: any) {
    this.buttonShow = [];
    this.buttonShow.nombre = nombre;
    this.buttonShow.label = label;
    this.buttonShow.icono = icono;
    this.buttonShow.color = color;
    this.acciones.push(this.buttonShow);
  }

  executeSingleAction(event) {
    this.nextTransition = false;
    switch (event.accion) {
      case 'trabajar':
        this.workCuadrilla(event);
        break;
      case 'consultarAprobar':
        this.consultarCuadrilla(event);
        break;
    }
  }

  workCuadrilla(event) {
    if (event.mantenimiento.intervenciones.length <= 0) {
      this.showMessageSnackBar('El PK no cuenta con una Intervención');
    } else {
      this.onlyRead = false;
      this.currentAction = event.accion;
      this.utilitiesServices.scrollToTop();
      this.mapService.getVisor().visible = false;
      this.grid = event.grid;
      this.mantenimiento = event.mantenimiento;
    }

  }

  consultarCuadrilla(event) {

    if (event.mantenimiento.intervenciones.length <= 0) {
      this.showMessageSnackBar('El PK no cuenta con una Intervención');
    } else if (!event.mantenimiento.intervenciones[0].cuadrillas) {
      this.showMessageSnackBar('El PK no tiene registros asociados');
    } else {
      this.onlyRead = true;
      this.currentAction = 'trabajar';
      this.utilitiesServices.scrollToTop();
      this.mapService.getVisor().visible = false;
      this.grid = event.grid;
      this.mantenimiento = event.mantenimiento;
    }

  }

  viewMap(event) {
    this.mapService.getVisor().visible = event.show;
    this.utilitiesServices.scrollToTop();
  }

  back(event) {
    super.cancel();
  }

  showMessageSnackBar(message: string) {
    this.snackBar.open(
      message, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    }
    );
  }

  saveAllForm(event) {
    this.nextTransition = event.nextTransition;
  }

  executeTransition(): void {
    this.data.mantenimiento = this.mantenimiento;
    this.data.mantenimiento.intervenciones[0].programacionesDiarias = [];
    this.applySingleTransitionTo();
  }

}
