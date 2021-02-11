import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { CONST_APROBAR_ACTAS } from 'src/app/gestion-social/aprobar-actas-vecindad/aprobar-actas.constant';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { Router } from '@angular/router';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { VisitaModel } from 'src/app/workflow/models/visita.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

@Component({
  selector: 'app-aprobar-actas-vecindad',
  templateUrl: './aprobar-actas-vecindad.component.html'
})
export class AprobarActasVecindadComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {
 /** Constantes a usar en el componente */
  constants = CONST_APROBAR_ACTAS;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  urlBack: string;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'fechaInicioVisita',
    'fechaFinVisita',
    'turnoResidenteSocial',
    'zona',
    'nombreResidenteSocial'
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
    'fechasIntervencion',
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'aprobar', label: 'Aprobar Actas de Vecindad', icono: 'check_circle_outline', color: 'primary' },
    { nombre: 'consultar', label: 'Consultar Actas de Vecindad', icono: 'visibility', color: 'primary' },
  ];

  defaulFilters: KeyValuePair[] = [];

  constructor(servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    mapService: MapService,
    private router: Router,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({key: 'actividadActualProcesoParaleloId', value: this.data.actividad.id.toString()});
    this.enviada = false;
    this.mapService.getVisor().visible = true;
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
    //super.ngAfterViewInit();
    if (this.accion) {
      switch (this.accion) {
        case 'work':
          this.work(this.data.mantenimiento);
          break;
        case 'route':
          this.mostrarRuta(this.data.mantenimiento);
      }
    }
  }

  work(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.disconectGrid();
    super.work(mantenimiento, true);
  }

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
  ejecutar( event) {
    this.data.mantenimiento = event.mantenimiento;
    switch (event.accion) {
      case 'aprobar':
        CONST_APROBAR_ACTAS.mPK = event.mantenimiento.pk;
        CONST_APROBAR_ACTAS.mObject = event.mantenimiento;
        this.currentAction = event.accion;
        break;
      case 'consultar':
        CONST_APROBAR_ACTAS.mPK = event.mantenimiento.pk;
        CONST_APROBAR_ACTAS.mObject = event.mantenimiento;
        this.currentAction = event.accion;
        break;
    }
  }

  elementToRow(element: WorkflowMantenimientoModel): any {
    const kmCarril: number = element.kmCarrilImpacto;
    return {
      pk: element.pk,
      civ: element.civ,
      fechaInicioVisita: element.fechaInicioVisita,
      fechaFinVisita: element.fechaFinVisita,
      zona: element.zona != null ? element.zona.nombre : '',
      responsable: element.responsable != null ? element.responsable.nombres + ' ' + element.responsable.apellidos : '',
    };
  }

  export() {
    const headers = [{
      pk: 'PK',
      civ: 'CIV',
      fechaInicioVisita: 'Fecha inicial de programación',
      fechaFinVisita: 'Fecha final de programación',
      zona: 'Zona',
      responsable: 'Responsable',
    }];

    const order = [
      'pk',
      'civ',
      'fechaInicioVisita',
      'fechaFinVisita',
      'zona',
      'responsable'
    ];

    this.exportToExcel(headers, order);
  }

  accionIrAtras() {
    this.currentAction = 'list';
    this.mapService.getGrid().loadBasicGrid();
  }

}
