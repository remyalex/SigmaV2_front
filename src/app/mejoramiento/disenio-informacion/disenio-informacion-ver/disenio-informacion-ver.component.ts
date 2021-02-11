import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { CONST_MEJORAMIENTO_DISENIO_INFORMACION, CONST_MEJORAMIENTO_DISENIO_CAPA, CONST_MEJORAMIENTO_DISENIO_PARAMETRO, CONST_MEJORAMIENTO_DISENIO_INFORMACION_COMPLEMENTARIA } from '../disenio-informacion.constants';
import { Disenio } from '../../disenio/models/disenio.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DisenioInformacion } from '../models/disenio-informacion.model';
import { DisenioParametro } from '../models/disenio-parametro.model';
import { DisenioCapas } from '../models/disenio-capas.model';
import { DisenioInformacionComplementaria } from '../models/disenio-informacion-complementaria.model';

@Component({
  selector: 'sigma-disenio-informacion-ver',
  templateUrl: './disenio-informacion-ver.component.html'
})
export class DisenioInformacionVerComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {

  @Input() disenio: Disenio;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Output() saveFuncion = new EventEmitter();

  @Input() componentExterno = false;

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  data: WorkflowMantenimientoActividadModel;
  disenioInformacion: DisenioInformacion;
  disenioParametro: DisenioParametro;
  disenioCapa1: DisenioCapas;
  disenioCapa2: DisenioCapas;
  disenioCapa3: DisenioCapas;
  disenioCapa4: DisenioCapas;
  disenioCapa5: DisenioCapas;

  disenioCapas: DisenioCapas[];
  disenioInformacionComplementaria: DisenioInformacionComplementaria;
  disenioInformacionObservaciones: DisenioInformacion;
  constantsDisenioInformacion = CONST_MEJORAMIENTO_DISENIO_INFORMACION;
  constantsDisenioCapas = CONST_MEJORAMIENTO_DISENIO_CAPA;
  constantsDisenioParametro = CONST_MEJORAMIENTO_DISENIO_PARAMETRO;
  constantsDisenioInformacionComplementaria = CONST_MEJORAMIENTO_DISENIO_INFORMACION_COMPLEMENTARIA;

  // forms
  formuarlioDisenioCapa: FormGroup;
  formuarlioDisenioInformacion: FormGroup;
  formuarlioDisenioInformacionComplementaria: FormGroup;
  formuarlioDisenioParametro: FormGroup;
  formuarlioDisenioInformacionObservaciones: FormGroup;

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

    // Definición de formularios
    this.formuarlioDisenioInformacion = this.formBuilder.group({
      id: [{ value: null, disabled: true }],
      tipoSuperficie: [{ value: null, disabled: true }],
      tipoIntervencionFinal: [{ value: null, disabled: true }],
      metodologia: [{ value: null, disabled: true }],
      materialGranular: [{ value: null, disabled: true }],
      espesor: [{ value: null, disabled: true }],
      cbrInicial: [{ value: null, disabled: true }]
    });

    this.formuarlioDisenioParametro = this.formBuilder.group({
      id: [{ value: null, disabled: true }],
      clasificacionSubrasante: [{ value: null, disabled: true }],
      nee: [{ value: null, disabled: true }],
      cbrDisenio: [{ value: null, disabled: true }],
      tpdvc: [{ value: null, disabled: true }],
      ks: [{ value: null, disabled: true }],
      numeroEstructuralEfectivo: [{ value: null, disabled: true }]
    });

    this.formuarlioDisenioCapa = this.formBuilder.group({
      idCapa1: [{ value: null, disabled: true }],
      tipoCapa1: [{ value: null, disabled: true }],
      espesorCapa1: [{ value: null, disabled: true }],
      idCapa2: [{ value: null, disabled: true }],
      tipoCapa2: [{ value: null, disabled: true }],
      espesorCapa2: [{ value: null, disabled: true }],
      idCapa3: [{ value: null, disabled: true }],
      tipoCapa3: [{ value: null, disabled: true }],
      espesorCapa3: [{ value: null, disabled: true }],
      idCapa4: [{ value: null, disabled: true }],
      tipoCapa4: [{ value: null, disabled: true }],
      espesorCapa4: [{ value: null, disabled: true }],
      idCapa5: [{ value: null, disabled: true }],
      tipoCapa5: [{ value: null, disabled: true }],
      espesorCapa5: [{ value: null, disabled: true }]
    });

    this.formuarlioDisenioInformacionComplementaria = this.formBuilder.group({
      id: [{ value: null, disabled: true }],
      geosinteticos: [{ value: null, disabled: true }],
      sistemaDrenaje: [{ value: null, disabled: true }]
    });

    this.formuarlioDisenioInformacionObservaciones = this.formBuilder.group({
      id: [{ value: null, disabled: true }],
      observaciones: [{ value: null, disabled: true }]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.disenio != null && this.disenio.disenioInformacion != null) {
      this.disenioInformacion = this.disenio.disenioInformacion;
      this.disenioInformacionObservaciones = this.disenio.disenioInformacion;
    } else {
      this.disenioInformacion = new DisenioInformacion();
      this.disenioInformacionObservaciones = new DisenioInformacion();
    }

    if (this.disenio != null && this.disenio.disenioParametro != null) {
      this.disenioParametro = this.disenio.disenioParametro;
    } else {
      this.disenioParametro = new DisenioParametro();
    }

    if (this.disenio != null && this.disenio.disenioInformacionComplementaria != null) {
      this.disenioInformacionComplementaria = this.disenio.disenioInformacionComplementaria;
    } else {
      this.disenioInformacionComplementaria = new DisenioInformacionComplementaria();
    }

    if (this.disenio != null && this.disenio.capas != null && this.disenio.capas.length > 0) {
      this.disenio.capas = this.utilitiesServices.orderArray(this.disenio.capas, 'id');

      switch (this.disenio.capas.length) {
        case 5:
          this.disenioCapa1 = this.disenio.capas[0];
          this.disenioCapa2 = this.disenio.capas[1];
          this.disenioCapa3 = this.disenio.capas[2];
          this.disenioCapa4 = this.disenio.capas[3];
          this.disenioCapa5 = this.disenio.capas[4];
          break;
        case 4:
          this.disenioCapa1 = this.disenio.capas[0];
          this.disenioCapa2 = this.disenio.capas[1];
          this.disenioCapa3 = this.disenio.capas[2];
          this.disenioCapa4 = this.disenio.capas[3];
          this.disenioCapa5 = new DisenioCapas();
          break;
        case 3:
          this.disenioCapa1 = this.disenio.capas[0];
          this.disenioCapa2 = this.disenio.capas[1];
          this.disenioCapa3 = this.disenio.capas[2];
          this.disenioCapa4 = new DisenioCapas();
          this.disenioCapa5 = new DisenioCapas();
          break;
        case 2:
          this.disenioCapa1 = this.disenio.capas[0];
          this.disenioCapa2 = this.disenio.capas[1];
          this.disenioCapa3 = new DisenioCapas();
          this.disenioCapa4 = new DisenioCapas();
          this.disenioCapa5 = new DisenioCapas();
          break;
        case 1:
          this.disenioCapa1 = this.disenio.capas[0];
          this.disenioCapa2 = new DisenioCapas();
          this.disenioCapa3 = new DisenioCapas();
          this.disenioCapa4 = new DisenioCapas();
          this.disenioCapa5 = new DisenioCapas();
          break;
      }

    } else {
      this.disenioCapa1 = new DisenioCapas();
      this.disenioCapa2 = new DisenioCapas();
      this.disenioCapa3 = new DisenioCapas();
      this.disenioCapa4 = new DisenioCapas();
      this.disenioCapa5 = new DisenioCapas();
    }
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
  }

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
          this.currentAction = 'work';
          this.back.emit({ currentAction: this.currentAction });
        }
      }
    );
  }

  onBackExterno() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.back.emit();
        }
      }
    );
  }

}
