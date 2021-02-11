import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Insumo } from '../models/insumo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InsumoService } from '../services/insumo.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_INSUMO } from './../insumo.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la edición de un insumo*/
@Component({
  selector: 'sigma-administracion-insumo-edit',
  templateUrl: './insumo-edit.component.html'
})
export class InsumoEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_INSUMO;
  insumo: Insumo;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: InsumoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<InsumoEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Insumo,
    private dialog: MatDialog,
    private utilitiesServices: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.insumo = data;

    this.form = this.formBuilder.group(
      {
        'activo': [null, Validators.compose([Validators.required])],
        'id': [null, Validators.compose([Validators.required])],
        'claseInsumoId': [null, Validators.compose([Validators.required])],
        'codigo': [null, Validators.compose([Validators.required, Validators.maxLength(20),])],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(600),])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(100),])],
        'unidadMedidaId': [null, Validators.compose([Validators.required])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.insumo));
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
      if (val == 1) {
        for (let key in this.insumo) {
          this.insumo[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.insumo).subscribe(data => {
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_insumo);
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.enviada = false;
      this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    if (this.form.valid == true) {
      this.enviada = true;
      this.save();
    } else {
      this.enviada = false;
      this.snackBar.open(this.constants.errorForm, 'X', {
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
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }
  setDataInsumo(atributo: any, objeto: any) {
    this.insumo[atributo] = objeto;
  }
}
