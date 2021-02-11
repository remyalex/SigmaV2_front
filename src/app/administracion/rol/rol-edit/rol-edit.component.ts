import { Component, OnInit, Input, Output, IterableDiffer, IterableDiffers, SimpleChange, Inject } from '@angular/core';
import { Rol } from '../models/rol.model';
import { RolService } from '../services/rol.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DualListComponent, BasicList } from 'angular-dual-listbox';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la edición de un rol */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-rol-edit',
  templateUrl: './rol-edit.component.html'
})
export class RolEditComponent implements OnInit {

  /** Objeto usado para enviar al servicio de CRUD*/
  rol: Rol;
  /**  Bandera para indicar si el componente se encuentra en procesamiento desde el cliente*/
  enviada: boolean;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** variable con lista basica de disponibilidad usada en el componente */
  available: BasicList;
  /** variable con lista basica de confirmaciones usada en el componente */
  confirmed: BasicList;
  /** Objeto con valores Default para uso del componente */
  DEFAULT_FORMAT = {
    add: 'Agregar',
    remove: 'Eliminar',
    all: 'Todo',
    none: 'Ninguno',
    direction: DualListComponent.LTR,
    draggable: true,
    locale: undefined
  };

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: RolService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<RolEditComponent>,
    private differs: IterableDiffers,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Rol,
    private utilitiesService: UtilitiesService,
  ) {

    this.available = new BasicList(DualListComponent.AVAILABLE_LIST_NAME);
    this.confirmed = new BasicList(DualListComponent.CONFIRMED_LIST_NAME);

    this.servicio.getallPermisos().subscribe(
      _permisos => {
        this.available.sift = <any>_permisos;
        this.available.list = <any>_permisos;
        this.available.list = this.utilitiesService.orderArray(this.available.list, 'nombre');
        this.setPermisosSeleccionados();
      },
      error => { }
    );

    this.rol = data;

    this.form = fb.group({
      id: [this.rol.id, Validators.compose([Validators.required])],
      nombre: [this.rol.nombre, Validators.compose([Validators.required, Validators.maxLength(100)])],
      descripcion: [this.rol.descripcion, Validators.compose([Validators.required, Validators.maxLength(300)])],
      activo: [this.rol.activo, Validators.compose([Validators.required])],
      permisos: [null, Validators.compose([])],
      usuarioRequiereAsignarZona: [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() { }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.form.value.permisos = this.rol.permisos;
    this.servicio.update(this.form.value).subscribe(
      data => {
        this.rol = data;
        this.disabledBtn_Login = false;
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disabledBtn_Login = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.OnGoUrlAdmin();
      }
    });
  }

  /**
  * Método encargado de realizar el llamado del componente encagado de
  * gestionar el llamado al componente admin del componente.
  */
  OnGoUrlAdmin(): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'admin';
    this.router.navigate([urlBack]);
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.obtenerPermisosSeleccionados();
    this.enviada = true;
    if (this.form.valid === true) {
      this.disabledBtn_Login = true;
      this.enviada = true;
      this.save();
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /** Método encargado de reemplazar los permisos al objeto rol */
  setPermisosSeleccionados(): any {
    this.confirmed.list = [...this.confirmed.list, ...this.rol.permisos];
    this.confirmed.sift = [...this.confirmed.list, ...this.rol.permisos];
    for (let i = 0; i < this.rol.permisos.length; i++) {
      for (let j = 0; j < this.available.list.length; j++) {
        if (this.rol.permisos[i].id === this.available.list[j].id) {
          this.available.list.splice(j, 1);
        }
      }
    }
    this.confirmed.list = this.utilitiesService.orderArray(this.confirmed.list, 'nombre');
  }

  /** Método encargado de obtener lista de permisos seleccionados al objeto rol */
  obtenerPermisosSeleccionados(): any {
    const elementos = [];
    for (let index = 0; index < this.confirmed.list.length; index++) {
      elementos.push(this.confirmed.list[index]);
    }
    this.rol.permisos = elementos;
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

}
