import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../../registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';
import { ActaVolanteResidenteModel } from '../models/acta-volante-residente.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActaVolanteResidenteService } from '../services/acta-volante-residente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ActaVolanteModel } from '../models/acta-volante.model';
import { ActaVolanteService } from '../services/acta-volante.service';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { IntervencionService } from 'src/app/workflow/forms/intervencion/services/intervencion.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';

@Component({
  selector: 'app-registrar-acta-vecindad-volante-create',
  templateUrl: './registrar-acta-vecindad-volante-create.component.html'
})
export class RegistrarActaVecindadVolanteCreateComponent extends BaseComponent implements OnInit {

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
  @Input() mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  
  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();
  @Output() saveFuncion = new EventEmitter();

  //mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  intervencion: Intervencion = new Intervencion();
  actaVolante: ActaVolanteModel = new ActaVolanteModel();
  actaVolanteResidente: ActaVolanteResidenteModel = new ActaVolanteResidenteModel();
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  processing = true;
  tipoIntervencion = '';
  pk = '';

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
    private servicioActa: ActaVolanteService,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.form = this.formBuilder.group({
      id: [{ value: this.actaVolanteResidente.id }],
      activo: [null],
      propietario: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      direccion: [null, Validators.compose([Validators.required, Validators.maxLength(300)])],
      telefono: [null, Validators.compose([Validators.maxLength(7)])],
      fechaRegistro: [{ value: this.actaVolanteResidente.fechaRegistro }, Validators.compose([Validators.required])],
      volanteEntregado: [null, Validators.compose([Validators.required])]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.actaVolanteResidente = new ActaVolanteResidenteModel();
    this.actaVolanteResidente.fechaRegistro = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
    this.processing = false;
    this.data = new WorkflowMantenimientoActividadModel();
    this.pk = this._route.snapshot.paramMap.get('pk');
    if (this.pk !== null && this.pk.length > 0) {
      this.servicio.detailByPk(Number(this.pk)).subscribe(data => {
        this.mantenimiento = data;
        if (this.mantenimiento.diagnostico !== null
          && this.mantenimiento.diagnostico.encabezado != null
          && this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null
        ) {
          if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null) {
            this.tipoIntervencion = this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion;
          } else {
            const tam = this.mantenimiento.diagnostico.fallas.length;
            this.tipoIntervencion = this.mantenimiento.diagnostico.fallas[tam -1].tipoIntervencion.descripcion;
          }
        }
        this.intervencion = this.mantenimiento.intervenciones[0];
        this.actaVolanteResidente.fechaRegistro = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
//        this.actaVolanteResidente.actaAficheArchivo.fechaRegistro = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
        this.processing = false;
      }, error => {
      });
    }
}

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.actaVolante = new ActaVolanteModel();
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

    const consecutivo = this.mantenimiento.intervenciones[0].actasVolante.length + 1;
    if (consecutivo > 999) {
      this.actaVolante.noVolante = this.mantenimiento.civ + '-' + consecutivo;
    } else if (consecutivo > 99) {
      this.actaVolante.noVolante = this.mantenimiento.civ + '-0' + consecutivo;
    } else if (consecutivo > 9) {
      this.actaVolante.noVolante = this.mantenimiento.civ + '-00' + consecutivo;
    } else {
      this.actaVolante.noVolante = this.mantenimiento.civ + '-000' + consecutivo;
    }
    this.actaVolante.actaVolanteResidente = this.actaVolanteResidente;
    this.servicioActa.create(this.actaVolante).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.currentAction = 'listVolantes';
        this.back.emit({ currentAction: this.currentAction });
        //const urlBack = '/gestion-social/registrarActaVecindadVolante/list/' + this.pk;
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
        //const urlBack = '/gestion-social/registrarActaVecindadVolante/list/' + this.mantenimiento.pk;
        //const urlBack = '/workflow/social/registrar-acta-vecindad-volante/';
        //this.router.navigate([urlBack]);
      }
    });
  }

}
