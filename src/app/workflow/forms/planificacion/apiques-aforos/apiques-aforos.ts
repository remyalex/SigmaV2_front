import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
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
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MapService } from 'src/app/shared/services/map.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-apiques-aforos',
  templateUrl: './apiques-aforos.html'
})
export class ApiquesAforosComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {

  columns = [
    'pk',
    'estadoPk',
    'localidad',
    'zona',
    'barrio',
    'responsable',
    'origen',
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'localidad',
    'zona',
    'barrio',
  ];

  filtersVincularRadicado = [
    'pk'
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'vincular', label: 'Radicado de entrada', icono: 'description', color : '' }
  ];

  filtersApiques: KeyValuePair[] = [
    { key: 'pk', value: 'NULL' },
    { key: 'localidad', value: 'NULL' },
    { key: 'zona', value: 'NULL' },
    { key: 'barrio', value: 'NULL' }
  ];

  tipoSolicitudPeticionario: ListaItem;
  entradaConsultaRadicadoEntrada: string;

  // Formularios
  formularioConsultaPK: FormGroup;
  formularioConsultaRadicadoEntrada: FormGroup;

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
    mapService: MapService
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

    this.formularioConsultaRadicadoEntrada = this.formBuilder.group({
      'entradaConsultaRadicadoEntrada': [],
      'solicitudRadicadoEntrada': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'fechaRadicacion': [],
      'fechaVencimiento': [],
      'remitente': [],
      'asunto': [],
      'dependenciaAsignada': [],
      'fechaGeneracionDocumento': [],
    });

    this.forms.push(this.formularioConsultaPK);
    this.forms.push(this.formularioConsultaRadicadoEntrada);

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
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case 'vincular':
        this.vincular(event.mantenimiento);
        break;
    }
  }

  public vincular(mantenimiento: WorkflowMantenimientoModel) {
    this.data.mantenimiento = mantenimiento;
    this.currentAction = 'vincular';
  }

  buscarRadicado() {
    this.processingSelectPk = true;
    this.data.mantenimiento.solicitudFecha = null;
    this.data.mantenimiento.solicitudVencimiento = null;
    this.data.mantenimiento.solicitudRemitente = null;
    this.data.mantenimiento.solicitudAsunto = null;
    this.data.mantenimiento.solicitudDependenciaAsignada = null;
    this.data.mantenimiento.solicitudFechaVinculacion = null;
    this.commonService.getRadicadoOrfeo(this.entradaConsultaRadicadoEntrada).subscribe((item: any) => {
      this.data.mantenimiento.solicitudRadicadoEntrada = item.numeroRadicado;
      this.data.mantenimiento.solicitudFecha = item.fechaRadicado;
      this.data.mantenimiento.solicitudVencimiento = item.fechaVencimiento;
      this.data.mantenimiento.solicitudRemitente = item.nombre + ' ' + item.primerApellido + ' ' + item.segundoApellido;
      this.data.mantenimiento.solicitudAsunto = item.asunto;
      this.data.mantenimiento.solicitudDependenciaAsignada = '';
      this.data.mantenimiento.solicitudFechaVinculacion = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
      this.processingSelectPk = false;
    }, error => {
      this.processingSelectPk = false;
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

}
