import { filter } from 'rxjs/operators';
import { ResultadosSolicitudesAforosComponent } from './../shared/resultadosSolicitudesAforos/resultados-solicitudes-aforos.component';
import { ResultadosSolicitudesApiquesComponent } from './../shared/resultadosSolicitudesApiques/resultados-solicitudes-apiques.component';
import { Validators } from '@angular/forms';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { FormGroup } from '@angular/forms';
import { CONST_WORKFLOW_DIAGNOSTICO } from './../shared/diagnostico.constants';
import { Component, OnInit, AfterViewInit, Output, EventEmitter, OnDestroy, AfterViewChecked } from '@angular/core';
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
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MapService } from 'src/app/shared/services/map.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { SolicitudAforoModel } from 'src/app/workflow/models/solicitud-aforo.model';
import { SolicitudApiqueModel } from 'src/app/workflow/models/solicitud-apique.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { MantenimientoDocumentoModel } from 'src/app/workflow/models/mantenimientoDocumento.model';
import { DefaultSortGrid } from '../../../../shared/models/defaultSortGrid';
import { VisitaPredisenoApiqueModel } from '../../../models/visita.prediseno.apique.model';
import { VisitaPredisenoAforoModel } from 'src/app/workflow/models/visita.prediseno.aforo.model';

/** Componente encargado de gestionar el proceso de solicitud de apiques y aforos*/
@Component({
  selector: 'app-solicitar-apique-aforo',
  templateUrl: './solicitar-apique-aforo.component.html'
})
export class SolicitarApiqueAforoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {
  /** Condicion usada para solicitudes a apiques */
  condicionSolicitarApiques: WorkflowCondicionModel;
  /** Condicion usada para solicitudes a aforos */
  condicionSolicitarAforos: WorkflowCondicionModel;
  /**
  * Mantenimiento para el cual se realizará el procesamiento
  * de la información */
  mantenimiento: WorkflowMantenimientoModel;
  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Listado de mantenimiento seleccionados por el usuario en la grilla*/
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];
  /** Grilla de pks presentada al usuario */
  grid: GridMantenimientosComponent;
  /** Campo prioridad de solicitud de apiques */
  prioridad: string;
  solicitud: any;
  /** Objeto con los valores de solicitud de aforo a procesar */
  solicitudAforo: SolicitudAforoModel;
  /** Objeto con los valores de solicitud de apiques a procesar */
  solicitudApique: SolicitudApiqueModel;
  /** Variable de formulario para asignación de prioridad de la solicitud
   * de apique actual.
   */
  formularioAsignarPrioridad: FormGroup;
  formularioAsignarPrioridadAforo: FormGroup;
  apiqueArray: VisitaPredisenoApiqueModel;
  aforoArray: VisitaPredisenoAforoModel;

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'estadoPk',
    'localidad',
    'zona',
    'barrio',
    'upla',
    'responsable',
    'tipoActividad',
    'origen',
    'cantidadApiques',
    'requiereAforo',
    'prioritarios'
  ];

  columnsTrasiciones = [
    'pk',
    'estadoPk',
    'localidad',
    'zona',
    'barrio',
    'upla',
    'responsable',
    'tipoActividad',
    'origen',
    'cantidadApiques',
    'requiereAforo',
    'prioritarios'
  ];

  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = ['pk', 'localidad', 'zona', 'barrio', 'upla'];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    {
      nombre: 'priorizar',
      label: 'Priorizar',
      icono: 'format_list_numbered',
      color: 'primary'
    }
  ];

  accionesAforo: GridAccion[] = [
    {
      nombre: 'priorizarAforo',
      label: 'Priorizar',
      icono: 'format_list_numbered',
      color: 'primary'
    }
  ];

  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente
   * relacionadas con los apiques y aforos */
  accionesEnviarADisenio: GridAccion[] = [
    {
      nombre: 'mostrarResultadosApiques',
      label: 'Resultados de apique',
      icono: 'move_to_inbox',
      color: 'primary'
    },
    {
      nombre: 'mostrarResultadosAforos',
      label: 'Resultados de aforo',
      icono: 'save_alt',
      color: 'primary'
    }
  ];

  /** Variable usada para enviar a la grilla el listado
   * de acciones de aforos a ejecutar para el mantenimiento en este componente */
  accionesSolicitarAforos: GridAccion[] = [
    { nombre: 'solicitarAforos', label: 'Solicitar aforos', icono: 'call_made', color: 'primary' },
  ];

  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán de forma predeterminada en este componente */
  defaultFilters: KeyValuePair[] = [];
  defaultSortGrid: DefaultSortGrid;

  private commingFormTab = 0;

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
    private dialog: MatDialog,
    mapService: MapService
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService, utilitiesServices,
      snackBar, tokenStorageService, mapService);
    this.resultadosDatasource = new MatTableDataSource<MantenimientoDocumentoModel>();

    this.formularioAsignarPrioridad = this.formBuilder.group({
      prioridad: [null, Validators.compose([Validators.required, Validators.max(9999999999)])],
      solicitud: [null, Validators.compose([Validators.required])]
    });

    this.formularioAsignarPrioridadAforo = this.formBuilder.group({
      solicitud: [null, Validators.compose([Validators.required])]
    });

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    this.defaultSortGrid = { 'sortBy': 'prioritarios', 'sortOrder': 'asc' };

    this.mantenimientosSeleccionados = [];
    this.solicitudAforo = new SolicitudAforoModel();
    this.solicitudApique = new SolicitudApiqueModel();

    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }

    this.commonService.getCondicionByNombre('PK_PARA_SOLICITAR_APIQUE').subscribe(_condicion => {
      this.condicionSolicitarApiques = _condicion;
    });

    this.commonService.getCondicionByNombre('PK_PARA_SOLICITAR_AFOROS').subscribe(_condicion => {
      this.condicionSolicitarAforos = _condicion;
    });

    if (this.mantenimiento === undefined) {
      this.mantenimiento = null;
    }

    if (this.mantenimiento != null && this.mantenimiento.predisenio && this.mantenimiento.predisenio.apiques.length > 0) {
      this.prioridad = this.mantenimiento.predisenio.apiques[0].prioritarios + '';
    }
  }


  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event) {
    switch (event.accion) {
      case 'priorizar':
        this.asigPrioridad(event);
        break;
      case 'priorizarAforo':
        this.asigPrioridadAforo(event);
        break;
      case 'solicitarAforos':
        this.solicitarAforos(event);
        break;
      case 'mostrarResultadosApiques':
        this.mostrarResultadosApiques(event);
        break;
      case 'mostrarResultadosAforos':
        this.mostrarResultadosAforos(event);
        break;
    }
  }

  /**
   * Método encargado de consultar y mostrar los resultados de apiques
   * relacionados con el mantenimiento indicado
   *
   * @param event Evento del usuario con el valor del mantenimiento
   * seleccionado
   */
  public mostrarResultadosApiques(event: any) {
    this.commingFormTab = 2;
    this.limpiarVariablesDeFormulario();
    this.mantenimiento = event.mantenimiento;
    this.consultarResultadosApiques(event.mantenimiento);
  }

  /**
   * Método encargado de consultar y mostrar los resultados de aforos
   * relacionados con el mantenimiento indicado
   *
   * @param event Evento del usuario con el valor del mantenimiento
   * seleccionado
   */
  public mostrarResultadosAforos(event: any) {
    this.commingFormTab = 2;
    this.limpiarVariablesDeFormulario();
    this.mantenimiento = event.mantenimiento;
    this.consultarResultadosAforos(event.mantenimiento);
  }

  /**
   * Método encargado de solicitar los aforos
   * relacionados con el mantenimiento indicado
   *
   * @param event Evento del usuario con el valor del mantenimiento
   * seleccionado
   */
  public solicitarAforos(event: any) {
    this.limpiarVariablesDeFormulario();
    this.mantenimientosSeleccionados = event.mantenimientos;
    for (const mantAux of this.mantenimientosSeleccionados) {
      if (mantAux.predisenio.aforos.length === 0) {
        this.snackBar.open('Favor asigne la solicitud del PK: ' + mantAux.pk, 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        return 0;
      }
    }
    this.grid = event.grid;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mensaje: '¿Confirma la solicitud de Aforos para los pk seleccionados?',
      titulo: 'Solicitar Aforos'
    };

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.saveSolicitudAforos();
        }
      }
    );

  }

  /** Método encargado de devolver a la pagina principal el componente */
  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.limpiarVariablesDeFormulario();
          this.currentAction = 'list';
        }
      }
    );
  }

  /** Método encargado de validar si el valor
   * ingresado por el usuario es un número
   *
   * @param e Evento con el valor ingresado por el usuario
   * @param valor valor del numero que se desea validar como entero
   **/
  validateNumber(e: any, valor: any) {

    let input = String.fromCharCode(e.charCode);
    const reg = /^[0-9]+(.)?([0-9]+)?$/;

    if (input !== '.') {
      if (!reg.test(input)) {
        e.preventDefault();
        return;
      }
    }

    try {
      input = valor + input;
      if (input.split('.').length > 2) {
        e.preventDefault();
        return;
      }
      parseFloat(input);
    } catch (error) {
      e.preventDefault();
      return;
    }
  }

  /**
   * Método encargado de asignar la prioridad al mantenimiento indicado
   *
   * @param event Evento del usuario con el valor del mantenimiento
   * seleccionado
   */
  public asigPrioridad(event: any) {
    this.commingFormTab = 0;
    this.limpiarVariablesDeFormulario();
    this.mantenimiento = event.mantenimiento;
    this.mantenimientosSeleccionados.push(event.mantenimiento);

    if (event.mantenimiento.predisenio.apiques.length > 0) {
      this.prioridad =
        event.mantenimiento.predisenio.apiques[0].prioritarios ? event.mantenimiento.predisenio.apiques[0].prioritarios + '' : '';
    }
    this.grid = event.grid;
    this.formularioAsignarPrioridad.get('prioridad').markAsUntouched();
    this.currentAction = 'asignarPrioridad';
  }

  public asigPrioridadAforo(event: any) {
    this.commingFormTab = 1;
    this.limpiarVariablesDeFormulario();
    this.mantenimiento = event.mantenimiento;
    this.mantenimientosSeleccionados.push(event.mantenimiento);

    if (event.mantenimiento.predisenio.aforos.length > 0) {
      this.solicitud =
        event.mantenimiento.predisenio.aforos[0].solicitud ? event.mantenimiento.predisenio.aforos[0].solicitud : undefined;
    }
    this.grid = event.grid;
    this.currentAction = 'asignarSolicitudAforo';
  }

  /**
   * Método encargado de gestionar el hecho de almacenar la prioridad de los apiques
   */
  savePrioridad(): void {
    if (this.validate(this.formularioAsignarPrioridad)) {
      this.data.transicion = null;
      const usuario: Usuario = this.tokenStorageService.getStorage('payload1');
      this.solicitudApique.usuario = new UsuarioInfo();
      this.solicitudApique.usuario.id = usuario.id;
      this.solicitudApique.fechaRegistro = new Date();
      this.mantenimientosSeleccionados.forEach(mantenimiento => {
        if (mantenimiento.id === this.mantenimiento.id) {
          if (mantenimiento.predisenio.apiques.length > 0) {
            mantenimiento.predisenio.apiques[0].prioritarios = parseFloat(this.prioridad);
            mantenimiento.predisenio.apiques[0].solicitud = this.solicitud;
          } else {
            this.apiqueArray = new VisitaPredisenoApiqueModel();
            this.apiqueArray.prioritarios = parseFloat(this.prioridad);
            this.apiqueArray.solicitud = this.solicitud;
            mantenimiento.predisenio.apiques.push(this.apiqueArray);
          }
          mantenimiento.predisenio.solicitudApique = this.solicitudApique;
        }
      });
      this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, this.grid);
    } else {
      this.processing = false;
    }
  }

  savePrioridadAforo(): void {
    if (this.validate(this.formularioAsignarPrioridadAforo)) {
      this.data.transicion = null;
      this.mantenimientosSeleccionados.forEach(mantenimiento => {
        if (mantenimiento.id === this.mantenimiento.id) {
          if (mantenimiento.predisenio.aforos.length > 0) {
            mantenimiento.predisenio.aforos[0].solicitud = this.solicitud;
          } else {
            this.aforoArray = new VisitaPredisenoAforoModel();
            this.aforoArray.solicitud = this.solicitud;
            mantenimiento.predisenio.aforos.push(this.aforoArray);
          }
        }
      });

      this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, this.grid, 1);
      //this.currentAction = 'list';

      // setTimeout(() => {
      //   super.cancel(1);
      // }, 500);

    } else {
      this.processing = false;
    }
  }

  /** Método encargado de gestionar el almacenamiento de la solicitud de aforos */
  saveSolicitudAforos(): void {
    this.data.transicion = null;
    const usuario: Usuario = this.tokenStorageService.getStorage('payload1');
    this.solicitudAforo.usuario = new UsuarioInfo();
    this.solicitudAforo.usuario.id = usuario.id;
    this.solicitudAforo.fechaRegistro = new Date();
    this.mantenimientosSeleccionados.forEach(mantenimiento => {
      mantenimiento.predisenio.solicitudAforo = this.solicitudAforo;
    });
    this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, this.grid);
  }

  /** Método encargado de limpiar las variables del formualrio de consulta */
  private limpiarVariablesDeFormulario() {
    this.prioridad = null;
  }

  /**
   * Método encargado de realizar la selección de la grilla según
   * el tag en el que se encuentre el usuario
   *
   * @param tab Tab seleccionado por el usuario
   */
  public aseleccionarGrid(tab: number) {
    this.data.transicion = null;
    this.seleccionarGrid(tab);
  }

  /**
   * Método encargado de eecutar la transicion de forma masiva para varios
   * pks seleccionados por el usuario.
   *
   * @param event Evento con datos de mantenimientos seleccionados por el usuario
   */
  executeMasiveTransition(event: any): void {
    let cantMantenimientosRequierenApiques = 0;
    let cantMantenimientosRequierenAforos = 0;
    let cantMantenimientosConApiques = 0;
    let cantMantenimientosConAforos = 0;
    event.mantenimientos.forEach(mantenimiento => {
      if (mantenimiento.predisenio) {
        if (mantenimiento.predisenio.requiereApique === '1') {
          cantMantenimientosRequierenApiques++;
        }
        if (mantenimiento.resultadosSolicitudesApiques.length > 0) {
          cantMantenimientosConApiques++;
        }
        if (mantenimiento.predisenio.requiereAforo === '1') {
          cantMantenimientosRequierenAforos++;
        }
        if (mantenimiento.resultadosSolicitudesAforos.length > 0) {
          cantMantenimientosConAforos++;
        }
      } else {
        mantenimiento.fechaSolicitudProgramacion = this.utilitiesServices.getFechaServerFormat(new Date);
      }
    });
    if (cantMantenimientosConApiques === cantMantenimientosRequierenApiques
      && cantMantenimientosConAforos === cantMantenimientosRequierenAforos) {
      super.applyMasiveTransitionTo(event.mantenimientos, event.grid);
    } else {
      this.snackBar.open('No se ha realizado la carga de los resultados de todos los Pks seleccionados', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /** Método encargado de consultar los resultados de los
   * apiques del mantenimiento indicado
   *
   * @param event Evento con datos de mantenimientos seleccionados por el usuario
   **/
  public consultarResultadosApiques(mantenimiento: WorkflowMantenimientoModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '200';
    dialogConfig.data = {
      'mantenimiento': mantenimiento,
      'editable': false,
    };
    const dialogRef = this.dialog.open(ResultadosSolicitudesApiquesComponent, dialogConfig);
  }


  /** Método encargado de consultar los resultados de los
   * aforos del mantenimiento indicado
   *
   * @param event Evento con datos de mantenimientos seleccionados por el usuario
   **/
  public consultarResultadosAforos(mantenimiento: WorkflowMantenimientoModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '200';
    dialogConfig.data = {
      'mantenimiento': mantenimiento,
      'editable': false,
    };
    const dialogRef = this.dialog.open(ResultadosSolicitudesAforosComponent, dialogConfig);
  }


}
