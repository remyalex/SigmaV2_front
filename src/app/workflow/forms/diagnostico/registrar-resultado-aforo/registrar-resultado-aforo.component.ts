import { MantenimientoDocumentoModel } from 'src/app/workflow/models/mantenimientoDocumento.model';
import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MapService } from 'src/app/shared/services/map.service';
import { Condiciones } from 'src/app/administracion/transicioncondiciones/models/condiciones.model';
import { ResultadosSolicitudesAforosComponent } from '../shared/resultadosSolicitudesAforos/resultados-solicitudes-aforos.component';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { Profile } from 'src/app/seguridad/models/profile';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

/** Componente encargado de gestionar el proceso de registro de resultados de aforos*/
@Component({
  selector: 'app-registrar-resultado-aforo',
  templateUrl: './registrar-resultado-aforo.component.html'
})
export class RegistrarResultadoAforoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'localidad',
    'zona',
    'barrio',
    'upla',
    'desde',
    'hasta',
    'responsable',
    'origen',
    'cantidadApiques',
    'prioritarios',
    'requiereAforo',
    'nomenclatura',
    'observacionDireccionApique',
    'solicitudAforo'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'localidad',
    'zona',
    'barrio',
    'upla',
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'adjuntarResultados', label: 'Adjuntar', icono: 'attach_file', color: 'primary' }
  ];

  /** Variable usada para traer el usuario actual logueado */
  reponsableForViewGrid: Profile;

  /** Variable usada para traer todos los pks independientes del usuario */
  defaulFilters: KeyValuePair[] = [];
  /**
  * Método encargado de construir una instancia de componente
  *
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param commonService Componente usado para invocar los servicios de mantenimiento
  * @param workflowService Componente usado para invocar los servicios de workflow
  * @param tokenStorageService Componente usado para obtener información del token del usuario
  * @param mapService Componente usado para gestionar información del mapa
  * @param formBuilder Componente usado para gestionar los elementos del formulario
  */
  constructor(
    servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    private dialog: MatDialog,
    mapService: MapService,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    this.resultadosDatasource = new MatTableDataSource<MantenimientoDocumentoModel>();

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mapService.forceShowMap();
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
    this.defaulFilters.push({ key: 'permisoId', value: '425' });
    this.reponsableForViewGrid = this.tokenStorageService.getStorage(this.tokenStorageService.PERFIL);
    this.commonService.getCondicionByNombre('PK_SOLICITUDES_APIQUE_REQUIEREN_AFOROS').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event) {
    switch (event.accion) {
      case 'adjuntarResultados': this.adjuntarResultados(event.mantenimiento);
        break;
    }
  }

  recarga(currentAction: any) {
    this.processing = true;
    this.currentAction = currentAction;
    setTimeout(() => {
      this.processing = false;
      this.currentAction = 'list';
    }, 1000);
  }

  /**
   * Método encargado de invocar el componente encargado de
   * solicitar los resultados de aforo
   *
   * @param mantenimiento Objeto del mantenimiento al cual se
   * le adjuntarán archivos de los resultados
   **/
  public adjuntarResultados(mantenimiento: WorkflowMantenimientoModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    mantenimiento.actividadActual.transiciones = this.transicionesIndividuales;
    dialogConfig.data = {
      'mantenimiento': mantenimiento,
      'editable': true
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(ResultadosSolicitudesAforosComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 0) {
          this.recarga('recarga');
        }
      }
    );
  }

}
