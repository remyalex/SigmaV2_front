import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { ActaAficheModel } from '../models/acta-afiche.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActaAficheService } from '../services/acta-afiche.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../../registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';

@Component({
  selector: 'app-acta-afiche-edit',
  templateUrl: './acta-afiche-edit.component.html'
})
export class ActaAficheEditComponent extends BaseComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  public submitted: any;

  // inputs
  @Input() mantenimientoAux: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();
  @Output() saveFuncion = new EventEmitter();
  /** Objeto del mantenimiento que se procesará en el componente */
  mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  intervencion: Intervencion = new Intervencion();
  actaAfiche: ActaAficheModel = new ActaAficheModel();
  @Input() actaAficheAux: ActaAficheModel = new ActaAficheModel();
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  processing = true;

  tipoIntervencion = '';
  otroTipoIntervencion = '';

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
    private router: Router,
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private servicioActa: ActaAficheService,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.form = this.formBuilder.group({
      id: [null],
      activo: [null],
      nombreEstablecimiento: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      direccion: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      telefono: [null, Validators.compose([Validators.required, Validators.maxLength(25)])],
      personaContacto: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      tipoPiezaDivulgar: [null, Validators.compose([Validators.required])],
      cantidad: [null, Validators.compose([Validators.required, Validators.maxLength(5)])],
      descripcion: [null, Validators.compose([Validators.maxLength(300)])],
      observaciones: [null, Validators.compose([Validators.maxLength(300)])],
      fechaRegistro: [{ value: this.actaAfiche.fechaRegistro }, Validators.compose([Validators.required])],
      archivo: [null, Validators.compose([Validators.required])],

    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.actaAfiche = new ActaAficheModel();
    this.mantenimiento = new WorkflowMantenimientoModel();
    const pk = this._route.snapshot.paramMap.get('pk');
    const id = this._route.snapshot.paramMap.get('id');
    if (id !== null && id.length > 0) {
      this.servicioActa.detail(Number(id)).subscribe(
        (data: ActaAficheModel) => {
          this.actaAfiche = data;
        },
        error => {
        }
      );
    } else {
      this.actaAfiche = this.actaAficheAux;
    }

    if (pk !== null && pk.length > 0) {
      this.servicio.detailByPk(Number(pk)).subscribe(data => {
        this.mantenimiento = data;
        if (this.mantenimiento.diagnostico !== null
          && this.mantenimiento.diagnostico.encabezado != null
          && this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null
        ) {
          if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null) {
            this.tipoIntervencion = this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion;
          } else {
            const tam = this.mantenimiento.diagnostico.fallas.length;
            this.otroTipoIntervencion = this.mantenimiento.diagnostico.fallas[tam - 1].tipoIntervencion.descripcion;
          }
        }
        this.actaAfiche.fechaRegistro = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
        this.processing = false;
      }, error => {
      });
    } else {
      this.mantenimiento = this.mantenimientoAux;
      if (this.mantenimiento.diagnostico !== null
        && this.mantenimiento.diagnostico.encabezado != null
        && this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null
      ) {
        if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null) {
          this.tipoIntervencion = this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion;
        } else {
          const tam = this.mantenimiento.diagnostico.fallas.length;
          this.otroTipoIntervencion = this.mantenimiento.diagnostico.fallas[tam - 1].tipoIntervencion.descripcion;
        }
      }
      this.actaAfiche.fechaRegistro = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
      this.processing = false;
    }
  }

  cargaInfo() {
    if (this.mantenimiento.diagnostico !== null
      && this.mantenimiento.diagnostico.encabezado != null
      && this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null
    ) {
      if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null) {
        this.tipoIntervencion = this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion;
      } else {
        const tam = this.mantenimiento.diagnostico.fallas.length;
        this.otroTipoIntervencion = this.mantenimiento.diagnostico.fallas[tam - 1].tipoIntervencion.descripcion;
      }
    }
    this.actaAfiche = new ActaAficheModel();
    this.actaAfiche.fechaRegistro = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
    this.processing = false;
    this.data = new WorkflowMantenimientoActividadModel();

  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.actaAfiche.intervencionEncabezado = new IntervencionInfo();
    this.actaAfiche.intervencionEncabezado.id = this.mantenimiento.intervenciones[0].id;
    this.actaAfiche.intervencionEncabezado.nroActa = this.mantenimiento.intervenciones[0].nroActa;
    this.actaAfiche.intervencionEncabezado.observaciones = this.mantenimiento.intervenciones[0].observaciones;
    this.actaAfiche.intervencionEncabezado.fechaVisita = this.mantenimiento.intervenciones[0].fechaVisita;
    this.actaAfiche.intervencionEncabezado.activo = this.mantenimiento.intervenciones[0].activo;
    this.actaAfiche.intervencionEncabezado.tipoVia = this.mantenimiento.tipoVia;
    this.actaAfiche.intervencionEncabezado.tipoEjecucion = this.mantenimiento.intervenciones[0].tipoEjecucion;
    this.actaAfiche.intervencionEncabezado.clase = this.mantenimiento.clase;
    this.actaAfiche.intervencionEncabezado.rutaTransporte = this.mantenimiento.intervenciones[0].rutaTransporte;
    this.actaAfiche.intervencionEncabezado.usuario = this.mantenimiento.intervenciones[0].usuario;
    this.actaAfiche.intervencionEncabezado.tipoSuperficie = this.mantenimiento.intervenciones[0].tipoSuperficie;
    this.utilitiesServices.scrollToTop();
    this.servicioActa.update(this.actaAfiche).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
          this.back.emit({ pk: this.mantenimiento.pk });
        //this.ngOnInit();
        //this.currentAction = 'listVolantes';
        //this.back.emit({ currentAction: this.currentAction, pk: this.mantenimiento.pk });
        //const urlBack = '/gestion-social/registrarActaVecindadVolante/listAfiche/' + this.mantenimiento.pk;
        //this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open(this.constants.errorForm, 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  onBack() {
    this.utilitiesServices.scrollToTop();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
          this.back.emit({ pk: this.mantenimiento.pk });
        //const urlBack = '/gestion-social/registrarActaVecindadVolante/listAfiche/' + this.mantenimiento.pk;
        //this.router.navigate([urlBack]);
      }
    });
  }

}
