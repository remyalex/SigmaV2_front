import { TipocargueestructuraService } from './../../tipocargueestructura/services/tipocargueestructura.service';
import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Tipocargue } from '../models/tipocargue.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipocargueService } from '../services/tipocargue.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_TIPOCARGUE } from './../tipocargue.constant';
import { Subscription } from 'rxjs';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la edición de un tipo cargue */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-tipocargue-edit',
  templateUrl: './tipocargue-edit.component.html'
})
export class TipocargueEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUE;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipoCargue: Tipocargue;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param servicioEstructura Servicio Estructura usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: TipocargueService,
    private servicioEstructura: TipocargueestructuraService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TipocargueEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Tipocargue,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.tipoCargue = data;
    this.servicioEstructura.tipoCargue = this.tipoCargue;

    this.form = this.formBuilder.group(
      {
        'activo': [null, Validators.compose([Validators.required])],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(300)])],
        'id': [null, Validators.compose([Validators.required])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
        'programaSql': [null, Validators.compose([Validators.maxLength(30)])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.tipoCargue));
    this.customerDiffer = this.differs.find(this.tipoCargue).create();

    this.servicioEstructura.changeNoticeTipoCargueEstructura$.subscribe(
      userData$ => {
        this.servicio.detail(this.tipoCargue.id).subscribe(updateData => {
          this.tipoCargue.estructuras = updateData.estructuras;
        });
      });

    this.servicioEstructura.tipoCargeUpdate$.subscribe(data => {

      if (Object.keys(data).length > 1) {
        if (this.clone['id'] == data.id) {
          this.clone = JSON.parse(JSON.stringify(data));
        }
      }
    })
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        // tslint:disable-next-line:forin
        for (const key in this.tipoCargue) {
          this.tipoCargue[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.tipoCargue).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_tipocargue);
      this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disabledBtn_Login = false;
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disabledBtn_Login = true;
    if (this.form.valid) {
      this.disabledBtn_Login = true;
      this.save();
    } else {
      this.disabledBtn_Login = false;
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


  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.tipoCargue);
    if (changes) {
      this.customerChanged(changes);
    }
  }

  /**
   * Método en cargado de actualizar el modelo del componente una
   * vez notificado un cambio en los campos
   *
   * @param changes Diccionario de claves que se modificaron
   */
  customerChanged(changes: KeyValueChanges<string, any>) {
    changes.forEachChangedItem((record: any) => {
      if (record.key.length > 2 && record.key.search('Id') > -1) {
        this.servicio.searchByList(
          this.constants['path_administracion_tipocargue_' + record.key], this.tipoCargue[record.key])
          .then(data => {
            if (data) {
              this.tipoCargue[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
    */
  }
}
