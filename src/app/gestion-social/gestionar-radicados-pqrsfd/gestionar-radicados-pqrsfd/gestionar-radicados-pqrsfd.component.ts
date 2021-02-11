import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { CONST_GESTIONAR_RADICADOS_PQRSFD } from '../gestionar-radicados-pqrsfd.constant';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { RadicadoVinculadoService } from '../services/radicado-vinculado.service';
import { RadicadoVinculadoModel } from '../models/radicado-vinculado.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

@Component({
  selector: 'app-gestionar-radicados-pqrsfd',
  templateUrl: './gestionar-radicados-pqrsfd.component.html'
})
export class GestionarRadicadosPqrsfdComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {
  // constants
 /** Constantes a usar en el componente */
  constants = CONST_GESTIONAR_RADICADOS_PQRSFD;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'fechaInicioVisita',
    'fechaFinVisita',
    'turnoResidenteSocial',
    'zona',
    'responsable'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'barrio',
    'pk',
    'civ',
    'fechasIntervencion'
  ];

  actions: GridAccion[] = [
    { nombre: 'vincularRadicado', label: 'Vincular Radicado', icono: 'note_add', color: 'primary' },
    { nombre: 'eliminarRadicado', label: 'Eliminar Radicado', icono: 'delete', color: 'warn' }
  ];


  columnsRadicados = ['codigoRadicado', 'fecharadicado', 'acciones'];

  entradaConsultaRadicadoEntrada: string;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  defaulFilters: KeyValuePair[] = [];

  // Formularios
  formularioConsultaPK: FormGroup;
  formularioConsultaRadicadoEntrada: FormGroup;

  radicadoVinculado: RadicadoVinculadoModel;
  tipoRadicado: ListaItem;
  dataSourceRadicadosVinculados: MatTableDataSource<RadicadoVinculadoModel>;
  noInfoToShow = false;
  lengthList: Number;
  radicadosVinculados: any = [];



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
    private dialog: MatDialog,
    private radicadoService: RadicadoVinculadoService,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    // Definición de formularios
    this.formularioConsultaRadicadoEntrada = this.formBuilder.group({
      'entradaConsultaRadicadoEntrada': [],
      'solicitudRadicadoEntrada': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'fechaRadicacion': [],
      'fechaVencimiento': [],
      'remitente': [],
      'asunto': [],
      'dependenciaAsignada': [],
      'fechaGeneracionDocumento': [],
      'estadoRadicado': [],
    });

    this.dataSourceRadicadosVinculados = new MatTableDataSource([]);

    this.forms.push(this.formularioConsultaPK);
    this.forms.push(this.formularioConsultaRadicadoEntrada);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    this.data = new WorkflowMantenimientoActividadModel();

    /*
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
*/

    this.defaulFilters.push({key: 'permisoId', value: '1'});
    this.commonService.getCondicionByNombre('PK_GESTIONAR_RADICADOS_PQRSFD').subscribe(_condicion => {
      this.condicion = _condicion;
    });

    this.mapService.getVisor().visible = true;

    this.commonService.getListaItemByNombreListaAndValorItem('TIPO_RADICADO', 'RADICADO SALIDA').subscribe(listaItem => {
      this.tipoRadicado = listaItem;
    });

   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case this.constants.vincularRadicado:
        this.vincular(event.mantenimiento);
        break;
      case this.constants.eliminarRadicado:
        this.desvincular(event.mantenimiento);
        break;
    }
  }

  listar(mantenimiento: WorkflowMantenimientoModel, currentAction: any) {
    this.mantenimiento = mantenimiento;
    this.data.mantenimiento = this.mantenimiento;
    this.mapService.disconectGrid();
    this.currentAction = currentAction;
  }

  listarVolantes(mantenimiento: WorkflowMantenimientoModel, currentAction: any) {
    this.mantenimiento = mantenimiento;
    this.data.mantenimiento = this.mantenimiento;
    this.mapService.disconectGrid();
    this.currentAction = currentAction;
  }

  listarAfiches(mantenimiento: WorkflowMantenimientoModel, currentAction: any) {
    this.mantenimiento = mantenimiento;
    this.data.mantenimiento = this.mantenimiento;
    this.mapService.disconectGrid();
    this.currentAction = currentAction;
  }

  public vincular(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.getVisor().visible = false;
    this.data.mantenimiento = mantenimiento;
    this.limpiarRadicado();
    this.currentAction = this.constants.vincularRadicado;
  }

  public desvincular(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.getVisor().visible = false;
    this.data.mantenimiento = mantenimiento;
    this.dataSourceRadicadosVinculados = new MatTableDataSource(mantenimiento.radicadoVinculado);
    this.lengthList = this.dataSourceRadicadosVinculados.filteredData.length;
    this.dataSourceRadicadosVinculados.sort = this.sort;
    this.dataSourceRadicadosVinculados.paginator = this.paginator;
    if (this.dataSourceRadicadosVinculados.filteredData.length <= 0) {
      this.noInfoToShow = true;
    } else {
      this.noInfoToShow = false;
    }

    this.currentAction = this.constants.eliminarRadicado;

    /*
    this.limpiarRadicado();
    this.saveMantenimientoGridOnGrid();

    setTimeout(() => {
      super.seleccionarGrid(0);
    }, 2000);
    */
  }

  buscarRadicado() {
    this.processingSelectPk = true;
    this.limpiarRadicado();
    this.commonService.getRadicadoOrfeo(this.entradaConsultaRadicadoEntrada).subscribe((item: any) => {
      this.data.mantenimiento.solicitudRadicadoEntrada = item.numeroRadicado;
      this.data.mantenimiento.solicitudFecha = item.fechaRadicado;
      this.data.mantenimiento.solicitudVencimiento = item.fechaVencimiento;
      this.data.mantenimiento.solicitudRemitente = item.nombre + ' ' + item.primerApellido+ ' ' + item.segundoApellido;
      this.data.mantenimiento.solicitudAsunto = item.asunto;
      this.data.mantenimiento.solicitudDependenciaAsignada = '';
      this.data.mantenimiento.solicitudFechaVinculacion = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
      this.data.mantenimiento.estadoRadicado = '';
      this.entradaConsultaRadicadoEntrada = null;
      this.processingSelectPk = false;
    }, error => {
      this.processingSelectPk = false;
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }


  asignarRadicado() {

    let isNew = true;
    for (let radicado of this.data.mantenimiento.radicadoVinculado) {
      if (radicado.numeroRadicado == this.data.mantenimiento.solicitudRadicadoEntrada) {
        this.snackBar.open('¡El radicado ya se encuentra asignado a este mantenimiento!', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        isNew = false;
        break;
      }
    }


    if (isNew) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'custom-modalbox';
      dialogConfig.width = '30%';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

      dialogRef.beforeClosed().subscribe(
        val => {
          if (val === 1) {
            this.data.transicion = null;
            this.radicadoVinculado = new RadicadoVinculadoModel();
            this.radicadoVinculado.numeroRadicado = this.data.mantenimiento.solicitudRadicadoEntrada;
            this.radicadoVinculado.fechaRadicadoOrfeo = this.data.mantenimiento.solicitudFecha;
            this.radicadoVinculado.mantenimiento = this.data.mantenimiento;
            this.radicadoVinculado.tipoRadicado = this.tipoRadicado;
            this.radicadoService.create(this.radicadoVinculado).subscribe(
              data => {
                this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                  duration: 5000,
                  panelClass: ['success-snackbar']
                });
                this.onBack();
              },
              error => {
                this.utilitiesServices.formErrorMessages(error, this.formularioConsultaRadicadoEntrada, this.snackBar);
              }
            );
            //          this.applySingleTransitionTo();
            //          this.mapService.getGrid().clear();
            //          this.mapService.getVisor().visible = true;
          }
        }
      );
    }

  }

  deleteElement(element: any, _radicadoVinculado) {


    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {

          this.data.transicion = null;
          this.radicadoVinculado = new RadicadoVinculadoModel();
          if (this.data.mantenimiento.radicadoVinculado.length <= 1) {
            this.data.mantenimiento.radicadoVinculado = [];
          } else {
            this.data.mantenimiento.radicadoVinculado.splice(element, 1);
          }

          this.radicadoService.delete(_radicadoVinculado.id).subscribe(
            data => {
              this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                duration: 5000,
                panelClass: ['success-snackbar']
              });
              this.processing = false;
              this.goHome();
            },
            error => {
              this.processing = false;
              this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
            });
        }
      }
    );

  }


  back(event) {
    this.currentAction = event.currentAction;
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    this.currentAction = 'crearVolantes';
  }

  onBack() {
    this.currentAction = 'list';
    this.mapService.getVisor().visible = true;
    this.limpiarRadicado();

  }

  limpiarRadicado() {
    this.data.mantenimiento.solicitudRadicadoEntrada = null;
    this.data.mantenimiento.solicitudFecha = null;
    this.data.mantenimiento.solicitudVencimiento = null;
    this.data.mantenimiento.solicitudRemitente = null;
    this.data.mantenimiento.solicitudAsunto = null;
    this.data.mantenimiento.solicitudDependenciaAsignada = null;
    this.data.mantenimiento.solicitudFechaVinculacion = null;
    this.data.mantenimiento.estadoRadicado = null;
  }

}
