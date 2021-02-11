import { Disenio } from 'src/app/mejoramiento/disenio/models/disenio.model';
import { MapService } from './../../../../shared/services/map.service';
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
import { DisenioEditComponent } from '../../../../mejoramiento/disenio/disenio-edit/disenio-edit.component';
import { WorkflowCondicionModel } from '../../../models/workflow-condicion.model';
import { GridMantenimientosComponent } from '../../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';

@Component({
  selector: 'app-editar-disenio',
  templateUrl: './editar-disenio.component.html'
})
export class EditarDisenioComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  @ViewChild('grid') grid: GridMantenimientosComponent;

  disenio: any;
  cloneDisenioEditar: Disenio;
  mantenimiento: any;
  disenioCurrent: any;
  mantenimientoActividad: WorkflowMantenimientoModel;
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
    'informacionDeDisenio'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk'
  ];

  acciones = [
    { nombre: '', label: 'Trabajar', icono: 'edit', color: 'primary' }
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
    this.commonService.getCondicionByNombre('PK_ACTUALIZAR_DISENIO').subscribe(_condicion => {
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
    this.disenio = this.mantenimiento.disenio;
    this.cloneDisenioEditar = JSON.parse(JSON.stringify(this.disenio));
  }

  saveFunction(event) {
    this.data.mantenimiento = event.mantenimiento;
    this.disenioCurrent = event.disenio;
    this.saveAll(false);
  }

  saveDisenioFunction(event) {
    this.data.transicion = null;
    this.data.mantenimiento = event.mantenimiento;

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

  back(event) {
    this.currentAction = event.currentAction;

    if (this.currentAction === 'list') {
      this.mapService.getVisor().activarSeleccion = true;
      this.mapService.getVisor().limpiar();
      this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    }

    if (typeof event.disenio !== 'undefined') {
      this.disenio = event.disenio;
      this.cloneDisenioEditar = event.disenio;
    }
    this.disenio = this.cloneDisenioEditar;
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
