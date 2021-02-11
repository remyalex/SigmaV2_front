import { Component, OnInit, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatPaginator, MatSort, MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { MapService } from 'src/app/shared/services/map.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { CONST_PRODUCCION_MEZCLA } from '../produccion-mezcla.constants';
import { SolicitudMezclaCriteria } from '../models/solicitud-mezcla.criteria';
import { SolicitudMezclaDataSource } from '../services/solicitud-mezcla.datasource';
import { SolicitudMezcla } from '../models/solicitud-mezcla.model';
import { SolicitudMezclaService } from '../services/solicitud-mezcla.service';
import { WorkflowTransicionModel } from 'src/app/workflow/models/workflow-transicion.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ConfirmCapacidadComponent } from 'src/app/produccion/produccion-mezcla/confirm-capacidad/confirm-capacidad.component';
import { SolicitudTipoMaterial } from '../models/solicitud-tipo-material.model';
import { Intervencion } from '../../../../../intervencion/models/intervencionModel.model';

@Component({
  selector: 'app-solicitudes-programacion-mezcla-list',
  templateUrl: './solicitudes-programacion-mezcla-list.component.html'
})
export class SolicitudesProgramacionMezclaListComponent extends BaseComponent implements OnInit, AfterViewChecked {

  constants = CONST_PRODUCCION_MEZCLA;
  solicitud: SolicitudMezcla;
  programacionValida: boolean;
  disabledSendTransicion: boolean;
  solicitudMateriles: SolicitudTipoMaterial;
  mantenimiento: WorkflowMantenimientoModel;
  equipo: any;
  tipoMaterial: any;
  tipoSolicitud: any;
  turno: any;
  unidad: any;
  solicitudReponse = false;

  public petition = null;

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
    private solicitudMezclaService: SolicitudMezclaService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SolicitudesProgramacionMezclaListComponent>,
  ) {
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  ngOnInit() {
    this.loadData();
    this.currentAction = this.constants.accionListaSolicitudes;
    this.mapService.getVisor().visible = true;
    this.mapService.getVisor().seleccionMasiva = true;
    this.programacionValida = false;
  }

  loadItems() {
    this.solicitudMezclaService.equipoList().subscribe(data => {
      this.equipo = data[0];
    });

    this.commonService.getListaItemByNombreListaAndValorItem('TIPO_MATERIAL', 'TIPO MATERIAL 1').subscribe(listaItem => {
      this.tipoMaterial = listaItem;
    });

    this.commonService.getListaItemByNombreListaAndValorItem('TIPO_MATERIAL', 'TIPO MATERIAL 1').subscribe(listaItem => {
      this.tipoSolicitud = listaItem;
    });

    this.commonService.getListaItemByNombreListaAndValorItem('TIPO_MATERIAL', 'TIPO MATERIAL 1').subscribe(listaItem => {
      this.turno = listaItem;
    });

    this.commonService.getListaItemByNombreListaAndValorItem('TIPO_MATERIAL', 'TIPO MATERIAL 1').subscribe(listaItem => {
      this.unidad = listaItem;
    });
  }

  trabajarSolicitud(event: any) {
    this.solicitud = event.solicitud;
    this.buildSilicitudMantenimiento();
  }

  buildSilicitudMantenimiento() {
    this.solicitudReponse = false;
    let num = 0;
    // tslint:disable-next-line: forin
    for (const item in this.solicitud.items) {
      // tslint:disable-next-line: radix
      num = (parseInt(item) + 1);
      this.servicio.detailByPk(this.solicitud.items[item].intervencion.mantenimiento.pk).subscribe(mantenimiento => {
        if (mantenimiento) {
          this.solicitud.items[item].intervencion.mantenimiento = mantenimiento;
          this.solicitudReponse = true;
        }
        if (this.solicitud.items.length === num && this.solicitudReponse === true) {
          this.currentAction = this.constants.accionTrabajarSolicitud;
          this.disabledSendTransicion = false;
        }
      });
    }
  }

  validacionProgramacion(event: any) {
    this.programacionValida = event;
  }

  confirmarTransicion(event: any) {
    // si la transicion a ejecutar envia a Programar personal planta, se debe confirmar por parte del usuario
    // que se tengan los recursos necesarios para producir la mezcla
    if (this.data.transicion.id === 146) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'custom-modalbox';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '30%';
      const dialogRef = this.dialog.open(ConfirmCapacidadComponent, dialogConfig);
      dialogRef.beforeClosed().subscribe(val => {
        if (val === 1) {
          this.save();
          this.ejecutarTransicion();
        }
      });
    } else {
      this.save();
      this.ejecutarTransicion();
    }
  }

  save() {
    this.solicitud.tipoMaterial = this.solicitud.tipoMaterialObj;
    this.solicitud.turno = this.solicitud.turnoObj;
    this.solicitud.materiales = [];
    this.solicitud.vales = [];
    this.solicitudMezclaService.update(this.solicitud).subscribe(data => {
      this.solicitud = data;
    });
  }

  ejecutarTransicion() {
    this.disabledSendTransicion = true;

    const mantenimientos: WorkflowMantenimientoModel[] = [];
    for (const item of this.solicitud.items) {
      mantenimientos.push(item.intervencion.mantenimiento);
    }

    this.applyMasiveTransitionTo(mantenimientos, null);
  }

  DataTipoMaterial(item: any) {
    this.solicitudMateriles = new SolicitudTipoMaterial();
    this.solicitudMateriles.cantidad = 1;
    this.solicitudMateriles.cantidadDespachada = 1;
    this.solicitudMateriles.capacidadDespachar = 1;
    this.solicitudMateriles.civ = item.intervencion.mantenimiento.civ;
    this.solicitudMateriles.fechaReprogramacion = item.fechaReprogramacion;
    this.solicitudMateriles.fechaRetiro = item.fechaRetiro;
    this.solicitudMateriles.horaRetiro = '8:00';
    this.solicitudMateriles.observaciones = item.observaciones;
    this.solicitudMateriles.personasContacto = null;
    this.solicitudMateriles.pk = Number(item.intervencion.mantenimiento.pk);
    this.solicitudMateriles.programado = item.programado ? 1 : 0;
    this.solicitudMateriles.quienRecibe = item.quienRecibe.nombresYapellidos;
    this.solicitudMateriles.reprogramar = item.reprogramar ? 1 : 0;
    this.solicitudMateriles.equipo = this.equipo;
    this.solicitudMateriles.intervencionEncabezado = item.intervencion;
    this.solicitudMateriles.tipoMaterial = this.tipoMaterial;
    this.solicitudMateriles.tipoSolicitud = this.tipoSolicitud;
    this.solicitudMateriles.turno = this.turno;
    this.solicitudMateriles.unidad = this.unidad;

    this.solicitud.tipoMateriales.push(this.solicitudMateriles);
  }

  onBack() {
    this.mapService.getVisor().limpiar();
    this.currentAction = 'list';
  }

}
