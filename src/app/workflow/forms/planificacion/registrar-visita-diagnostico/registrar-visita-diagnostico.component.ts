import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../../diagnostico/shared/diagnostico.constants';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { VisitaModel } from 'src/app/workflow/models/visita.model';

/** Componente encargado de gestionar el proceso de registro de visita de diagnóstico */
@Component({
  selector: 'app-registrar-visita-diagnostico',
  templateUrl: './registrar-visita-diagnostico.component.html'
})
export class RegistrarVisitaDiagnosticoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  // constants
 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Mantenimiento de salida actualizado al componente que lo invoca */
  mantenimientoSalida: WorkflowMantenimientoModel;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id',
    'pk',
    'civ',
    'solicitudRadicadoEntrada',
    'solicitudRadicadoSalida',
    'origen',
    'estadoPk',
    'fechaAsignacion',
    'fechaVencimiento',
    'responsable'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'id',
    'pk',
    'civ',
    'estadoPk',
    'solicitudRadicadoEntrada',
    'origen',
    'fechaAsignacion',
    'fechaVencimiento',
    'vencimiento',
    'responsable'
  ];
  /** Listado de acciones que se pueden ejecutar desde la grilla */
  actions: GridAccion[] = [
    { nombre: 'work', label: 'Trabajar', icono: 'edit', color: 'primary' },
    { nombre: 'route', label: 'Mostrar ruta', icono: 'directions_car', color: 'primary' }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
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
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    // Definición de formularios

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
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
    this.commonService.getCondicionByNombre('PK_DIAGNOSTICO_REGISTRAR').subscribe(_condicion => {
      this.condicion = _condicion;
    });
    this.mapService.getVisor().visible = true;

  }

  /** Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit() {
    if (this.accion) {
      switch (this.accion) {
        case 'work':
          this.work(this.data.mantenimiento);
          break;
        case 'workAutoprogramar':
            this.workAutoprogramar(this.data.mantenimiento);
            break;
        case 'route':
          this.mostrarRuta(this.data.mantenimiento);
      }
    }
  }

  /**
   * Método que permite mostrar la ruta de la visita asocciada al mantenimiento
   *
   * @param mantenimiento Mantenimiento al cual se le va a aplicar la
   * accion realizada por el usuario
   */
  mostrarRuta(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.getVisor().limpiar();
    if (mantenimiento.visitas !== null && mantenimiento.visitas.length > 0) {
      const visita: VisitaModel = mantenimiento.visitas[0];
      if (visita.rutaMapa !== null) {
        this.mapService.getVisor().dibujarRutaJson(visita.rutaMapa);
      } else {
        this.snackBar.open('No hay una ruta para el mantenimiento seleccionado', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
      }
    } else {
      this.snackBar.open('No hay una ruta para el mantenimiento seleccionado', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event: any) {
    switch (event.accion) {
      case 'work':
        this.work(event.mantenimiento);
        break;
      case 'route':
        this.mostrarRuta(event.mantenimiento);
    }
  }

  /**
   * Método encargado de redireccionar la acción del usuario a la acción del servicio
   *
   * @param mantenimiento Mantenimiento al cual se le va a aplicar la
   * accion realizada por el usuario
   */
  work(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.disconectGrid();
    this.mapService.getVisor().limpiar();
    this.mapService.getVisor().visible = false;
    super.work(mantenimiento, true);
  }

  /**
   * Método encargado de redireccionar la acción del usuario a la acción del servicio
   * de autoprogramación
   *
   * @param mantenimiento Mantenimiento al cual se le va a aplicar la
   * accion realizada por el usuario
   */
  workAutoprogramar(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.disconectGrid();
    this.mapService.getVisor().visible = false;
    super.work(mantenimiento, true);
  }

  /**
   * Método encargado de actualizar el mantenimiento de acuerdo al evento
   * recibido por desde el componente interior
   *
   * @param event Evento con objeto de mantenimiento
   */
  actualizarMantenimiento(event): void {
    this.clone = JSON.parse(event.mantenimiento);
  }

  /** Método encargado de validar las secciones segun el tipo de superficie seleccionado */
  isValid(): boolean {

    let resultado = true;
    if (this.clone === null || this.clone === undefined) { return false; }
    if (this.clone.diagnostico === null || this.clone.diagnostico === undefined) { return false; }
    if (this.clone.diagnostico.encabezado === null || this.clone.diagnostico.encabezado === undefined) { return false; }
    if (this.clone.tipoSuperficie === null || this.clone.tipoSuperficie === undefined) { return false; }

    switch (this.clone.tipoSuperficie.descripcion) {
      case 'RÍGIDO':
      case 'FLEXIBLE':
      case 'ADOQUÍN CONCRETO':
      case 'ADOQUÍN ARCILLA':
        resultado = this.clone.diagnostico.fallas.length > 0;
        if (!resultado) { return false; }
        resultado = this.clone.diagnostico.muestreos.length > 0;
        break;

      case 'MIXTOS':
        resultado = this.clone.diagnostico.fallas.length > 0;
        if (!resultado) { return false; }
        break;
    }

    if (this.clone.diagnostico.fotos === null ||
      this.clone.diagnostico.fotos === undefined ||
      this.clone.diagnostico.fotos.length === 0) { return false; }

    if (this.clone.diagnostico.priorizacion === undefined ||
      this.clone.diagnostico.priorizacion === null ||
      this.clone.diagnostico.priorizacion.id === undefined) { return false; }

    return resultado;
  }

  /** Método encargado de ejecutar la transición seleccionada por el usuario */
  executeTransition(): void {
    this.data.mantenimiento = this.clone;
    this.accion = null;
    this.applySingleTransitionTo();
  }

  /** Método encargado de devolver a la pagina principal el componente */
  back(event) {
    this.currentAction = 'list';
    this.accion = null;
    setTimeout(() => {
      super.seleccionarGrid(0);
    }, 2000);
  }

}
