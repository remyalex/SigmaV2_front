import { Acta } from 'src/app/gestion-social/actas-vecindad/models/actas-vecindad.model';
import { CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA } from './../gestion-social-adelantada.constant';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../../registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { GestionSocialAdelantadaModel } from '../models/gestion-social-adelantada.model';
import { GestionSocialAdelantadaService } from '../services/gestion-social-adelantada.service';

@Component({
  selector: 'sigma-gestion-social-adelantada-create',
  templateUrl: './gestion-social-adelantada-create.component.html'
})
export class GestionSocialAdelantadaCreateComponent extends BaseComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA;
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

  gestionSocial: GestionSocialAdelantadaModel = new GestionSocialAdelantadaModel();
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  processing = true;
  pk = '';
  //ultimaActa: Acta;
  frenteObra = '';

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
    private servicioGestion: GestionSocialAdelantadaService,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.form = this.formBuilder.group({
      activo: [null],
      fechaRegistro: [],
      tipoIntervencion: [null],
      otroTipoIntervencion: [null],
      localidad: [null],
      upla: [null],
      barrio: [null],
      nomenclatura: [null],
      frenteObra: [null],
      pk: [null],
      civ: [null],
      accionesAdelantadas: [null],
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.gestionSocial = new GestionSocialAdelantadaModel();
    this.gestionSocial.fechaRegistro = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
    this.gestionSocial.mantenimiento = this.mantenimiento;

    // this.ultimaActa =
    //     this.mantenimiento.actasVecindad &&
    //     this.mantenimiento.actasVecindad.length > 0 ?
    //     this.mantenimiento.actasVecindad[this.mantenimiento.actasVecindad.length - 1 ] : null;

    this.processing = false;
    this.data = new WorkflowMantenimientoActividadModel();
    this.pk = this._route.snapshot.paramMap.get('pk');
}

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    const cantidadActasVecindad = this.mantenimiento.actasVecindad ? this.mantenimiento.actasVecindad.length : 0;
    this.gestionSocial.cantidadActasVecindad = cantidadActasVecindad;
    this.servicioGestion.create(this.gestionSocial).subscribe(
      data => {
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.currentActionString = 'consultaGestionSocial';
        this.servicioGestion.updateGestionData( data );
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
        //CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.currentActionString = 'consultaGestionSocial';
        //this.servicioGestion.updateGestionData( this.gestionSocial );
        this.back.emit({currentAction: 'list'});
      }
    });
  }

}
