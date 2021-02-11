import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { PersonaService } from 'src/app/administracion/persona/services/persona.service';
import { CONST_GESTNAR_ASIGNACION_RESIDENTE_AMBIENTAL } from './gestionar-asignacion-residente-ambiental.constants';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { Profile } from 'src/app/seguridad/models/profile';
import { ProfileService } from 'src/app/seguridad/services/profile.service';

@Component({
  selector: 'app-gestionar-asignacion-residentes-ambientales',
  templateUrl: './gestionar-asignacion-residentes-ambientales.component.html'
})
// tslint:disable-next-line: max-line-length
export class GestionarAsignacionResidentesAmbientalesComponent extends BaseComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_GESTNAR_ASIGNACION_RESIDENTE_AMBIENTAL;


  columns = [
    'posicion',
    'pk',
    'civ',
    'fechaInicioVisita',
    'fechaFinVisita',
    'turnoEjecucionIntervencion',
    'zona',
    'responsable'
  ];

  filtersTransiciones = [
    'pk',
    'civ',
    'zona',
    'upla',
    'localidad',
    'cuadrante',
    'barrio',
    'fechasIntervencion'
  ];

  columnsConsultar: string[] = [
    'select',
    'posicion',
    'pk',
    'civ',
    'fechaInicioVisita',
    'fechaFinVisita',
    'turnoResidenteAmbiental',
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'barrio',
    'nombreResidenteAmbiental'
  ];

  filtersConsulta = [
    'residenteAmbiental',
  ];

  defaulFiltersConsultas = [
    { 'key': 'permisoId', 'value': '5' }
  ];

  accionesMasivas: GridAccion[] = [
    { nombre: 'asignarResidenteAmbiental', label: 'Asignar PKs', icono: 'assignment_ind', color: 'primary' }
  ];


  loadingResidentes = false;
  mantenimientos: WorkflowMantenimientoModel[];
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];
  residentesAmbientales: Persona[] = [];
  residenteAmbientalSeleccionado: Persona;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  condicionConsulta: WorkflowCondicionModel;
  zona: ListaItem;
  selectedPerson: any;
  estadoGestionAmbientalAbierto: ListaItem;
  estadoAsignacion = this.constants.asignacion;
  showSeleccionTransicion = false;
  cloneResidentesAmbientales: Persona[];

  @ViewChild(MatPaginator) set matPaginator(paginadorResidentes: MatPaginator) {
    this.dataSourceResidenteAmbiental.paginator = paginadorResidentes;
  }
  @ViewChild(MatSort) set matSort(sortResidentes: MatSort) {
    this.dataSourceResidenteAmbiental.sort = sortResidentes;
  }
  columnsResidentesAmbientales: string[] = ['numeral', 'nombres', 'cant_Pks_Asig_Residente_Ambiental', 'select'];
  columnsResidentesAmbientalesConsultar: string[] = ['numeral', 'nombres', 'cant_Pks_Asig_Residente_Ambiental'];
  dataSourceResidenteAmbiental = new MatTableDataSource<Persona>(this.residentesAmbientales);
  errorServiceResidentesAmbientales = null;

  defaulFilters: KeyValuePair[] = [];
  reponsableForViewGrid: Profile;

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
    private personaService: PersonaService,
    private profileService: ProfileService
  ) {
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    this.mantenimientos = [];
    this.mantenimientosSeleccionados = [];
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.profileService.getProfile().subscribe(usuario => {
      this.reponsableForViewGrid = usuario;
    });
    this.defaulFilters.push({key: 'permisoId', value: '1'});
    this.mapService.getVisor().visible = true;
    this.loadData();
    this.commonService.getCondicionByNombre('PK_PENDIENTE_ASIGNACION_RESIDENTE_AMBIENTAL').subscribe(_condicion => {
      this.condicion = _condicion;
    });
    this.commonService.getCondicionByNombre('PK_CON_RESIDENTE_AMBIENTAL_ASIGNADO').subscribe(_condicion => {
      this.condicionConsulta = _condicion;
    });
    this.commonService.getListaItemByNombreListaAndValorItem('ESTADO_PROCESO_GESTION_AMBIENTAL', 'ABIERTO').subscribe(estadoAbierto => {
       this.estadoGestionAmbientalAbierto = estadoAbierto;
    });
    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  getResidentesAmbientalesConPksAsignados() {
    this.loadingResidentes = true;
    this.personaService.getAllResidentesAmbientalesConNumeroAsignaciones().subscribe(personas => {
      this.residentesAmbientales = personas;
      this.cloneResidentesAmbientales = JSON.parse(JSON.stringify(personas));
      this.dataSourceResidenteAmbiental.data = this.residentesAmbientales;
      let count = 0;
      for (const residente of this.residentesAmbientales) {
        residente.posicion = ++count;
      }
      this.loadingResidentes = false;
    },
      error => {
        this.errorServiceResidentesAmbientales = 'No se encuentran resultados';
        if (error.status === 500) {
          this.errorServiceResidentesAmbientales = 'No se encuentran resultados';
          this.snackBar.open('Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
        this.loadingResidentes = false;
      });
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case 'asignarResidenteAmbiental':
        this.mantenimientos = event.mantenimientos;
        this.gestionarAsignacionResidenteAmbiental();
        break;
    }
  }

  gestionarAsignacionResidenteAmbiental() {
    this.errorServiceResidentesAmbientales = null;
    this.residenteAmbientalSeleccionado = null;
    this.mantenimientosSeleccionados = [];
    this.showSeleccionTransicion = false;
    this.estadoAsignacion = this.constants.asignacion;
    this.getResidentesAmbientalesConPksAsignados();
    this.mapService.getVisor().visible = false;
    this.currentAction = 'asignarResidenteAmbiental';
    this.utilitiesServices.scrollToTop();
  }

  toggelChecksResidente(residnete: Persona, event: any) {
    this.residenteAmbientalSeleccionado = residnete;
  }

  asignar() {
    for (const mantenimiento of this.mantenimientosSeleccionados) {
      mantenimiento.intervenciones[0].residenteAmbiental = this.residenteAmbientalSeleccionado.usuario;
      mantenimiento.intervenciones[0].estadoGestionAmbiental = this.estadoGestionAmbientalAbierto;
      mantenimiento.residenteAmbiental = this.residenteAmbientalSeleccionado.usuario;
      // rellenar intervencion en Acta Volante - BUG 19411
      for (const actaVolante of mantenimiento.intervenciones[0].actasVolante) {
        actaVolante.intervencionEncabezado = new IntervencionInfo();
        actaVolante.intervencionEncabezado.id = mantenimiento.intervenciones[0].id;
        actaVolante.intervencionEncabezado.nroActa = mantenimiento.intervenciones[0].nroActa;
        actaVolante.intervencionEncabezado.observaciones = mantenimiento.intervenciones[0].observaciones;
        actaVolante.intervencionEncabezado.fechaVisita = mantenimiento.intervenciones[0].fechaVisita;
        actaVolante.intervencionEncabezado.activo = mantenimiento.intervenciones[0].activo;
        actaVolante.intervencionEncabezado.tipoVia = mantenimiento.tipoVia;
        actaVolante.intervencionEncabezado.tipoEjecucion = mantenimiento.intervenciones[0].tipoEjecucion;
        actaVolante.intervencionEncabezado.clase = mantenimiento.clase;
        actaVolante.intervencionEncabezado.rutaTransporte = mantenimiento.intervenciones[0].rutaTransporte;
        actaVolante.intervencionEncabezado.usuario = mantenimiento.intervenciones[0].usuario;
        actaVolante.intervencionEncabezado.tipoSuperficie = mantenimiento.intervenciones[0].tipoSuperficie;
      }
      //rellenar intervencion en Acta Afiche - BUG 19411
      for (const actasAfiche of mantenimiento.intervenciones[0].actasAfiche) {
        actasAfiche.intervencionEncabezado = new IntervencionInfo();
        actasAfiche.intervencionEncabezado.id = mantenimiento.intervenciones[0].id;
        actasAfiche.intervencionEncabezado.nroActa = mantenimiento.intervenciones[0].nroActa;
        actasAfiche.intervencionEncabezado.observaciones = mantenimiento.intervenciones[0].observaciones;
        actasAfiche.intervencionEncabezado.fechaVisita = mantenimiento.intervenciones[0].fechaVisita;
        actasAfiche.intervencionEncabezado.activo = mantenimiento.intervenciones[0].activo;
        actasAfiche.intervencionEncabezado.tipoVia = mantenimiento.tipoVia;
        actasAfiche.intervencionEncabezado.tipoEjecucion = mantenimiento.intervenciones[0].tipoEjecucion;
        actasAfiche.intervencionEncabezado.clase = mantenimiento.clase;
        actasAfiche.intervencionEncabezado.rutaTransporte = mantenimiento.intervenciones[0].rutaTransporte;
        actasAfiche.intervencionEncabezado.usuario = mantenimiento.intervenciones[0].usuario;
        actasAfiche.intervencionEncabezado.tipoSuperficie = mantenimiento.intervenciones[0].tipoSuperficie;
      }
    }
    this.residenteAmbientalSeleccionado.cant_Pks_Asig_Residente_Ambiental =
      this.residenteAmbientalSeleccionado.cant_Pks_Asig_Residente_Ambiental + this.mantenimientosSeleccionados.length;
    this.estadoAsignacion = this.constants.guardado;
  }

  cancelar() {
    this.currentAction = 'list';
    this.mapService.getVisor().visible = true;
  }

  validate(): boolean {
    let valid = true;
    if (this.residenteAmbientalSeleccionado && this.mantenimientosSeleccionados.length > 0) {
      for (const mantenimiento of this.mantenimientosSeleccionados) {
        if (mantenimiento.intervenciones[0].turnoResidenteAmbiental === undefined ||
          mantenimiento.intervenciones[0].turnoResidenteAmbiental === null) {
          valid = false;
        }
      }
    } else {
      valid = false;
    }
    return valid;
  }

  setEstadoEditar() {
    const residentes = JSON.parse(JSON.stringify(this.cloneResidentesAmbientales));
    for (const residente of residentes) {
      const index = this.residentesAmbientales.findIndex(r => r.id === residente.id);
      this.residentesAmbientales[index].cant_Pks_Asig_Residente_Ambiental = residente.cant_Pks_Asig_Residente_Ambiental;
    }
    this.estadoAsignacion = this.constants.edicion;
  }

  actualizarMantenimientosSeleccionados(event: any) {
    this.mantenimientosSeleccionados = event;
  }

  async guardarTodo() {
    this.showSeleccionTransicion = true;
    this.data.transicion = this.data.actividad.transiciones[0];
    this.data.usuarioAsignado = this.mantenimientosSeleccionados[0].responsable;
    const visible = await this.executeTransition();
    if (visible) {
        this.mapService.getVisor().limpiar();
        this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    }
  }

  async executeTransition() {
    await this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, null);
    this.showSeleccionTransicion = false;
    this.utilitiesServices.scrollToTop();
    this.mapService.getVisor().visible = true;
    return this.mapService.getVisor().visible;
  }


}
