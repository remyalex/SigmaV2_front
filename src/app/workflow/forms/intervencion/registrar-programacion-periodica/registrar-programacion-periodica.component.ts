import { ListaItem } from './../../../../administracion/listas-items/models/listas-items.model';
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
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MapService } from 'src/app/shared/services/map.service';
import { CONST_REGISTRAR_PROG_PERIODICA } from './registrar-programacion-periodica.constant';
import { ProgramacionperiodicaModel } from 'src/app/workflow/models/programacion.periodica.model';
import { Formato } from 'src/app/administracion/formato/models/formato.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { CountMinElementsValidator } from 'src/app/shared/form/count.elements';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { ProgramacionPeriodicaService } from '../services/programacionPeriodica.service';

@Component({
  selector: 'app-registrar-programacion-periodica',
  templateUrl: './registrar-programacion-periodica.component.html'
})

// tslint:disable-next-line: class-name
export class RegistrarProgramacionPeriodicaComponent extends BaseComponent implements OnInit, OnDestroy, FormComponent {

  public constants = CONST_REGISTRAR_PROG_PERIODICA;
  public programacionPeriodica: ProgramacionperiodicaModel = new ProgramacionperiodicaModel();
  public programacionPeriodicaSave: ProgramacionperiodicaModel = new ProgramacionperiodicaModel();
  public formato: Formato = new Formato();
  public requerido = true;
  public disabledBtn_Login = false;
  public urlPeriodo = '';
  public showPeriodo = true;
  public numeroDias = [];
  public infoMantenimientos: any = {};
  public mes: number;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk', 'civ', 'localidad', 'upla', 'actividadAgrupada', 'estrategia', 'directorDeObra', 'kmCarrilImpacto', 'kmCarrilLineal',
    'kmCarrilObra', 'vigencia', 'periodicidad', 'periodo', 'duracionPlaneada', 'responsable'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'zona', 'localidad', 'upla', 'barrio', 'directorDeObra', 'actividadAgrupada', 'estrategia',
  ];

  filtersformulario = [
    'pk'
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'asignar', label: 'Asignar', icono: 'assignment', color: 'primary' },
  ];

  accionesAsignarProgramacionPeriodica: GridAccion[] = [
    { nombre: 'asignarProgramacionPeriodica', label: 'Asignar Programación Periodica PK', icono: 'assignment', color: 'primary' }
  ];

  accionesMasivas: GridAccion[] = [
    { nombre: 'AdjuntarArchivo', label: 'Adjuntar Archivo', icono: 'cloud_uploadng ', color: 'primary' }
  ];

  // Formularios
  formularioAsignar: FormGroup;

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
    private programacionService: ProgramacionPeriodicaService
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    // Definición de formularios
    this.formularioAsignar = this.formBuilder.group({
      vigencia: [null, Validators.compose([Validators.required])],
      periodicidad: [null, Validators.compose([Validators.required])],
      periodo: [null, Validators.compose([Validators.required])],
      diaslaborados: [null, Validators.compose([Validators.required])],
      archivo: [null, Validators.compose([Validators.required])],
      mantenimientos: [null, Validators.compose([Validators.required, CountMinElementsValidator(1)])]
    });

    this.forms.push(this.formularioAsignar);
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
    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event: any) {
    this.mapService.getVisor().visible = false;
    switch (event.accion) {
      case 'asignarProgramacionPeriodica':
        this.infoMantenimientos.grid = event.grid;
        this.asignarProgramacionPeriodica(event);
        break;
    }
  }

  public asignarProgramacionPeriodica(event: any) {
    this.infoMantenimientos.mantenimientos = event.mantenimientos;
    this.programacionPeriodica.mantenimientos = event.mantenimientos;
    this.currentAction = 'asignarProgramacionPeriodica';
  }

  executeMasiveTransition(event: any): void {
    let mantenimientosConProgramacion = true;
    event.mantenimientos.forEach(mantenimiento => {
      if (mantenimiento.vigencia == null) {
        mantenimientosConProgramacion = false;
      }
    });
    if (mantenimientosConProgramacion) {
      event.mantenimientos.forEach(mantenimiento => {

        if (mantenimiento.estadoPmt == null) {
          mantenimiento.estadoPmt = new ListaItem();
        }
        if (mantenimiento.estadoProcesoIntervencion == null) {
          mantenimiento.estadoProcesoIntervencion = new ListaItem();
        }
        if (mantenimiento.estadoProgramacionPk == null) {
          mantenimiento.estadoProgramacionPk = new ListaItem();
        }

        mantenimiento.estadoPmt.id = 8108;
        mantenimiento.estadoProcesoIntervencion.id = 323563;
        mantenimiento.fechaSolicitudProgramacion = this.utilitiesServices.getFechaServerFormat(new Date);
      });

      super.applyMasiveTransitionTo(event.mantenimientos, event.grid);

    } else {
      this.snackBar.open('No se ha registrado una programación periodica para todos los Pks', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  setDataFormato(atributo: any, objeto: any) {
    this.disabledBtn_Login = false;
    this.formato[atributo] = objeto;
  }

  validateUploadFile(boolean) {
    this.requerido = boolean;
  }

  public esValido(form: FormGroup): boolean {
    // tslint:disable-next-line: forin
    for (const inner in form.controls) {
      if (inner !== 'id') {
        form.get(inner).markAsTouched();
        form.get(inner).updateValueAndValidity();
        if (!form.get(inner).valid) {
          form.get(inner).updateValueAndValidity();
          form.get(inner).setErrors(null);
          return false;
        }
      }
    }
    return true;
  }

  saveAsignacion(form: FormGroup) {
    this.programacionPeriodica.mantenimientos = this.infoMantenimientos.mantenimientos;
    let esValido: boolean;

    setTimeout(() => {
      if (form == null) {
        esValido = false;
      } else {
        esValido = this.validate(form);
      }

      if (esValido) {
        this.infoMantenimientos.mantenimientos.map((item: WorkflowMantenimientoModel) => {
          item.periodicidad = this.programacionPeriodica.periodicidad;
          item.periodo = this.programacionPeriodica.periodo;
          item.vigencia = this.programacionPeriodica.vigencia;
          item.numeroDiasLaborales = this.programacionPeriodica.nroDiasLaborables;
          item.archivo = this.programacionPeriodica.archivo;
        });
        this.applyUpdateMasiveTransitionTo(this.infoMantenimientos.mantenimientos, this.infoMantenimientos.grid);
        this.programacionPeriodicaSave = this.programacionPeriodica;
        this.calcularFechaInicial();
        for (let mantenimiento of this.infoMantenimientos.mantenimientos) {
          this.programacionPeriodicaSave.mantenimiento = mantenimiento;
          this.programacionPeriodicaSave.intervencionEncabezado = mantenimiento.intervenciones[0];
          this.programacionPeriodicaSave.kmCarrilImpacto = mantenimiento.kmCarrilImpacto;
          this.programacionPeriodicaSave.kmCarrilLineal = mantenimiento.kmCarrilLineal;
          this.programacionPeriodicaSave.kmCarrilObra = mantenimiento.kmCarrilObra;
          this.programacionPeriodicaSave.duracionPlaneada = mantenimiento.duracionPlaneada;

          this.programacionService.create(this.programacionPeriodica).subscribe((data: any) => {
            this.utilitiesServices.scrollToTop();
            this.processing = false;
          }, error => {
            this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
            this.processing = false;
          });

        }
      }
    }, 200);

  }

  public calcularFechaInicial() {
    switch (this.programacionPeriodica.periodo.nombre) {
      case this.constants.periodos.enero:
      case this.constants.periodos.enero_febrero:
      case this.constants.periodos.enero_marzo:
      case this.constants.periodos.enero_junio:
        this.mes = 1;
        break;
      case this.constants.periodos.febrero:
        this.mes = 2;
        break;
      case this.constants.periodos.marzo:
      case this.constants.periodos.marzo_abril:
        this.mes = 3;
        break;
      case this.constants.periodos.abril:
      case this.constants.periodos.abril_junio:
        this.mes = 4;
        break;
      case this.constants.periodos.mayo:
      case this.constants.periodos.mayo_junio:
        this.mes = 5;
        break;
      case this.constants.periodos.junio:
        this.mes = 6;
        break;
      case this.constants.periodos.julio:
      case this.constants.periodos.julio_agosto:
      case this.constants.periodos.julio_septiembre:
      case this.constants.periodos.julio_diciembre:
        this.mes = 7;
        break;
      case this.constants.periodos.agosto:
        this.mes = 8;
        break;
      case this.constants.periodos.septiembre:
      case this.constants.periodos.septiembre_octubre:
        this.mes = 9;
        break;
      case this.constants.periodos.octubre:
      case this.constants.periodos.octubre_diciembre:
        this.mes = 10;
        break;
      case this.constants.periodos.noviembre:
      case this.constants.periodos.noviembre_diciembre:
        this.mes = 11;
        break;
      case this.constants.periodos.diciembre:
        this.mes = 12;
        break;

      default:
        this.mes = 1;
        break;
    }
    this.programacionPeriodica.fechaInicialIntervencion = 
      this.utilitiesServices.convertDateToString(new Date(
        Number(this.programacionPeriodica.vigencia.valor),this.mes-1,1), 'DD-MM-YYYY')
        ;
  }

  public applyMasiveTransitionTo(mantenimientos: WorkflowMantenimientoModel[], grid: GridMantenimientosComponent) {

    this.processing = true;
    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
    for (const mantenimiento of mantenimientos) {
      const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
      mantenimientoActividad.mantenimiento = mantenimiento;
      mantenimientoActividad.actividad = this.data.actividad;
      mantenimientoActividad.observaciones = this.data.observaciones;
      mantenimientoActividad.transicion = this.data.transicion;
      mantenimientoActividad.usuarioAsignado = this.data.usuarioAsignado;
      mantenimientosActividad.push(mantenimientoActividad);
    }
    this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
      this.utilitiesServices.scrollToTop();
      this.processing = false;
      if (grid) {
        grid.clear();
      }
      this.currentAction = 'list';
      this.cancelarFormAsignar();
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      this.processing = false;
    });
  }


  public applyUpdateMasiveTransitionTo(mantenimientos: WorkflowMantenimientoModel[], grid: GridMantenimientosComponent) {

    this.processing = true;
    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
    for (const mantenimiento of mantenimientos) {
      const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
      mantenimientoActividad.mantenimiento = mantenimiento;
      mantenimientoActividad.actividad = this.data.actividad;
      mantenimientoActividad.observaciones = this.data.observaciones;
      mantenimientoActividad.transicion = null;
      mantenimientoActividad.usuarioAsignado = this.data.usuarioAsignado;
      mantenimientosActividad.push(mantenimientoActividad);
    }
    this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
      this.utilitiesServices.scrollToTop();
      this.processing = false;
      if (grid) {
        grid.clear();
      }
      this.currentAction = 'list';
      this.cancelarFormAsignar();
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      this.processing = false;
    });
  }


  changePeriodicidad() {
    if (this.programacionPeriodica.periodicidad) {
      this.showPeriodo = false;
      this.programacionPeriodica.periodo = null;
      const nombrePeriodicidad = this.programacionPeriodica.periodicidad.nombre;
      this.urlPeriodo = `/api/mejoramiento/periodicidad/${nombrePeriodicidad}/items`;

      setTimeout(() => {
        this.showPeriodo = true;
      }, 100);
    }
  }

  changePeriodo() {
    this.numeroDias = [];
    if (this.programacionPeriodica.periodo) {
      switch (this.programacionPeriodica.periodo.nombre) {
        case this.constants.meses.febrero:
          if (+this.programacionPeriodica.vigencia.valor % 4 == 0) {
            this.totalDias(29);
          } else {
            this.totalDias(28);
          }
          break;

        default:
          this.totalDias(30);
          break;
      }
    }

  }

  totalDias(dias = 30) {
    for (let i = 1; i <= dias; i++) {
      this.numeroDias.push({ nombre: i, dia: i });
    }
  }

  cancelarFormAsignar() {
    this.formularioAsignar.reset();
    this.formularioAsignar.get('archivo').setValue([]);
    this.cancel();
  }

  validarCargueDeArchivos() {
    console.log('Nuevo cargue');
    console.log(this.programacionPeriodica.archivo);
    if (this.programacionPeriodica.archivo && this.programacionPeriodica.archivo.id === undefined) {
      this.formularioAsignar.get('archivo').setErrors({ 'ivalid': true, 'required': true });
    }
  }
}
