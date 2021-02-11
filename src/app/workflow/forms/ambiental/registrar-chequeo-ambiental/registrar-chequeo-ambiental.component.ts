import { KeyValuePair } from './../../../../shared/models/key-value-pair.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListCheqAmbiArchivo } from './../../../models/ListCheqAmbiArchivo.model';
import { MatDialog } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaChequeoAmbiental } from './../../../models/listaChequeoAmbiental.model';
import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { CONST_GESTION_AMBIENTAL } from '../gestion-ambietal.constant';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { ProfileService } from 'src/app/seguridad/services/profile.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-registrar-chequeo-ambiental',
  templateUrl: './registrar-chequeo-ambiental.component.html'
})

export class RegistrarChequeoAmbientalComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  public  constants = CONST_GESTION_AMBIENTAL;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'pk',
    'civ',
    'zona',
    'localidad',
    'upla',
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'pk',
    'civ',
    'barrio',
  ];

  PKconListaChequeoAmbiental: KeyValuePair[] = [
    { key: 'actividadActualId', value: '73' },
  ];

  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán de forma predeterminada en este componente */
  defaultFilters: KeyValuePair[] = [];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  listaChequeoAmbiental: ListaChequeoAmbiental;
  listaChequeoAmbientalInfo: ListaChequeoAmbiental = new ListaChequeoAmbiental();
  listCheqAmbiArchivo: ListCheqAmbiArchivo;
  requerido = true;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  fecha: string;
  mantenimiento: WorkflowMantenimientoModel;

  public form: FormGroup;
  public disabledForm: boolean = false;
  public opciones = [
    { name: this.constants.si, value: 1, id: 1 },
    { name: this.constants.no, value: 0, id: 2 }
  ];

  defaulFilters: KeyValuePair[] = [];

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
    private profileService: ProfileService,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  setFormulario(disabled = false) {
    this.form = this.formBuilder.group({
      fecha: [{ value: null, disabled: true }, [Validators.required]],
      tieneBanos: [{ value: null, disabled: disabled }, [Validators.required]],
      cantidadBanos: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.pattern('[0-9]*')])],
      tieneProteccionSumideros: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadProteccionSumideros: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.pattern('[0-9]*')])],
      tieneProteccionArboles: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadProteccionArboles: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.pattern('[0-9]*')])],
      tieneCerramiento: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadCerramiento: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.pattern('[0-9]*')])],
      tieneSenderos: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadSenderos: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.pattern('[0-9]*')])],
      archivoId: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      tieneEspacioPublico: [{ value: null, disabled: disabled }, Validators.compose([Validators.required])],
      cantidadEspacioPublico: [{ value: null, disabled: disabled }, Validators.compose([Validators.min(1), Validators.pattern('[0-9]*')])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({key: 'actividadActualProcesoParaleloId', value: this.data.actividad.id.toString()});
    this.profileService.isGranted(this.constants.permiso_registrar_chequeoAmbiental_create).subscribe(data => {
      if (data.state) {
        this.disabledForm = false;
        this.acciones.push({ nombre: 'registrarChequeo', label: 'Registrar Chequeo', icono: 'note_add', color: 'primary' },);
      } else {
        this.disabledForm = true;
        this.acciones.push({ nombre: 'registrarChequeo', label: 'Registrar Chequeo', icono: 'visibility', color: 'primary' });
      }
    });

    this.setFormulario(this.disabledForm);

    this.enviada = false;
    this.listaChequeoAmbiental = new ListaChequeoAmbiental();
    this.listCheqAmbiArchivo = new ListCheqAmbiArchivo();

    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
    this.commonService.getCondicionByNombre('PK_REGISTRAR_CEQHEO_AMBIENTAL').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  executeSingleAction(event) {
    switch (event.accion) {
      case 'registrarChequeo':
        this.mantenimiento = event.mantenimiento;
        this.currentAction = 'registrarChequeo';
        this.registrarChequeo(event.mantenimiento);
        this.mapService.getVisor().visible = false;
        break;
    }
  }

  registrarChequeo(mantenimiento: WorkflowMantenimientoModel) {
    this.data.mantenimiento = mantenimiento;
    this.listaChequeoAmbiental = new ListaChequeoAmbiental();

    if (!this.data.mantenimiento.intervenciones) {
      this.data.mantenimiento.intervenciones = [];
    }

    if (this.data.mantenimiento.intervenciones.length > 0) {
      if (this.data.mantenimiento.intervenciones[0].listaChequeoAmbiental.length > 0) {
        this.listaChequeoAmbiental = this.data.mantenimiento.intervenciones[0].listaChequeoAmbiental[0];
      } else {
        this.data.mantenimiento.intervenciones[0].listaChequeoAmbiental = [];
      }
    } else {
      this.data.mantenimiento.intervenciones.push(new Intervencion());
      this.data.mantenimiento.intervenciones[0].listaChequeoAmbiental = [];
    }

    this.currentAction = 'registrarChequeo';

    for (var key in this.listaChequeoAmbientalInfo) {
      var posicion = key.search(this.constants.select);
      if (posicion > 0) {
        var attr = key.replace(this.constants.select, '');
        if (this.listaChequeoAmbiental.id > 0) {
          if (this.listaChequeoAmbiental[attr] == 1 || this.listaChequeoAmbiental[attr] == 0) {
            this.listaChequeoAmbiental[key] = { value: this.listaChequeoAmbiental[attr], id: this.listaChequeoAmbiental[attr] ? 1 : 2 };
          }
        } else {
          this.listaChequeoAmbiental[key] = null;
        }
      }
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    if (this.validate(this.form)) {
      if (this.data.mantenimiento.intervenciones[0].listaChequeoAmbiental.length === 0) {
        this.listaChequeoAmbiental.intervencionEncabezado = new Intervencion();
        this.listaChequeoAmbiental.intervencionEncabezado.id = this.data.mantenimiento.intervenciones[0].id;
        this.listaChequeoAmbiental.intervencionEncabezado.mantenimiento = new WorkflowMantenimientoModel();
        this.listaChequeoAmbiental.intervencionEncabezado.mantenimiento.id = this.data.mantenimiento.id;
        this.data.mantenimiento.intervenciones[0].listaChequeoAmbiental.push(this.listaChequeoAmbiental);
      } else {
        // La posición cero siempre traera la ultima visita prediseño activa
        this.listaChequeoAmbiental = this.data.mantenimiento.intervenciones[0].listaChequeoAmbiental[0];
        this.listaChequeoAmbiental.intervencionEncabezado = new Intervencion();
        this.listaChequeoAmbiental.intervencionEncabezado.id = this.data.mantenimiento.intervenciones[0].id;
        this.listaChequeoAmbiental.intervencionEncabezado.mantenimiento = new WorkflowMantenimientoModel();
        this.listaChequeoAmbiental.intervencionEncabezado.mantenimiento.id = this.data.mantenimiento.id;
      }

      this.utilitiesServices.scrollToTop();
      this.applyChange(this.mantenimiento);
      //super.saveAll();
    }
  }

  public applyChange(mantenimiento: WorkflowMantenimientoModel) {
    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
    const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
    mantenimientoActividad.mantenimiento = mantenimiento;
    mantenimientosActividad.push(mantenimientoActividad);

    this.processing = true;

    this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
      this.mantenimiento = data[0].mantenimiento;

      this.utilitiesServices.scrollToTop();
      this.processing = false;

      var message = this.constants.successSave;
      if (this.listaChequeoAmbiental.id) {
        message = this.constants.successEdit;
      }

      this.snackBar.open(message, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });

      this.listaChequeoAmbiental.id = data[0].mantenimiento.intervenciones[0].listaChequeoAmbiental[0].id;
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      this.processing = false;
    });
  }

  back(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.currentAction = 'list';
          setTimeout(() => {
            this.mapService.getVisor().visible = true;
          }, 100);
        }
      }
    );
  }

  changeTiene(value, tieneAttr, cantidadAttr) {
    if (value) {
      this.listaChequeoAmbiental[tieneAttr] = value.value;

      if (this.listaChequeoAmbiental[tieneAttr]) {
        this.listaChequeoAmbiental[cantidadAttr] = 1;
        // tslint:disable-next-line: max-line-length
        this.form.get(cantidadAttr).setValidators([Validators.required, Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')]);
      } else {
        this.listaChequeoAmbiental[cantidadAttr] = 0;
        this.form.get(cantidadAttr).setValidators([Validators.min(0), Validators.max(99), Validators.pattern('[0-9]*')]);
      }
    }
  }

  saveAll(): void {
    this.utilitiesServices.scrollToTop();
    this.data.mantenimiento.chequeoAmbiental = true;
    super.saveAll();
  }

}
