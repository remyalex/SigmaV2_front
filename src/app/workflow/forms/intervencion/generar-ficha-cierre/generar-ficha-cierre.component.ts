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

@Component({
  selector: 'app-generar-ficha-cierre',
  templateUrl: './generar-ficha-cierre.component.html',
})
export class GenerarFichaCierreComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {
  private urlImagenMapa: string;
  private subscribeToUrlMap: any;
  // constants
 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  mantenimientoSalida: WorkflowMantenimientoModel;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'localidad',
    'upla',
    'cuadrante',
    'barrio',
    'tipoIntervencion',
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
    'tipoIntervencion',
    'estrategia',
    'actividadActual'
  ];

  actions: GridAccion[] = [
    { nombre: 'verFichaCierre', label: 'Generación ficha cierre', icono: 'note_add', color: 'primary' },
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
    private mantenimientoServices: MantenimientoService,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    // Definición de formularios
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
    this.commonService.getCondicionByNombre('PK_GENERAR_FICHA_CIERRE_INTERVENCION').subscribe(_condicion => {
      this.condicion = _condicion;
    });

    if (this.subscribeToUrlMap) {
      this.subscribeToUrlMap.unsubscribe();
    }

    this.subscribeToUrlMap = this.mapService.getVisor().imageUrlParameters$.subscribe(url => {
      this.urlImagenMapa = url;
      if (typeof this !== 'undefined' && typeof this.data !== 'undefined') {
        this.data.mantenimiento.posicionesBox = this.mapService.extraerPosicionesBoxImagenMapa(this.data.mantenimiento.posicionesBox , url);
      }
    });
  }

  ngAfterViewInit() {
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
      case 'verFichaCierre':
        this.mantenimiento = event.mantenimiento;
        this.currentAction = 'verFichaCierre';
        this.mapService.getVisor().visible = false;
        this.mapService.getVisor().updateImageUrlParameters(this.mantenimiento.pk);
        //this.mapService.getVisor().updateImageUrlParameters(this.mantenimiento.id);
        break;
      case 'route':
        this.mostrarRuta(event.mantenimiento);
    }
  }

  work(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.disconectGrid();
    super.work(mantenimiento, true);
  }

  actualizarMantenimiento(event): void {
    this.mantenimiento = JSON.parse(event.mantenimiento);
  }


  executeTransition(): void {
    this.data.mantenimiento = this.mantenimiento;
    this.applySingleTransitionTo();
  }

  exportarFichaPDF(): void {
    this.mantenimientoServices.generarPDF(this.mantenimiento.id, this.urlImagenMapa, 'reporteCierreIntervencion');
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    super.cancel();
  }
}
