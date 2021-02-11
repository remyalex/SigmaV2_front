import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { CONST_ASIGNAR_RESIDENTE_SST } from './gestionar-residente-sst.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { PersonaService } from 'src/app/administracion/persona/services/persona.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { Profile } from 'src/app/seguridad/models/profile';
import { ProfileService } from 'src/app/seguridad/services/profile.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-gestionar-residentes-sst',
  templateUrl: './gestionar-residentes-sst.component.html'
})
export class GestionarResidentesSSTComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_RESIDENTE_SST;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'pk',
    'civ',
    'fechaInicioVisita',
    'fechaFinVisita',
    'zona',
    'localidad',
    'barrio',
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
    'turnoResidenteSST',
    'zona',
    'nombreResidenteSST',
  ];

  filtersConsulta = [
    'residenteSST'
  ];

  accionesMasivas: GridAccion[] = [
    { nombre: 'asignarResidenteSST', label: 'Asignar PKs', icono: 'assignment_ind', color: 'primary' }
  ];


  loadingResidentes = false;
  mantenimientos: WorkflowMantenimientoModel[];
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];
  residentesSST: Persona[] = [];
  residenteSSTSeleccionado: Persona;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  condicionConsulta: WorkflowCondicionModel;
  zona: ListaItem;
  selectedPerson: any;
  estadoGestionSSTAbierto: ListaItem;
  estadoAsignacion = this.constants.asignacion;
  showSeleccionTransicion = false;
  cloneResidentesSST: Persona[];
  esCoordinador = false;

  @ViewChild(MatPaginator) set matPaginator(paginadorResidentes: MatPaginator) {
    this.dataSourceResidenteSST.paginator = paginadorResidentes;
  }
  @ViewChild(MatSort) set matSort(sortResidentes: MatSort) {
    this.dataSourceResidenteSST.sort = sortResidentes;
  }
  columnsResidentesSST: string[] = ['numeral', 'nombres', 'cant_Pks_Asig_Residente_SST', 'select'];
  columnsResidentesSSTConsultar: string[] = ['numeral', 'nombres', 'cant_Pks_Asig_Residente_SST'];
  dataSourceResidenteSST = new MatTableDataSource<Persona>(this.residentesSST);
  errorServiceResidentesSST = null;

  defaulFilters: KeyValuePair[] = [];
  defaultFiltersConsultar: KeyValuePair[] = [];
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
    this.defaulFilters.push({ key: 'permisoId', value: '1' });

    this.esCoordinador = this.profileService.isGrantedFunction(this.constants.permiso_ver_todos_pks_asignados_sst);
    if (this.esCoordinador) {
     this.defaultFiltersConsultar.push({ key: 'permisoId', value: '389' });
     this.defaultCriteria();
    }

    this.mapService.getVisor().visible = true;
    this.loadData();
    this.commonService.getCondicionByNombre('PK_PENDIENTE_ASIGNACION_RESIDENTE_SST').subscribe(_condicion => {
      this.condicion = _condicion;
    });
    this.commonService.getCondicionByNombre('PK_CON_RESIDENTE_SST_ASIGNADO').subscribe(_condicion => {
      this.condicionConsulta = _condicion;
    });
    this.commonService.getListaItemByNombreListaAndValorItem('ESTADO_PROCESO_GESTION_SST', 'ABIERTO').subscribe(estadoAbierto => {
      this.estadoGestionSSTAbierto = estadoAbierto;
    });
  }

  getResidentesSSTesConPksAsignados() {
    this.loadingResidentes = true;
    this.personaService.getAllResidentesSSTConNumeroAsignaciones().subscribe(personas => {
      this.residentesSST = personas;
      this.cloneResidentesSST = JSON.parse(JSON.stringify(personas));
      this.dataSourceResidenteSST.data = this.residentesSST;
      let count = 0;
      for (const residente of this.residentesSST) {
        residente.posicion = ++count;
      }
      this.loadingResidentes = false;
    },
      error => {
        this.errorServiceResidentesSST = 'No se encuentran resultados';
        if (error.status === 500) {
          this.errorServiceResidentesSST = 'No se encuentran resultados';
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
  ejecutar(event) {
    switch (event.accion) {
      case 'asignarResidenteSST':
        this.mantenimientos = event.mantenimientos;
        this.gestionarAsignacionResidenteSST();
        break;
    }
  }

  gestionarAsignacionResidenteSST() {
    this.errorServiceResidentesSST = null;
    this.residenteSSTSeleccionado = null;
    this.mantenimientosSeleccionados = [];
    this.showSeleccionTransicion = false;
    this.estadoAsignacion = this.constants.asignacion;
    this.getResidentesSSTesConPksAsignados();
    this.mapService.getVisor().visible = false;
    this.currentAction = 'asignarResidenteSST';
    this.utilitiesServices.scrollToTop();
  }

  toggelChecksResidente(residnete: Persona, event: any) {
    this.residenteSSTSeleccionado = residnete;
  }

  asignar() {
    for (const mantenimiento of this.mantenimientosSeleccionados) {
      mantenimiento.intervenciones[0].residenteSST = this.residenteSSTSeleccionado.usuario;
      mantenimiento.intervenciones[0].estadoGestionSST = this.estadoGestionSSTAbierto;
      mantenimiento.residenteSst = this.residenteSSTSeleccionado.usuario;
    }
    this.residenteSSTSeleccionado.cant_Pks_Asig_Residente_SST =
      this.residenteSSTSeleccionado.cant_Pks_Asig_Residente_SST + this.mantenimientosSeleccionados.length;
    this.estadoAsignacion = this.constants.guardado;
  }

  cancelar() {
    this.currentAction = 'list';
    this.mapService.getVisor().visible = true;
  }

  validate(): boolean {
    let valid = true;
    if (this.residenteSSTSeleccionado && this.mantenimientosSeleccionados.length > 0) {
      for (const mantenimiento of this.mantenimientosSeleccionados) {
        if (mantenimiento.intervenciones[0].turnoResidenteSST === undefined ||
          mantenimiento.intervenciones[0].turnoResidenteSST === null) {
          valid = false;
        }
      }
    } else {
      valid = false;
    }
    return valid;
  }

  setEstadoEditar() {
    const residentes = JSON.parse(JSON.stringify(this.cloneResidentesSST));
    for (const residente of residentes) {
      const index = this.residentesSST.findIndex(r => r.id === residente.id);
      this.residentesSST[index].cant_Pks_Asig_Residente_SST = residente.cant_Pks_Asig_Residente_SST;
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
    this.applySingleTransitionTo();
    //this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, null);
    this.showSeleccionTransicion = false;
    this.utilitiesServices.scrollToTop();
    this.mapService.getVisor().visible = true;
  }

}
