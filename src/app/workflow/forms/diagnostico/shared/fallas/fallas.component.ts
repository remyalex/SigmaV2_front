import { MaxDecimalValue } from 'src/app/shared/form/number.validator';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DiagnosticoFallaModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.falla.model';
import { DiagnosticoUnidadMuestraModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.unidadMuestreo.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { BaseFallas } from './base-fallas';

/** Componente encargado de gestionar la creación de las fallas del diagnóstico */
@Component({
  selector: 'app-fallas',
  templateUrl: './fallas.component.html'
})
export class FallasComponent extends BaseFallas implements OnInit {
  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param data Información a procesar
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private dialogRef: MatDialogRef<FallasComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'muestras': DiagnosticoUnidadMuestraModel[],
      'mantenimiento': WorkflowMantenimientoModel,
      'datasource': MatTableDataSource<DiagnosticoFallaModel>,
    },
    formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    // Invocación del constructor padre
    super();

    this.mantenimiento = data.mantenimiento;
    this.dataSource = data.datasource;
    this.listado_muestras = data.muestras;

    this.path_tipo_falla = this.constants
      .path_workflow_diagnostico_fallas_tipo_falla.replace('{tipoSuperficieId}',
        this.mantenimiento.tipoSuperficie.id.toString()
      );

    this.path_tipo_intervencion = this.constants
      .path_workflow_diagnostico_fallas_tipoIntervencion.replace(
        '{tipoSuperficieId}',
        this.mantenimiento.tipoSuperficie.id + ''
      );

      if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null &&
        this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.valor === 'CC') {

        this.path_tipo_intervencion  = this.constants
        .path_workflow_diagnostico_fallas_tipoIntervencion.replace(
          'listByReferenciaIntervencion/647374/{tipoSuperficieId}',
          'BacheoIntervencionFallasXSupeficieId/{tipoSuperficieId}').replace(
            '{tipoSuperficieId}',
            this.mantenimiento.tipoSuperficie.id + ''
          );
      }

    this.form = formBuilder.group({
      'unidadMuestreoFalla': [null],
      'tipoFalla': [null],
      'severidadFalla': [null, Validators.compose([Validators.required])],
      'longitudFalla': [null],
      'anchoFalla': [null],
      'areaFalla': [{ value: null }, Validators.compose([Validators.required])],
      'tipoIntervencionFalla': [null],
      'tipoSuperficieFalla': [null],
      'numeroLosasFalla': [null],
      'longitudLosasFalla': [null],
      'anchoLosasFalla': [null],
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal == null ||
      typeof this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.valor === 'undefined' ||
      this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.valor === 'CC') {
      this.visibilityTipoIntervencionFalla = true;
      if ( this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal != null &&
        this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.valor === 'CC') {
        this.form.get('tipoIntervencionFalla').clearValidators();
      }  else {
        this.form.get('tipoIntervencionFalla').setValidators([Validators.required]);
      }
    } else {
      this.visibilityTipoIntervencionFalla = false;
      this.falla.tipoIntervencion = null;
      this.form.get('tipoIntervencionFalla').clearValidators();
    }

    if (this.mantenimiento.tipoSuperficie != null &&
      typeof this.mantenimiento.tipoSuperficie.descripcion !== 'undefined') {
      switch (this.mantenimiento.tipoSuperficie.descripcion) {

        case 'RÍGIDO':
          this.form.get('unidadMuestreoFalla').validator = <any>Validators.compose([Validators.required]);
          this.visibilityUnidadMuestreo = true;
          this.form.get('tipoFalla').validator = <any>Validators.compose([Validators.required]);
          this.visibilityTipoFalla = true;
          this.form.get('tipoSuperficieFalla').clearValidators();
          this.visibilityTipoSuperficie = false;
          this.form.get('anchoFalla').clearValidators();
          this.visibilityAnchoFalla = false;
          this.form.get('longitudFalla').clearValidators();
          this.visibilityLongitudFalla = false;
          this.form.get('longitudLosasFalla').validator =
            <any>Validators.compose([Validators.required, Validators.min(0.01), MaxDecimalValue(10, 2)]);
          this.visibilityLongitudLosasFalla = true;
          this.form.get('anchoLosasFalla').validator =
            <any>Validators.compose([Validators.required, Validators.min(0.01), MaxDecimalValue(10, 2)]);
          this.visibilityAnchoLosasFalla = true;
          this.calculoValidacionNumeroLosasNoExcedaMuestreo();
          this.visibilityNumeroLosas = true;
          break;

        case 'FLEXIBLE':
            this.form.get('unidadMuestreoFalla').validator = <any>Validators.compose([Validators.required]);
            this.visibilityUnidadMuestreo = true;
            this.form.get('tipoFalla').validator = <any>Validators.compose([Validators.required]);
            this.visibilityTipoFalla = true;
            this.form.get('tipoSuperficieFalla').clearValidators();
            this.visibilityTipoSuperficie = false;
            this.form.get('anchoFalla').validator =
              <any>Validators.compose([Validators.required, Validators.min(0.01), MaxDecimalValue(10, 2)]);
            this.visibilityAnchoFalla = true;
            this.form.get('longitudFalla').validator =
              <any>Validators.compose([Validators.required, Validators.min(0.01), MaxDecimalValue(10, 2)]);
            this.visibilityLongitudFalla = true;
            this.form.get('longitudLosasFalla').clearValidators();
            this.visibilityLongitudLosasFalla = false;
            this.form.get('anchoLosasFalla').clearValidators();
            this.visibilityAnchoLosasFalla = false;
            this.form.get('numeroLosasFalla').clearValidators();
            this.visibilityNumeroLosas = false;
          break;

        case 'ADOQUÍN CONCRETO':
        case 'ADOQUÍN ARCILLA':
          this.form.get('unidadMuestreoFalla').validator = <any>Validators.compose([Validators.required]);
          this.visibilityUnidadMuestreo = true;
          this.form.get('tipoFalla').validator = <any>Validators.compose([Validators.required]);
          this.visibilityTipoFalla = true;
          this.form.get('tipoSuperficieFalla').clearValidators();
          this.visibilityTipoSuperficie = false;
          this.form.get('anchoFalla').validator =
            <any>Validators.compose([Validators.required, Validators.min(0.01), MaxDecimalValue(10, 2)]);
          this.visibilityAnchoFalla = true;
          this.form.get('longitudFalla').validator =
            <any>Validators.compose([Validators.required, Validators.min(0.01), MaxDecimalValue(10, 2)]);
          this.visibilityLongitudFalla = true;
          this.form.get('longitudLosasFalla').clearValidators();
          this.visibilityLongitudLosasFalla = false;
          this.form.get('anchoLosasFalla').clearValidators();
          this.visibilityAnchoLosasFalla = false;
          this.form.get('numeroLosasFalla').clearValidators();
          this.visibilityNumeroLosas = false;
          break;

        case 'MIXTOS':
          this.form.get('unidadMuestreoFalla').clearValidators();
          this.visibilityUnidadMuestreo = false;
          this.form.get('tipoFalla').validator = <any>Validators.compose([Validators.required]);
          this.visibilityTipoFalla = true;
          this.form.get('tipoSuperficieFalla').validator = <any>Validators.compose([Validators.required]);
          this.visibilityTipoSuperficie = true;
          this.form.get('anchoFalla').validator =
            <any>Validators.compose([Validators.required, Validators.min(0.01), MaxDecimalValue(10, 2)]);
          this.visibilityAnchoFalla = true;
          this.form.get('longitudFalla').validator =
            <any>Validators.compose([Validators.required, Validators.min(0.01), MaxDecimalValue(10, 2)]);
          this.visibilityLongitudFalla = true;
          this.form.get('longitudLosasFalla').clearValidators();
          this.visibilityLongitudLosasFalla = false;
          this.form.get('anchoLosasFalla').clearValidators();
          this.visibilityAnchoLosasFalla = false;
          this.form.get('numeroLosasFalla').clearValidators();
          this.visibilityNumeroLosas = false;
          this.form.get('areaFalla')
            .setValidators([Validators.required, MaxDecimalValue(10, 2), Validators.max(
              this.mantenimiento.diagnostico.fallas.length > 0 ?
              this.mantenimiento.area - this.mantenimiento.diagnostico.fallas.map(o => o.area).reduce((a, c) => a + c) :
              this.mantenimiento.area
            )]);
          this.mensajeFalla = this.constants.mensajeAreaPK;
          break;

        default:
          this.visibilityNumeroLosas = false;
          this.form.get('numeroLosasFalla').clearValidators();
          this.form.get('unidadMuestreoFalla').clearValidators();
          this.visibilityUnidadMuestreo = false;
          this.form.get('areaFalla').setValidators([Validators.required,
          Validators.max(this.mantenimiento.area)]);
          break;
      }
    }

  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid) {
      this.mantenimiento.diagnostico.fallas.push(this.falla);
      this.dataSource.data = this.mantenimiento.diagnostico.fallas;
      this.dialogRef.close(this.falla);
    }
  }

}
