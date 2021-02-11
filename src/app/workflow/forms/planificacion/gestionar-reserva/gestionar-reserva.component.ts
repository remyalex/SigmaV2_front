import { GridMantenimientoCriteria } from './../../../../shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
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
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { CONST_GESTIONAR_RESERVA } from './gestionar-reserva.constants';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';

@Component({
  selector: 'app-gestionar-reserva',
  templateUrl: './gestionar-reserva.component.html'
})
export class GestionarReservaComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  // Constantes
 /** Constantes a usar en el componente */
  constants = CONST_GESTIONAR_RESERVA;

  // Definición de las columnas que se muestran en la tabla
  columns = [
    'pk',
    'civ',
    'radicadoSolicitudReserva',
    'radicadoRespuestaReserva',
    'estadoPk',
    'origen',
    'kmCarrilImpacto',
  ];

  filtersRadicadoSalida = [
    'pk',
    'radicadoSolicitudReserva',
    'zona',
    'localidad',
    'barrio'

  ];

  filtersRadicadoEntrada = [
    'pk',
    'radicadoSolicitudReserva',
    'radicadoRespuestaReserva',
    'zona',
    'localidad',
    'barrio'
  ];

  filtersTransiciones = [
    'pk',
    'radicadoSolicitudReserva',
    'radicadoRespuestaReserva',
    'zona',
    'localidad',
    'barrio'
  ];

  asignarRadicadoSalida: GridAccion[] = [
    { nombre: 'radicadoSalida', label: 'radicado de salida', icono: 'call_made', color: 'primary' },
  ];

  asignarRadicadoEntrada: GridAccion[] = [
    { nombre: 'radicadoEntrada', label: 'radicado de entrada', icono: 'call_received', color: 'primary' },
  ];

  columnsTransiciones = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'barrio',
    'estadoPk',
    'solicitudRadicadoEntrada',
  ];

  entradaConsultaRadicadoEntrada: string;
  entradaConsultaRadicadoSalida: string;

  condicionRadSalida: WorkflowCondicionModel;
  condicionRadEntrada: WorkflowCondicionModel;

  radicadoSolicitudReserva: string;
  radicadoRespuestaReserva: string;
  fechaVencimiento: string;
  remitente: string;
  asunto: string;
  fechaGeneracionDocumento: string;
  dependenciaAsignada: string;
  fechaRadicacion: string;
  tipoRadicadoRespuestaReserva: ListaItem;

  // Formularios
  formularioConsultaRadicadoEntrada: FormGroup;
  formularioConsultaRadicadoSalida: FormGroup;
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];
  grid: GridMantenimientosComponent;

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
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    // Definición de formularios


    this.formularioConsultaRadicadoSalida = this.formBuilder.group({
      'entradaConsultaRadicadoSalida': [],
      'radicadoSolicitudReserva': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'fechaRadicacion': [],
      'fechaVencimiento': [],
      'remitente': [],
      'asunto': [],
      'dependenciaAsignada': [],
      'fechaGeneracionDocumento': []
    });
    this.formularioConsultaRadicadoEntrada = this.formBuilder.group({
      'entradaConsultaRadicadoEntrada': [],
      'solicitudRadicadoEntrada': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'fechaRadicacion': [],
      'fechaVencimiento': [],
      'remitente': [],
      'asunto': [],
      'dependenciaAsignada': [],
      'fechaGeneracionDocumento': [],
      'tipoRadicadoRespuestaReserva': [null, Validators.compose([Validators.required])]
    });

    this.forms.push(this.formularioConsultaRadicadoEntrada);
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
    this.commonService.getCondicionByNombre('PK_PENDIENTE_GESTIONAR_RESERVA').subscribe(_condicion => {
      this.condicionRadSalida = _condicion;
    });
    this.commonService.getCondicionByNombre('PK_PENDIENTE_GESTIONAR_RESERVA_CON_RADICADO_SALIDA').subscribe(_condicion => {
      this.condicionRadEntrada = _condicion;
    });
  }

  public seleccionarGrid(tab: number) {
    super.seleccionarGrid(tab);
    this.mapService.getVisor().visible = false;
  }

  private limpiarVariablesDeFormulario() {
    this.radicadoSolicitudReserva = null;
    this.radicadoRespuestaReserva = null;
    this.fechaVencimiento = null;
    this.remitente = null;
    this.asunto = null;
    this.fechaGeneracionDocumento = null;
    this.dependenciaAsignada = null;
    this.fechaRadicacion = null;
    this.tipoRadicadoRespuestaReserva = null;
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case 'radicadoEntrada':
        this.radicadoEntrada(event);
        break;
      case 'radicadoSalida':
        this.radicadoSalida(event);
        break;
    }
  }

  /**
   * Método encargado de realizar la solicitud de radicado de salida
   *
   * @param event Evento con los datos del mantenimiento seleccionado por el usuario
   */
  public radicadoSalida(event: any) {
    this.limpiarVariablesDeFormulario();
    this.mantenimientosSeleccionados = event.mantenimientos;
    this.currentAction = 'radicadoSalida';
    this.grid = event.grid;
  }

  /**
   * Método encargado de realizar la solicitud de radicado de entrada
   *
   * @param event Evento con los datos del mantenimiento seleccionado por el usuario
   */
  public radicadoEntrada(event: any) {
    this.limpiarVariablesDeFormulario();
    this.mantenimientosSeleccionados = event.mantenimientos;
    this.currentAction = 'radicadoEntrada';
    this.grid = event.grid;
  }

  /**
   * Método encargado de realizar la búsqueda del radicado de entrada
   * de entrada indicado por el usuario.
   */
  buscarRadicadoEntrada() {
    this.processingSelectPk = true;
    this.limpiarVariablesDeFormulario();

    this.commonService.getRadicadoOrfeo(this.entradaConsultaRadicadoEntrada).subscribe((item: any) => {
      this.radicadoRespuestaReserva = item.numeroRadicado;

      this.fechaVencimiento = item.fechaVencimiento;
      this.remitente = (item.nombre != null ? item.nombre : '') +
      ' ' + (item.primerApellido != null ? item.primerApellido : '')+
      ' ' + (item.segundoApellido != null ? item.segundoApellido : '');
      this.asunto = item.asunto;
      this.fechaGeneracionDocumento = item.fechaRadicado;
      this.dependenciaAsignada = '';
      this.fechaRadicacion = '';

      this.processing = false;
    }, error => {
      this.processing = false;
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

  /**
   * Método encargado de realizar la búsqueda del radicado de salida
   * de entrada indicado por el usuario.
   */
  buscarRadicadoSalida() {
    this.processing = true;
    this.limpiarVariablesDeFormulario(); this.commonService.getRadicadoOrfeo(this.entradaConsultaRadicadoSalida).subscribe((item: any) => {
      this.radicadoSolicitudReserva = item.numeroRadicado;
      this.fechaVencimiento = item.fechaVencimiento;
      this.remitente = (item.nombre != null ? item.nombre : '') +
      ' ' + (item.primerApellido != null ? item.primerApellido : '')+
      ' ' + (item.segundoApellido != null ? item.segundoApellido : '');
      this.asunto = item.asunto;
      this.fechaGeneracionDocumento = item.fechaRadicado;
      this.dependenciaAsignada = '';
      this.fechaRadicacion = '';

      this.processing = false;
    }, error => {
      this.processing = false;
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

  /**
   * Evento de cancelar consulta de radicado de salida
  */
  cancelRadSalida() {
    this.currentAction = this.lastAction;
    this.entradaConsultaRadicadoSalida = null;
    this.mapService.getVisor().visible = false;
  }

  /**
   * Evento de cancelar consulta de radicado de entrada
  */
  cancelRadEntrada() {
    super.cancel(1);
    this.mapService.getVisor().visible = false;
    this.entradaConsultaRadicadoEntrada = null;
  }

  /**
   * Almacenar el radicado del radicado de salida en el mantenimiento seleccionado
  */
  saveRadicadoSalida(): void {
    this.mantenimientosSeleccionados.forEach(mantenimiento => {
      mantenimiento.radicadoSolicitudReserva = this.radicadoSolicitudReserva;
    });
    this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, this.grid);
  }

  /**
   * Almacenar el radicado del radicado de entrada en el mantenimiento seleccionado
  */
  saveRadicadoEntrada(): void {
    this.mantenimientosSeleccionados.forEach(mantenimiento => {
      mantenimiento.radicadoRespuestaReserva = this.radicadoRespuestaReserva;
      mantenimiento.tipoRadicadoRespuestaReserva = this.tipoRadicadoRespuestaReserva;
    });
    this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, this.grid);
  }

  /**
   * Método encargado de actualizar el modelo con el valor seleccionado
   * por el usuario en la lista de tipo de respuesta
   *
   * @param lista Item seleccionado por el usuario
   */
  onChangeTipoRespuesta(lista: ListaItem): void {
    if (lista !== undefined && lista !== null && lista.id !== null) {
      this.tipoRadicadoRespuestaReserva = lista;
    }
  }
}
