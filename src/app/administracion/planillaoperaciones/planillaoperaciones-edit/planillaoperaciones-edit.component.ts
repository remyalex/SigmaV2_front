import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PLANILLAOPERACIONES } from '../planillaoperaciones.constant';
import { ItemPlanillaoperaiconesModel } from '../models/planillaoperaciones.model';
import { PlanillaoperacionesService } from '../services/planillaoperaciones.service';
import { ListasService } from '../../listas/services/listas.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'sigma-administracion-planillaoperaciones-edit',
  templateUrl: './planillaoperaciones-edit.component.html'
})
export class PlanillaoperacionesEditComponent implements OnInit {

  listaItemsPlanillaoperaciones;
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PLANILLAOPERACIONES;
  itemToEdit: ItemPlanillaoperaiconesModel;
  formFilaPlanillaoperaciones: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: PlanillaoperacionesService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PlanillaoperacionesEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService
  ) {
    this.listaItemsPlanillaoperaciones = data.itemToEdit.tipoPlanilla.items;
    this.itemToEdit = data.itemToEdit;
    this.formFilaPlanillaoperaciones = this.formBuilder.group({
      'itemPlanillaoperacion': [this.itemToEdit.id , Validators.compose([ Validators.required ])],
      'actividadPlanillaoperacion': [null, Validators.compose([ Validators.required, Validators.maxLength(150) ])],
      'itemUnidadesMedida': [null],
      'activo': [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.itemToEdit));
    this.customerDiffer = this.differs.find(this.itemToEdit).create();
  }
  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(val => {
      for (let key in this.itemToEdit) {
        this.itemToEdit[key] = this.clone[key];
      }
      if (val === 1) {
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.itemToEdit).subscribe(
      (data: ItemPlanillaoperaiconesModel) => {
        this.servicio.updateListItemInfo('true');
        this.dialogRef.close(this.formFilaPlanillaoperaciones.value);
        this.enviada = false;
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      }, error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.formFilaPlanillaoperaciones , this.snackBar);
      });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.formFilaPlanillaoperaciones);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.formFilaPlanillaoperaciones.valid === true) {
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

  seleccionarItemPlanillaoperaciones(itemSelected) {
    this.itemToEdit.item.id = itemSelected;
  }

  seleccionarItemUnidadMedida(unidad) {
    this.itemToEdit.unidad = unidad;
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
}

