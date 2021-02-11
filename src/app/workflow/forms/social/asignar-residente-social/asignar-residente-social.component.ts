import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { CONST_ASIGNAR_RESIDENTE_SOCIAL } from './asignar-residente-social.constants';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { PersonaService } from 'src/app/administracion/persona/services/persona.service';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { Profile } from 'src/app/seguridad/models/profile';

@Component({
  selector: 'app-asignar-residente-social',
  templateUrl: './asignar-residente-social.component.html'
})
export class AsignarResidenteSocialComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {

 /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_RESIDENTE_SOCIAL;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'pk',
    'civ',
    'zona',
    'fechaInicioVisita',
    'fechaFinVisita',
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
    'turnoResidenteSocial',
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'barrio',
    'nombreResidenteSocial'
  ];

  filtersConsulta = [
    'residenteSocial'
  ];

  accionesMasivas: GridAccion[] = [
    { nombre: 'asignarResidenteSocial', label: 'Asignar PKs', icono: 'assignment_ind', color: 'primary' }
  ];


  loadingResidentes = false;
  mantenimientos: WorkflowMantenimientoModel[];
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];
  residentesSociales: Persona[] = [];
  residenteSocialSeleccionado: Persona;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  condicionConsulta: WorkflowCondicionModel;
  zona: ListaItem;
  selectedPerson: any;
  estadoGestionSocialAbierto: ListaItem;
  estadoAsignacion = this.constants.asignacion;
  showSeleccionTransicion = false;
  cloneResidentesSociales: Persona[];

  @ViewChild(MatPaginator) set matPaginator(paginadorResidentes: MatPaginator) {
    this.dataSourceResidenteSocial.paginator = paginadorResidentes;
  }
  @ViewChild(MatSort) set matSort(sortResidentes: MatSort) {
    this.dataSourceResidenteSocial.sort = sortResidentes;
  }
  columnsResidentesSociales: string[] = ['numeral', 'nombres', 'cant_Pks_Asig_Residente_Social', 'select'];
  columnsResidentesSocialesConsultar: string[] = ['numeral', 'nombres', 'cant_Pks_Asig_Residente_Social'];
  dataSourceResidenteSocial = new MatTableDataSource<Persona>(this.residentesSociales);
  errorServiceResidentesSociales = null;

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
    this.commonService.getCondicionByNombre('PK_PENDIENTE_ASIGNAR_RESIDENTE_SOCIAL').subscribe(_condicion => {
      this.condicion = _condicion;
    });
    this.commonService.getCondicionByNombre('PK_CON_RESIDENTE_SOCIAL_ASIGNADO').subscribe(_condicion => {
      this.condicionConsulta = _condicion;
    });
    this.commonService.getListaItemByNombreListaAndValorItem('ESTADO_PROCESO_GESTION_SOCIAL', 'ABIERTO').subscribe(estadoAbierto => {
      this.estadoGestionSocialAbierto = estadoAbierto;
    });
  }

  getResidentesSocialesConPksAsignados() {
    this.loadingResidentes = true;
    this.personaService.getAllResidentesSocialesConNumeroAsignaciones().subscribe(personas => {
      this.residentesSociales = personas;
      this.cloneResidentesSociales = JSON.parse(JSON.stringify(personas));
      this.dataSourceResidenteSocial.data = this.residentesSociales;
      let count = 0;
      for (const residente of this.residentesSociales) {
        residente.posicion = ++count;
      }
      this.loadingResidentes = false;
    },
    error => {
      this.errorServiceResidentesSociales = 'No se encuentran resultados';
      if (error.status === 500) {
        this.errorServiceResidentesSociales = 'No se encuentran resultados';
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
      case 'asignarResidenteSocial':
        this.mantenimientos = event.mantenimientos;
        this.gestionarAsignacionResidenteSocial();
        break;
    }
  }

  gestionarAsignacionResidenteSocial() {
    this.errorServiceResidentesSociales = null;
    this.residenteSocialSeleccionado = null;
    this.mantenimientosSeleccionados = [];
    this.showSeleccionTransicion = false;
    this.estadoAsignacion = this.constants.asignacion;
    this.getResidentesSocialesConPksAsignados();
    this.mapService.getVisor().visible = false;
    this.currentAction = 'asignarResidenteSocial';
    this.utilitiesServices.scrollToTop();
  }

  toggelChecksResidente(residnete: Persona, event: any) {
    this.residenteSocialSeleccionado = residnete;
  }

  asignar() {
    for (const mantenimiento of this.mantenimientosSeleccionados) {
      mantenimiento.intervenciones[0].residenteSocial = this.residenteSocialSeleccionado.usuario;
      mantenimiento.intervenciones[0].estadoGestionSocial = this.estadoGestionSocialAbierto;

      mantenimiento.residenteSocial = mantenimiento.intervenciones[0].residenteSocial;
      //rellenar intervencion en Acta Volante - BUG 19411
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
    this.residenteSocialSeleccionado.cant_Pks_Asig_Residente_Social =
      this.residenteSocialSeleccionado.cant_Pks_Asig_Residente_Social + this.mantenimientosSeleccionados.length;
      this.estadoAsignacion = this.constants.guardado;
  }

  cancelar() {
    this.currentAction = 'list';
    this.mapService.getVisor().visible = true;
  }

  validate(): boolean {
    let valid = true;
    if (this.residenteSocialSeleccionado && this.mantenimientosSeleccionados.length > 0) {
      for (const mantenimiento of this.mantenimientosSeleccionados) {
        if (mantenimiento.intervenciones[0].turnoResidenteSocial === undefined ||
          mantenimiento.intervenciones[0].turnoResidenteSocial === null) {
          valid = false;
        }
      }
    } else {
      valid = false;
    }
    return valid;
  }

  setEstadoEditar() {
    const residentes = JSON.parse(JSON.stringify(this.cloneResidentesSociales));
    for (const residente of residentes) {
      const index = this.residentesSociales.findIndex(r => r.id === residente.id);
      this.residentesSociales[index].cant_Pks_Asig_Residente_Social = residente.cant_Pks_Asig_Residente_Social;
    }
    this.estadoAsignacion = this.constants.edicion;
  }

  actualizarMantenimientosSeleccionados(event: any) {
    this.mantenimientosSeleccionados = event;
  }

  guardarTodo() {
    this.showSeleccionTransicion = true;
    this.showMessageSuccessful();
  }

  executeTransition(event: any) {
    this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, null);
    this.showSeleccionTransicion = false;
    this.utilitiesServices.scrollToTop();
    this.mapService.getVisor().visible = true;
  }

}
