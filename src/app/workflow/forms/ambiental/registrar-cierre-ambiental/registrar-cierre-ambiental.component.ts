import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
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
import { CONST_GESTION_AMBIENTAL } from '../gestion-ambietal.constant';
import { CierreAmbientalModel } from 'src/app/gestion-ambiental/models/cierre.ambiental.model';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-registrar-cierre-ambiental',
  templateUrl: './registrar-cierre-ambiental.component.html'
})
export class RegistrarCierreAmbientalComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  public  constants = CONST_GESTION_AMBIENTAL;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'pk',
    'civ',
    'zona',
    'localidad',
    'nombreResidenteAmbiental'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'zona',
    'fechaIntervencionDesde',
    'fechaIntervencionHasta'
  ];

  public cierre = new CierreAmbientalModel();
  public showView: boolean = false;
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [];

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
    private profileService: ProfileService,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({key: 'actividadActualProcesoParaleloId', value: this.data.actividad.id.toString()});
    this.profileService.isGranted(this.constants.permiso_gestion_ambiental_registrar_cierre).subscribe(data => {
      if (data.state) {
        this.acciones.push({ nombre: this.constants.currentAction.registrarCierreAmbiental, label: this.constants.registrarCierreAmbiental, icono: 'note_add', color: 'primary' });
      }
    this.profileService.isGranted(this.constants.permiso_gestion_ambiental_consultar_cierre).subscribe(data => {
      if (data.state) {
        this.acciones.push({ nombre: this.constants.currentAction.consultarCierreAmbiental, label: this.constants.consultarCierreAmbiental, icono: 'visibility', color: 'primary' });
      }
    });
      this.showView = true;
    });

    this.loadData();

    this.mapService.getVisor().seleccionMasiva = false;
  }

  executeSingleAction(event) {
    switch (event.accion) {
      case this.constants.currentAction.registrarCierreAmbiental:
        this.currentAction = event.accion;
        this.utilitiesServices.scrollToTop();
        this.mantenimiento = event.mantenimiento;
        this.mapService.getVisor().visible = false;
        break;
      case this.constants.currentAction.consultarCierreAmbiental:
        if (event.mantenimiento) {
          if (event.mantenimiento.cierresAmbientales != null) {
            if (event.mantenimiento.cierresAmbientales.length > 0) {
              this.currentAction = event.accion;
              this.utilitiesServices.scrollToTop();
              this.mantenimiento = event.mantenimiento;
              this.mapService.getVisor().visible = false;
            } else {
              this.noCierres();
            }
          } else {
            this.noCierres();
          }
        }

        break;
      default:
        break;
    }
  }

  noCierres() {
    this.snackBar.open(this.constants.noCierres, 'X', {
      duration: 5000,
      panelClass: ['warning-snackbar']
    });
  }

  closeRegistro(event) {
    if (event.close) {
      this.utilitiesServices.scrollToTop();
      this.currentAction = this.constants.currentAction.list;

      setTimeout(() => {
        this.mapService.getVisor().visible = true;  
      }, 10);
    }
  }

}
