import { Component, OnInit } from '@angular/core';
import { ItemPlanillaoperaiconesModel } from '../models/planillaoperaciones.model';
import { PlanillaoperacionesService } from '../services/planillaoperaciones.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONST_ADMINISTRACION_PLANILLAOPERACIONES } from '../planillaoperaciones.constant';
import { MatDialogConfig, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';
import { ListasService } from '../../listas/services/listas.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Lista } from '../../listas/models/lista.model';
import { ListaCriteria } from '../../listas/models/lista-criteria.model';

@Component({
  selector: 'sigma-administracion-planillaoperaciones-admin',
  templateUrl: './planillaoperaciones-create.component.html'
})
export class PlanillaoperacionesCreateComponent implements OnInit {

  loader = true;
  filaPlanillaoperaciones: ItemPlanillaoperaiconesModel;
  listaItemsTipoPlanilla: Lista[];
  listaItemsPlanillaoperaciones;
  formFilaPlanillaoperaciones: FormGroup;
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PLANILLAOPERACIONES;
  enviada: Boolean = false;
  disableSubmit: Boolean = false;
  criteriaList: ListaCriteria[];


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: PlanillaoperacionesService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private servicioListas: ListasService,
    private utilitiesService: UtilitiesService
  ) {
    this.criteriaList = [new ListaCriteria(), new ListaCriteria()];
    this.listaItemsTipoPlanilla = [];
    this.filaPlanillaoperaciones = new ItemPlanillaoperaiconesModel();
    this.formFilaPlanillaoperaciones = this.formBuilder.group({
      'listaItemsTipoTarjeta': [null, Validators.compose([Validators.required])],
      'itemPlanillaoperacion': [null, Validators.compose([Validators.required])],
      'actividadPlanillaoperacion': [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      'itemUnidadesMedida': [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.criteriaList[0].nombre = 'TARJETA_MAQUINARIA';
    this.criteriaList[0].descripcion = 'TARJETA_MAQUINARIA';
    this.criteriaList[1].nombre = 'TARJETA_VEHICULOS';
    this.criteriaList[1].descripcion = 'TARJETA_VEHICULOS';

    for (const criteria of this.criteriaList) {
      this.servicioListas.search(criteria).subscribe(
        data => {
          this.loader = false;
          this.listaItemsTipoPlanilla.push(data.content[0]);
        }
      );
    }
  }

  seleccionarTipoPlanilla(tipo) {
    this.filaPlanillaoperaciones.tipoPlanilla.id = tipo.id;
    this.listaItemsPlanillaoperaciones = tipo.items;
  }

  seleccionarItemPlanillaoperaciones(itemID) {
    this.filaPlanillaoperaciones.item.id = itemID.id;
    this.filaPlanillaoperaciones.item.valor = itemID.valor;
  }

  seleccionarItemUnidadMedida(unidad) {
    this.filaPlanillaoperaciones.unidad.id = unidad.id;
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin')
          this.router.navigate([urlBack]);
        }
      }
    );
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.filaPlanillaoperaciones).subscribe(
      procesoDataToSend => {
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
        this.router.navigate([urlBack]);
        this.snackBar.open('Se ha guardado el item', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.formFilaPlanillaoperaciones, this.snackBar);
      }
    );
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

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }
}
