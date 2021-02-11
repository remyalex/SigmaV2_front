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
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
// tslint:disable-next-line: max-line-length
import { CargaDeArchivoComponent } from 'src/app/produccion/registro-control-calidad-a-mezcla-producida-en-planta/carga-de-archivo/carga-de-archivo.component';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';

@Component({
  selector: 'app-editar-controles-calidad-realizados-mezcla-producida-planta',
  templateUrl: './editar-controles-calidad-realizados-mezcla-producida-planta.component.html'
})
export class EditarControlesCalidadRealizadosMezclaProducidaPlantaComponent
  extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {


    columns = [
      'pk',
      'localidad',
      'zona',
      'barrio',
      'upla',
      'desde',
      'hasta',
      'jornada',
      'tipoMezcla',
      'responsableObra',
      'telResponsableObra'
    ];

    filters = [
      'fechasIntervencion',
      'frecuencia',
      'tipoMezcla',
      'jornada',
      'pk',
      'localidad',
      'zona',
      'barrio',
      'upla',
      'fechaDespacho'
    ];

    singleAccions: GridAccion[] = [
      { nombre: 'cargarArchivo', label: 'Cargar Archivo', icono: 'cloud_upload', color: 'primary' }
    ];

    grid: GridMantenimientosComponent;

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
    private dialog: MatDialog
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    //this.initDataSource();
    //this.service.listenerAction(this.data);
    // if (typeof this.data.actividad !== 'undefined' &&
    //   typeof this.data.actividad.transiciones !== 'undefined') {
    //   this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
    //   this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
    //   this.columns = this.columns.filter(item => item !== 'select');
    //   if (this.transicionesMasivas.length > 0) {
    //     this.columns.unshift('select');
    //   }
    // }
    //this.data = new WorkflowMantenimientoActividadModel();
    this.commonService.getCondicionByNombre('PKS_CONTROL_CALIDAD_MEZCLA_PRODUCIDA').subscribe(_condicion => {
      this.condicion = _condicion;
    });
    
  }

  executeOnSingle(event: any) {
    switch (event.accion) {
      case 'cargarArchivo' :
        this.grid = event.grid,
        this.cargarArchivoDeControlCalidad(event);
    }
  }

  cargarArchivoDeControlCalidad(event: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = event.mantenimiento;
    const dialogRef = this.dialog.open(CargaDeArchivoComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe( val => {
        if (val !== 0) {
          this.data.mantenimiento = val;
          this.applySingleTransitionTo(this.grid, true);
        }
      }
    );
  }

}
