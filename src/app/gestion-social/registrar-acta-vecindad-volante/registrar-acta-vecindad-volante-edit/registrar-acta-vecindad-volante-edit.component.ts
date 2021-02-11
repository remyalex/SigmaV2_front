import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { ActaVolanteResidenteModel } from '../models/acta-volante-residente.model';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../../registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ActaVolanteModel } from '../models/acta-volante.model';
import { ActaVolanteService } from '../services/acta-volante.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';

@Component({
  selector: 'app-registrar-acta-vecindad-volante-edit',
  templateUrl: './registrar-acta-vecindad-volante-edit.component.html'
})
export class RegistrarActaVecindadVolanteEditComponent extends BaseComponent implements OnInit {

  @Input() pk: any;
  @Input() actaVolanteId: any;
  @Output() back = new EventEmitter();

  /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  actaVolanteResidente: ActaVolanteResidenteModel = new ActaVolanteResidenteModel();
  actaVolante: ActaVolanteModel = new ActaVolanteModel();
  mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  actasRed: ActaVolanteResidenteModel[];
  processing = true;

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

    private servicioActa: ActaVolanteService,
    private router: Router,
    private dialog: MatDialog,
    private _route: ActivatedRoute,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.form = formBuilder.group({
      id: [{ value: this.actaVolanteResidente.id }],
      activo: [null],
      propietario: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      direccion: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      telefono: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      fechaRegistro: [{ value: this.actaVolanteResidente.fechaRegistro }, Validators.compose([Validators.required])],
      volanteEntregado: [null, Validators.compose([Validators.required])],
      actaVolanteId: [{ value: this.actaVolanteResidente.actaVolanteId }]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.actaVolante = new ActaVolanteModel();
    this.mantenimiento = new WorkflowMantenimientoModel();
    const pk = this.pk;
    const id = this.actaVolanteId;
    this.servicioActa.detail(Number(id)).subscribe(
      (data: ActaVolanteModel) => {
        this.actaVolante = data;
        this.actaVolanteResidente = data.actaVolanteResidente;
      },
      error => {
      }
    );
    this.servicio.detailByPk(Number(pk)).subscribe(
      (data: WorkflowMantenimientoModel) => {
        this.mantenimiento = data;
        this.processing = false;
      },
      error => {
      }
    );
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {

    this.actaVolante.intervencionEncabezado = new IntervencionInfo();
    this.actaVolante.intervencionEncabezado.id = this.mantenimiento.intervenciones[0].id;
    this.actaVolante.intervencionEncabezado.nroActa = this.mantenimiento.intervenciones[0].nroActa;
    this.actaVolante.intervencionEncabezado.observaciones = this.mantenimiento.intervenciones[0].observaciones;
    this.actaVolante.intervencionEncabezado.fechaVisita = this.mantenimiento.intervenciones[0].fechaVisita;
    this.actaVolante.intervencionEncabezado.activo = this.mantenimiento.intervenciones[0].activo;
    this.actaVolante.intervencionEncabezado.tipoVia = this.mantenimiento.tipoVia;
    this.actaVolante.intervencionEncabezado.tipoEjecucion = this.mantenimiento.intervenciones[0].tipoEjecucion;
    this.actaVolante.intervencionEncabezado.clase = this.mantenimiento.clase;
    this.actaVolante.intervencionEncabezado.rutaTransporte = this.mantenimiento.intervenciones[0].rutaTransporte;
    this.actaVolante.intervencionEncabezado.usuario = this.mantenimiento.intervenciones[0].usuario;
    this.actaVolante.intervencionEncabezado.tipoSuperficie = this.mantenimiento.intervenciones[0].tipoSuperficie;

    this.actaVolante.actaVolanteResidente = this.actaVolanteResidente;
    this.servicioActa.update(this.actaVolante).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });

        this.currentAction = 'listVolantes';
        this.back.emit({ currentAction: this.currentAction });
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

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.currentAction = 'listVolantes';
        this.back.emit({ currentAction: this.currentAction });
      }
    });
  }

}
