import { Insumo } from './../../../administracion/insumo/models/insumo.model';
import { InsumoExistencia } from './../models/insumo-existencia.model';
import { CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA } from './../insumoExistencia.constant';
import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA,  MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { InsumoExistenciaService } from '../services/insumo-existencia.service';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import moment from 'moment';

@Component({
  selector: 'sigma-produccion-insumo-existencia-edit',
  templateUrl: './insumo-existencia-edit.component.html'
})
export class InsumoExistenciaEditComponent implements OnInit {
  private customerDiffer: KeyValueDiffer<string, any>;
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA;
  registro: InsumoExistencia = new InsumoExistencia();
  fechaInicialControl = new FormControl(moment());
  fechaFinalControl = new FormControl(moment());
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  requerido = true;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  contratoPath: string;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: InsumoExistenciaService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<InsumoExistenciaEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: InsumoExistencia,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesServices: UtilitiesService
  ) {
    this.contratoPath = this.constants.path_produccion_insumo_existencia_contratoId;
    this.registro = data;
    this.form = this.formBuilder.group({
      id: [null],
      fechaInicial: [null, Validators.compose([ Validators.required ])],
      fechaFinal: [null, Validators.compose([ Validators.required ])],
      contrato: [null, Validators.compose([ Validators.required ])],
      inventarioInicial: [null],
      cantidadEntrada: [null],
      cantidadSalida: [null],
      inventarioFinal: [null, Validators.compose([ Validators.min(0) ])],
      insumo: [null, Validators.compose([ Validators.required ])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.enviada = false;
    this.clone = JSON.parse(JSON.stringify(this.registro));
    this.customerDiffer = this.differs.find(this.registro).create();
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
        // tslint:disable-next-line: forin
        for (const key in this.registro) {
          this.registro[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.registro).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.enviada = false;
        this.snackBar.open(this.constants.successEdit, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
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
    if (this.form.valid == true) {
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
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.registro);
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
        this.servicio
          .searchByList(
            this.constants['path_produccion_insumo_existencia_' + record.key],
            this.registro[record.key]
          )
          .then(data => {
            if (data) {
              this.registro[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });

  }

  realizarCalculoInventarioFinal() {
    if (this.registro) {
      const inv_final =
          (this.registro.inventarioInicial ? this.registro.inventarioInicial : 0 ) +
          (this.registro.cantidadEntrada ? this.registro.cantidadEntrada : 0 ) -
          (this.registro.cantidadSalida ? this.registro.cantidadSalida : 0 ) ;
      this.registro.inventarioFinal = inv_final;
    }
  }

  setInventarioInicial( valor ) {
    if (valor === '') {
      valor = 0;
    }
    this.registro.inventarioInicial = parseInt(valor);
    this.realizarCalculoInventarioFinal();
  }

  setCantidadEntrada( valor ) {
    if (valor === '') {
      valor = 0;
    }
    this.registro.cantidadEntrada = parseInt(valor);
    this.realizarCalculoInventarioFinal();
  }

  setCantidadSalida( valor ) {
    if (valor === '') {
      valor = 0;
    }
    this.registro.cantidadSalida = parseInt(valor);
    this.realizarCalculoInventarioFinal();
  }
}
