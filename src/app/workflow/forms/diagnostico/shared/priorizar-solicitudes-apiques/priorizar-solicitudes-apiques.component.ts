import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../diagnostico.constants';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ResultadoApiqueService } from 'src/app/mejoramiento/predisenio/services/resultadoApique.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** Componente encargado de gestionar la solicitudes que se van a priorizar para los apiques */
@Component({
  selector: 'app-priorizar-solicitudes-apiques',
  templateUrl: './priorizar-solicitudes-apiques.component.html'
})
export class PriorizarSolicitudesApiquesComponent implements OnInit {

  /** Formulario contenedor del componente */
  form: FormGroup;
  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Objeto del mantenimiento que se procesará en el componente */
  mantenimiento: WorkflowMantenimientoModel;
  /** Clón del objeto que se va a modificar información */
  clone: WorkflowMantenimientoModel;


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
  constructor(
    private dialogRef: MatDialogRef<PriorizarSolicitudesApiquesComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'mantenimiento': WorkflowMantenimientoModel,
    },
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private servicio: ResultadoApiqueService,
    private snackBar: MatSnackBar,
  ) {
    const formato = 'DD-MM-YYYY';
    this.mantenimiento = data.mantenimiento;
    this.form = formBuilder.group({
      'prioritarios': [null, Validators.compose([Validators.required, Validators.min(0)])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.mantenimiento));
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.mantenimiento.predisenio.apiques[0].prioritarios = this.form.get('prioritarios').value;
    this.dialogRef.close(this.mantenimiento.predisenio.apiques[0].prioritarios);
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid == true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
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

}
