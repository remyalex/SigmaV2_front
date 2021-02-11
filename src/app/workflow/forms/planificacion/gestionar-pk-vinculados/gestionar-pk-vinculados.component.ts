import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';


/** Componente encargado de gestionar el proceso de gestionar un pk vinculado*/
@Component({
  selector: 'app-gestionar-pk-vinculados',
  templateUrl: './gestionar-pk-vinculados.component.html'
})
export class GestionarPkVinculadosComponent extends BaseComponent implements OnInit, AfterViewChecked,  OnDestroy, FormComponent {

  /** Listado de columnas de la grilla de transiciones a presentar */
  columnsTransiciones = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'barrio',
    'estadoPk',
    'solicitudRadicadoEntrada',
    'solicitudFechaVinculacion',
    'solicitudRadicadoSalida'
  ];

  /** Filtros de transiciones */
  filtersTransiciones = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'barrio',
    'estadoPk',
    'solicitudRadicadoEntrada',
    'solicitudRadicadoSalida'
  ];

  /** Acciones a realizar por parte del usuario */
  actions: GridAccion[] = [
    { nombre: 'desvincular', label: 'desvincular', icono: 'link_off', color: 'primary' }
  ];

  /** Acciones a realizar para radicados de salida */
  accionesRadicadoSalida: GridAccion[] = [
    { nombre: 'asignarRadicadoSalida', label: 'radicado de salida', icono: 'link', color: 'primary' }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  /** Grilla de mantenimientos a presentar al usuario */
  grid: GridMantenimientosComponent;
  /** Listado de mantenimientos Seleccionados */
  mantenimientosSeleccionados: WorkflowMantenimientoModel[] = [];

  /** Formulario de consulta de radicados */
  formularioConsultaRadicadoSalida: FormGroup;
  /** Formulario de consulta de Pks */
  formularioConsultaPK: FormGroup;

  /** Origen del pk a vincular */
  origenPk: ListaItem;
  /**Información de consulta del radicado de salida*/
  entradaConsultaRadicadoSalida: string;

   /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
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
    mapService: MapService,
    private dialog: MatDialog,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    // Definición de formularios
    this.formularioConsultaPK = this.formBuilder.group({
      'entradaConsultaPK': [],
      'pk': [null, Validators.compose([Validators.required])],
      'civ': [null, Validators.compose([Validators.required])],
      'calzadaAncho': [],
      'calzadaArea': [],
      'localidadNombre': [],
      'barrioNombre': [],
      'ejeVial': [],
      'upla': [],
      'malla': [],
      'sectorNombre': [],
      'longitud': [],
      'estadoMantenimiento': [],
      'estadoPk': [{ value: null, disabled: true }],
      'indicePriorizacion': [],
      'responsable': [],
      'usoDeLaVia': []

    });

    this.formularioConsultaRadicadoSalida = this.formBuilder.group({
      'entradaConsultaRadicadoSalida': [],
      'solicitudRadicadoSalida': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
    });

    this.forms.push(this.formularioConsultaRadicadoSalida);

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }

    this.commonService.getCondicionByNombre('PK Vinculado pendiente de enviar a programacion').subscribe(_condicion => {
      this.condicion = _condicion;
    });

    this.commonService.getListaItemByNombreListaAndValorItem('MEJORAMIENTO_TIPO_SOLICITUD', 'PETICIONARIO').subscribe((item) => {
      this.origenPk = item;
    });

    this.mapService.getVisor().limpiar();
    this.mapService.getVisor().visible = true;
    this.mapService.getVisor().seleccionMasiva = true;
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event: any) {
    this.mapService.getVisor().visible = false;
    switch (event.accion) {
      case 'asignarRadicadoSalida':
        this.asignarRadicadoSalida(event);
        break;
    }
  }

  /** Método encargado de ejecutar las acciones
   * individuales invocadas sobre un pk
   *
   * @param event Evento ejecutado por el usuario con
   * el nombre de la accion realizada
   **/
  ejecutarIndividual( event: any ) {
    this.mapService.getVisor().visible = false;
    switch (event.accion) {
      case 'desvincular':
        this.desvincularRadicadoSalida(event);
        break;
    }
  }

  /** Método encargado de ejecutar la acción
   * de asignación de  radicados de salida invocadas sobre un pk
   *
   * @param event Evento ejecutado por el usuario con
   * el objeto mantenimiento a procesar
   **/
   asignarRadicadoSalida(event: any) {
    this.limpiarVariablesDeFormulario();
    this.mantenimientosSeleccionados = event.mantenimientos;
    this.grid = event.grid;
    this.currentAction = 'asignarRadicadoSalida';
  }

  /** Método encargado de realizar la acción de cancelar la
   * vinculación en el formulario actual */
  cancel() {
    this.currentAction = this.lastAction;
    this.mapService.getVisor().visible = true;
  }

  /** Desvincula el radicado selecccionado del listado de radicados
   *
   * @param event Objeto evento del usuario con la información del Pk seleccionados
   */
  desvincularRadicadoSalida(event: any) {
    this.limpiarVariablesDeFormulario();
    this.mapService.getVisor().visible = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.mantenimiento = event.mantenimiento;

    if (this.mantenimiento.solicitudRadicadoSalida != null) {
      const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);
      dialogRef.beforeClosed().subscribe(
        val => {
          if (val === 1) {
            this.mapService.getVisor().visible = true;
              this.mantenimiento.solicitudRadicadoSalida = null;
              this.data.mantenimiento = this.mantenimiento;
              super.applySingleTransitionTo();
          }
        }
      );

    } else {
      this.snackBar.open('El mantenimiento no tiene radicado de salida', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /** Método encargado de limpiar los datos del formulario de consulta */
  limpiarVariablesDeFormulario() {
    this.entradaConsultaRadicadoSalida = null;
    this.data.mantenimiento.solicitudRadicadoSalida = null;
    this.data.transicion = null;
  }

  /**
   * Invocar la acción de búsqueda de radicados de salida
   */
  buscarRadicadoSalida() {
    this.processingSelectPk = true;
    this.data.mantenimiento.solicitudRadicadoSalida = null;
    this.commonService.getRadicadoOrfeo(this.entradaConsultaRadicadoSalida).subscribe((item: any) => {
      this.data.mantenimiento.solicitudRadicadoSalida = item.numeroRadicado;
      this.processingSelectPk = false;
    }, error => {
      this.processingSelectPk = false;
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

  /**
   * Acción encargada de almacenar el radicado para el mantenimiento
   * @param event Evento con datos de mantenimientos seleccionados por el usuario
  */
  saveRadicado(event): void {
    this.mapService.getVisor().visible = true;
    this.mantenimientosSeleccionados.forEach(mantenimiento => {
      mantenimiento.solicitudRadicadoSalida = this.data.mantenimiento.solicitudRadicadoSalida;
    });
    this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, this.grid);
  }

  /**
   * Método encargado de eecutar la transicion de forma masiva para varios
   * pks seleccionados por el usuario.
   *
   * @param event Evento con datos de mantenimientos seleccionados por el usuario
   */
  executeMasiveTransition(event: any): void {
    event.mantenimientos.forEach(mantenimiento => {
      mantenimiento.origen = this.origenPk;
      mantenimiento.fechaSolicitudProgramacion = this.utilitiesServices.getFechaServerFormat(new Date);
    });
    super.applyMasiveTransitionTo(event.mantenimientos, event.grid);
  }
}
