import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, 
  ElementRef, ViewChild, Input, Output, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { GrupoModel } from '../models/grupo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GrupoService } from '../services/grupo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_GRUPO } from '../grupo.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la edición de un grupo */
@Component({
  selector: 'sigma-administracion-grupo-edit',
  templateUrl: './grupo-edit.component.html'
})
export class GrupoEditComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GRUPO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  groupToEdit: GrupoModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Id Grupo */
  idGrupo: number;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private servicio: GrupoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private dataGenericService:  DataGenericService
  ) {
    this.groupToEdit = new GrupoModel();
    this.form = this.formBuilder.group(
      {
        'activo': [null, Validators.compose([Validators.required])],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'id': [null, Validators.compose([Validators.required])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
        'origenLugarId': [null, Validators.compose([Validators.required])],
      }
    );
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this.idGrupo = Number(id);
    this.servicio.detail(Number(id)).subscribe(
      (groupToEdit: GrupoModel) => {
        this.groupToEdit = groupToEdit;
        this.servicio.updateGroupList(this.groupToEdit);
        this.enviada = false;
      },
      error => {
        this.groupToEdit = new GrupoModel();
      }
    );
    this.servicio.group$.subscribe(
      (groupUpdated: GrupoModel) => {
        if (groupUpdated !== null && groupUpdated.id !== undefined) {
          this.groupToEdit = groupUpdated;
        }
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

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.groupToEdit).subscribe(
      groupData => {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_grupo);
        const urlBack = location.pathname.split('/').splice(0, location.pathname.split('/').length - 2).join('/') + '/admin';
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.snackBar.open(error.error[0].message, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
      }
    );
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
        if (val === 1) {
          const urlBack = location.pathname.split('/').splice(0, location.pathname.split('/').length - 2).join('/') + '/admin';
          this.router.navigate([urlBack]);
        }
      }
    );
  }
}

