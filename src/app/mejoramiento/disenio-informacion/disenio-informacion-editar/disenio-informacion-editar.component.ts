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
import { CONST_MEJORAMIENTO_DISENIO_INFORMACION, CONST_MEJORAMIENTO_DISENIO_CAPA, CONST_MEJORAMIENTO_DISENIO_PARAMETRO,
  CONST_MEJORAMIENTO_DISENIO_INFORMACION_COMPLEMENTARIA } from '../disenio-informacion.constants';
import { Disenio } from '../../disenio/models/disenio.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DisenioInformacion } from '../models/disenio-informacion.model';
import { DisenioParametro } from '../models/disenio-parametro.model';
import { DisenioCapas } from '../models/disenio-capas.model';
import { DisenioInformacionComplementaria } from '../models/disenio-informacion-complementaria.model';

@Component({
  selector: 'sigma-disenio-informacion-editar',
  templateUrl: './disenio-informacion-editar.component.html'
})
export class DisenioInformacionEditarComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {

  @Input() disenio: Disenio;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Output() saveFuncion = new EventEmitter();

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  disenioInformacion: DisenioInformacion;
  cloneDisenio: Disenio;
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
  formIsValid = false;

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
      id: [null],
      tipoSuperficie: [null, Validators.compose([Validators.required])],
      tipoIntervencionFinal: [null, Validators.compose([Validators.required])],
      metodologia: [null, Validators.compose([Validators.required])],
      materialGranular: [null, Validators.compose([Validators.required])],
      espesor: [null, Validators.compose([Validators.required, Validators.min(0),
        Validators.max(2), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
      cbrInicial: [null, Validators.compose([Validators.required, Validators.min(0),
        Validators.max(100), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
    });

    this.formuarlioDisenioParametro = this.formBuilder.group({
      id: [null],
      clasificacionSubrasante: [null, Validators.compose([Validators.required])],
      nee: [null, Validators.compose([Validators.required, Validators.min(50000), Validators.pattern('[0-9]*')])],
      cbrDisenio: [null, Validators.compose([Validators.required, Validators.min(0),
        Validators.max(100), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
      tpdvc: [null, Validators.compose([Validators.min(1), Validators.pattern('[0-9]*')])],
      ks: [null, Validators.compose([Validators.min(0), Validators.max(250), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
      numeroEstructuralEfectivo: [null, Validators.compose([Validators.min(0),
        Validators.max(20), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
    });

    this.formuarlioDisenioCapa = this.formBuilder.group({
      idCapa1: [null],
      tipoCapa1: [null, Validators.compose([Validators.required])],
      espesorCapa1: [null, Validators.compose([Validators.required, Validators.min(0),
        Validators.max(50), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],

      idCapa2: [null],
      tipoCapa2: [null, Validators.compose([Validators.required])],
      espesorCapa2: [null, Validators.compose([Validators.required, Validators.min(0),
        Validators.max(50), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],

      idCapa3: [null],
      tipoCapa3: [null, Validators.compose([Validators.required])],
      espesorCapa3: [null, Validators.compose([Validators.required, Validators.min(0),
        Validators.max(50), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],

      idCapa4: [null],
      tipoCapa4: [null, Validators.compose([Validators.required])],
      espesorCapa4: [null, Validators.compose([Validators.required, Validators.min(0),
          Validators.max(50), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],

      idCapa5: [null],
      tipoCapa5: [null, Validators.compose([Validators.required])],
      espesorCapa5: [null, Validators.compose([Validators.required, Validators.min(0),
        Validators.max(50), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],

    });

    this.formuarlioDisenioInformacionComplementaria = this.formBuilder.group({
      id: [null],
      geosinteticos: [null, Validators.compose([Validators.required])],
      sistemaDrenaje: [null, Validators.compose([Validators.required])]
    });

    this.formuarlioDisenioInformacionObservaciones = this.formBuilder.group({
      id: [null],
      observaciones: [null, Validators.compose([Validators.required, Validators.maxLength(400)])]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    if ( this.disenio === null || this.disenio === undefined) {
      this.disenio = this.mantenimiento.disenio;
    }

    if (this.disenio != null) {
      this.cloneDisenio = JSON.parse(JSON.stringify(this.disenio));
    }

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

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.processing = true;
    this.formIsValid = this.validate(this.formuarlioDisenioInformacion);
    this.formIsValid = this.formIsValid ? this.validate(this.formuarlioDisenioParametro) : this.formIsValid;
    this.formIsValid = this.formIsValid ? this.validate(this.formuarlioDisenioCapa) : this.formIsValid;
    this.formIsValid = this.formIsValid ? this.validate(this.formuarlioDisenioInformacionComplementaria) : this.formIsValid;
    this.formIsValid = this.formIsValid ? this.validate(this.formuarlioDisenioInformacionObservaciones) : this.formIsValid;

    if (this.formIsValid) {
      if (this.disenio === null || this.disenio === undefined) {
        this.disenio = new Disenio();
      }
      if (this.disenioInformacion === null || this.disenioInformacion === undefined) {
        this.disenioInformacion = new DisenioInformacion();
      }
      this.disenioInformacion.observaciones = this.disenioInformacionObservaciones.observaciones;
      this.disenio.disenioInformacion = this.disenioInformacion;
      this.disenio.disenioParametro = this.disenioParametro;
      this.disenio.disenioInformacionComplementaria = this.disenioInformacionComplementaria;

      let index = this.disenio.capas.findIndex(capa => this.disenioCapa1.id == capa.id);
      if (index > -1 && this.disenioCapa1.id != undefined) {
        this.disenio.capas[index] = this.disenioCapa1;
      } else {
        this.disenio.capas.push(this.disenioCapa1);
      }

      index = this.disenio.capas.findIndex(capa => this.disenioCapa2.id == capa.id)
      if (index > -1 && this.disenioCapa2.id != undefined) {
        this.disenio.capas[index] = this.disenioCapa2;
      } else {
        this.disenio.capas.push(this.disenioCapa2);
      }

      index = this.disenio.capas.findIndex(capa => this.disenioCapa3.id == capa.id)
      if (index > -1 && this.disenioCapa3.id != undefined) {
        this.disenio.capas[index] = this.disenioCapa3;
      } else {
        this.disenio.capas.push(this.disenioCapa3);
      }

      index = this.disenio.capas.findIndex(capa => this.disenioCapa4.id == capa.id)
      if (index > -1 && this.disenioCapa4.id != undefined) {
        this.disenio.capas[index] = this.disenioCapa4;
      } else {
        this.disenio.capas.push(this.disenioCapa4);
      }

      index = this.disenio.capas.findIndex(capa => this.disenioCapa5.id == capa.id)
      if (index > -1 && this.disenioCapa5.id != undefined) {
        this.disenio.capas[index] = this.disenioCapa5;
      } else {
        this.disenio.capas.push(this.disenioCapa5);
      }

      this.mantenimiento.disenio = this.disenio;
      this.saveFuncion.emit({ mantenimiento: this.mantenimiento });
    } else {
      this.processing = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
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
          this.back.emit({ currentAction: this.currentAction, disenio: this.cloneDisenio });
        }
      }
    );
  }

  public validate(form: FormGroup): boolean {
    // tslint:disable-next-line: forin
    for (const inner in form.controls) {
      if (inner === 'id') {
        form.get(inner).clearValidators();
        form.get(inner).setErrors(null);
      }
      form.get(inner).markAsTouched();
      form.get(inner).updateValueAndValidity();
    }
    return form.valid;
  }
}
