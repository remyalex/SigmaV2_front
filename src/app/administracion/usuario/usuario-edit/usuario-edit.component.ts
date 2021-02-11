import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Usuario } from '../models/usuario.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_USUARIO } from './../usuario.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la edición de un usuario */
@Component({
  selector: 'sigma-administracion-usuario-edit',
  templateUrl: './usuario-edit.component.html'
})
export class UsuarioEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_USUARIO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  usuario: Usuario;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** lista de roles */
  roles = [];
  /** Bandera que permite identificar si el formulario se encuentra siendo procesado */
  public loading: boolean = false;
  /** objeto con el valor del path o ruta de roles asignados */
  pathUsuariosRolesIncluyendoAsigandos: string;
  /**Variable usada para habilitar el select zona en caso de que el rol requiera que se asigne una al usuario */
  enableZona = false;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: UsuarioService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UsuarioEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Usuario,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
  ) {
    this.usuario = data;

    this.form = this.formBuilder.group({
      activo: [{ value: this.usuario.usuario }, Validators.compose([Validators.required])],
      apellidos: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      correoElectronico: [null, Validators.compose([Validators.required, Validators.email, Validators.maxLength(255)])],
      id: [null, Validators.compose([Validators.required])],
      identificacion: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      nombres: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      origenId: [null, Validators.compose([Validators.required])],
      usuario: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      roles: [null, Validators.compose([Validators.required])],
      estado: [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.usuario));
    this.customerDiffer = this.differs.find(this.usuario).create();
    this.pathUsuariosRolesIncluyendoAsigandos =
      this.constants.path_administracion_usuario_roles_incluidos_asignados.replace('{usuarioId}', this.usuario.id + '');
    this.changeRol('');
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
        for (let key in this.usuario) {
          this.usuario[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.usuario).subscribe(
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
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
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

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.usuario);
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
            this.constants['path_administracion_usuario_' + record.key],
            this.usuario[record.key]
          )
          .then(data => {
            if (data) {
              this.usuario[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
    */
  }

  changeRol(event: any) {
    let requiredZona = false;
    for (const rol of this.usuario.roles) {
      if (rol.usuarioRequiereAsignarZona) {
        requiredZona = true;
      }
    }

    if (requiredZona) {
      this.enableZona = true;
      this.form.addControl('zona', new FormControl (null, Validators.required));
    } else {
      this.form.removeControl('zona');
      this.enableZona = false;
      this.usuario.zona = null;
    }
  }
}
