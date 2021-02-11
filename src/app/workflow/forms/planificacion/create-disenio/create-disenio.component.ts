import { Disenio } from 'src/app/mejoramiento/disenio/models/disenio.model';
import { MapService } from '../../../../shared/services/map.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
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
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowCondicionModel } from '../../../models/workflow-condicion.model';
import { GridMantenimientosComponent } from '../../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';

@Component({
  selector: 'app-editar-disenio',
  templateUrl: './create-disenio.component.html'
})
export class CreateDisenioComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  @ViewChild('grid') grid: GridMantenimientosComponent;

  disenio: any;
  disenioCurrent: any;
  informacionDisenio: any;
  informacionDisenioCapas: any;
  saveConsultaRedes: any;
  saveOtrosDocumentos: any;
  informacionDisenioComplementaria: any;
  informacionDisenioParametro: any;
  mantenimiento: WorkflowMantenimientoModel;
  cloneDisenioCrear: Disenio;
  public petition = null;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'direccion',
    'fechaVisitaDisenio',
    'tipoIntervencion',
    'origen',
    'localidad',
    'zona',
    'cuadrante',
    'consultaRedes',
    'levantamientoTopografico',
    'fichaEvaluacionEstructural',
    'informacionDeDisenio',
    'modulacionLosas',
    'otrosDocumentos'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk'
  ];

  acciones = [
    { nombre: '', label: 'Trabajar', icono: 'note_add', color: 'primary' }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;

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
    super(servicio, commonService, formBuilder, workflowService,
      excelService, utilitiesServices, snackBar, tokenStorageService, mapService);
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
    this.commonService.getCondicionByNombre('PK_REGISTRAR_DISENIO').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event) {
    this.currentAction = 'work';
    this.mantenimiento = event.mantenimiento;
    this.disenio = event.mantenimiento.disenio;
    this.cloneDisenioCrear = JSON.parse(JSON.stringify(this.disenio));
  }

  saveFunction(event) {
    this.data.transicion = null;
    this.data.mantenimiento = event.mantenimiento;
    this.disenioCurrent = event.disenio;
    this.saveAll(false);
  }

  saveDisenioFunctionParent(event) {
    this.saveConsultaRedes = event.mantenimiento.disenio.consultaRedes;
    this.saveOtrosDocumentos = event.mantenimiento.disenio.otrosDocumentos;
    this.informacionDisenio = event.mantenimiento.disenio.disenioInformacion;
    this.informacionDisenioCapas = event.mantenimiento.disenio.capas;
    this.informacionDisenioComplementaria = event.mantenimiento.disenio.disenioInformacionComplementaria;
    this.informacionDisenioParametro = event.mantenimiento.disenio.disenioParametro;

    event.mantenimiento.disenio.consultaRedes = null;
    event.mantenimiento.disenio.otrosDocumentos = null;
    event.mantenimiento.disenio.disenioInformacion = null;
    event.mantenimiento.disenio.capas = null;
    event.mantenimiento.disenio.disenioInformacionComplementaria = null;
    event.mantenimiento.disenio.disenioParametro = null;

    if (!event.mantenimiento.disenio.fechaCreacionDisenio) {
      event.mantenimiento.disenio.fechaCreacionDisenio = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
    }

    this.data.transicion = null;
    this.data.mantenimiento = event.mantenimiento;

    if (this.petition) {
      this.petition.unsubscribe();
    }

    this.petition = this.workflowService.update(this.data).subscribe((mantenimientoActividad) => {
      this.data.mantenimiento = mantenimientoActividad.mantenimiento;
      this.data.mantenimiento.disenio.disenioInformacion = this.informacionDisenio;
      this.data.mantenimiento.disenio.consultaRedes = this.saveConsultaRedes;
      this.data.mantenimiento.disenio.otrosDocumentos = this.saveOtrosDocumentos;
      this.data.mantenimiento.disenio.capas = this.informacionDisenioCapas;
      this.data.mantenimiento.disenio.disenioInformacionComplementaria = this.informacionDisenioComplementaria;
      this.data.mantenimiento.disenio.disenioParametro = this.informacionDisenioParametro;
      this.saveDisenioFunctionChildren();
    },
      error => {
        this.utilitiesServices.ErrorMessages(error, this.snackBar);
      });

  }

  saveDisenioFunctionChildren() {
    this.data.transicion = null;

    if (this.petition) {
      this.petition.unsubscribe();
    }

    this.petition = this.workflowService.update(this.data).subscribe((mantenimientoActividad) => {
      this.utilitiesServices.formSuccessMessages('¡Se actualizaron los datos con exito!', this.snackBar);
      this.mantenimiento = mantenimientoActividad.mantenimiento;
      this.disenio = this.mantenimiento.disenio;
      this.currentAction = 'work';
    },
      error => {
        this.utilitiesServices.ErrorMessages(error, this.snackBar);
      });
  }

  saveDisenioFunction(event) {
    this.saveDisenioFunctionParent(event);
  }

  back(event) {
    this.currentAction = event.currentAction;

    if (this.currentAction === 'list') {
      this.mapService.getVisor().activarSeleccion = true;
      this.mapService.getVisor().limpiar();
      this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    }

    this.cloneDisenioCrear = event.disenio;
    this.disenioCurrent = event.disenio;
  }

  executeTransition(): void {
    this.data.mantenimiento = this.mantenimiento;
    this.applySingleTransitionTo();
    this.mapService.getVisor().activarSeleccion = true;
    this.mapService.getVisor().limpiar();
    this.disenioCurrent = null;
    this.disenio = null;
    setTimeout(() => {
      this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    }, 4500);
  }

  ngOnDestroy(): void {
    this.mapService.getVisor().activarSeleccion = true;
    super.ngOnDestroy();
  }

}
