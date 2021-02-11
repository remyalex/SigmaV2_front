import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../../diagnostico/shared/diagnostico.constants';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { MapService } from 'src/app/shared/services/map.service';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { GridMantenimientosComponent } from '../../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { timeout } from 'rxjs/operators';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { Profile } from 'src/app/seguridad/models/profile';

@Component({
  selector: 'app-programar-visita-verificacion',
  templateUrl: './programar-visita-verificacion.component.html'
})
export class ProgramarVisitaVerificacionComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  @ViewChild('view') view: GridMantenimientosComponent;
  @ViewChild('grid') grid: GridMantenimientosComponent;

  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  public mostrarVerificarProgramar = false;
  public consultarVerificarProgramar = false;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  public consultaProgramacion: any = {};
  public liderProgramacion = 'liderProgramacion';
  public directorObra = 'directorObra';
  public criteriaMap: GridMantenimientoCriteria = new GridMantenimientoCriteria();
  public condicion: WorkflowCondicionModel;
  public nombreCondicion: string;
  editEnabled = false;
  public esLider = false;
  public esDirector = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  usuarioLogueado: UsuarioInfo;

  public columnsDirectorObra = [
    'select', 'pk', 'civ', 'zona', 'fechaProgramacionVisita', 'fechaInicioVisita', 'fechaFinVisita', 'directorDeObra'
  ];
  public columns = [
    'pk', 'civ', 'zona', 'localidad', 'upla', 'barrio', 'descripcionActividadAgrupada', 'kmCarrilImpacto', 'radicadoIntervencion',
    'responsable',
  ];
  public filters = [
    'pk', 'civ', 'zona', 'localidad', 'upla', 'barrio', 'actividadAgrupada', 'radicadoInterExclusivo'
  ];

  public columnsToExport = [
    'pk', 'civ', 'zona', 'localidad', 'upla', 'barrio', 'ejeVial', 'desde', 'hasta', 'numeroCarriles',
    'tipoIntervencion', 'intervencionAgrupada', 'intervencionDetallada', 'estrategia', 'indicePriorizacion',
    'fechaAsignacion', 'origen', 'estadoProgramacion', 'estadoPk', 'radicadoIntervencion', 'fechaProgramacionVisita',
    'fechaInicioVisita', 'fechaFinVisita', 'directorDeObra', 'ancho', 'area', 'longitud', 'kmCarrilImpacto', 'responsable'
  ];

  public columnsView = [
    'posicion', 'pk', 'civ', 'fechaProgramacionVisita', 'fechaInicioVisita', 'fechaFinVisita', 'directorDeObra'
  ];
  public columnsToExportView = [
    'pk', 'civ', 'zona', 'localidad', 'upz', 'barrio', 'ejeVial', 'desde', 'hasta', 'numeroCarriles',
    'tipoIntervencion', 'intervencionAgrupada', 'intervencionDetallada', 'estrategia', 'indicePriorizacion',
    'fechaAsignacion', 'origen', 'programa', 'estadoProgramacion', 'estadoPk', 'radicadoIntervencion',
    'fechaProgramacionVisita', 'fechaInicioVisita', 'fechaFinVisita', 'directorDeObra', 'ancho', 'area',
    'longitud', 'kmCarrilImpacto', 'tipoMalla'
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
    private profileService: ProfileService,
    private dialog: MatDialog,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.esDirector = this.profileService.isGrantedFunction(this.constants.permiso_director_obra);
    if (this.esDirector) {
      this.nombreCondicion = 'PK_PROGRAMAR_VISITA_VERIFICACION_DIRECTOR';
    }

    this.esLider = this.profileService.isGrantedFunction(this.constants.permiso_profesional_lider_programacion);
    if (this.esLider) {
      this.nombreCondicion = 'PK_PROGRAMAR_VISITA_VERIFICACION_LIDER';
    }
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.commonService.getCondicionByNombre(this.nombreCondicion).
      subscribe(_condicion => {
        this.condicion = _condicion;
      });
    this.mapService.getVisor().visible = true;
    this.usuarioLogueado = this.tokenStorageService.getStorage(this.tokenStorageService.PERFIL);
    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  mostrarProgramacionVisita(show) {
    if (show === 'mostrarVerificarProgramar') {
      this.mostrarVerificarProgramar = true;
      this.consultarVerificarProgramar = false;
    } else {
      this.showConsultarElements(this.constants.permiso_profesional_lider_programacion, this.liderProgramacion);
      this.mostrarVerificarProgramar = false;
      this.consultarVerificarProgramar = true;
      setTimeout(() => {
        this.view.loadData();
      }, 1000);
    }

    this.utilitiesServices.scrollToTop();
  }

  closeMostrarProgramacionVisita() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      mensaje: this.constants.deseaSalir
    };
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.mostrarVerificarProgramar = false;
        this.consultarVerificarProgramar = false;
        this.utilitiesServices.scrollToTop();
        setTimeout(() => {
          this.mapService.getVisor().visible = true;
          this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
        }, 10);
      }
    });

  }

  defaultCriteria() {
    this.criteria.responsableId = '';
    this.criteria.actividadActualId = this.data.actividad.id.toString();
  }

  showConsultarElements(permiso, attr, consultar = false) {
    this.profileService.isGranted(permiso).subscribe(data => {
      if (data.state) {
        this.consultaProgramacion[attr] = true;
      } else if (!data.state && !consultar) {
        this.showConsultarElements(this.constants.permiso_director_obra, this.directorObra, true);
      }
    });
  }

  setupEventForm(event: any) {
    this.editEnabled = event.hiddenClose;
  }

  exportAsXLSX() {
    this.view.export();
  }

  cerrarComponentes(event: any) {
    this.mostrarProgramacionVisita('mostrarVerificarProgramar');
    // this.mostrarVerificarProgramar = false;
    // this.consultarVerificarProgramar = false;
    this.editEnabled = false;
    setTimeout(() => {
      this.seleccionarGrid(0);
      this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    }, 500);
  }
}
