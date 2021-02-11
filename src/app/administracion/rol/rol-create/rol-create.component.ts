import { Component, OnInit, Input, Output, IterableDiffer, IterableDiffers, SimpleChange } from '@angular/core';
import { Rol } from '../models/rol.model';
import { RolService } from '../services/rol.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { DualListComponent, BasicList } from 'angular-dual-listbox';
import { RolCriteria } from '../models/rol-criteria.model';
import { RolDatasource } from '../services/rol.datasource';
import { BehaviorSubject } from 'rxjs';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_ROL } from '../rol.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la creación de roles */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-rol-create',
  templateUrl: './rol-create.component.html'
})
export class RolCreateComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ROL;
  /** Objeto usado para enviar al servicio de CRUD*/
  rol: Rol = new Rol();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new RolCriteria();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: RolDatasource;
  /** objeto suscrito a eventos almacenando Rol */
  private rolSubject = new BehaviorSubject<Rol[]>([]);
  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
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
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param differs Elemento usado para mantener la información clonada
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: RolService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private differs: IterableDiffers,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService
  ) {
    this.available = new BasicList(DualListComponent.AVAILABLE_LIST_NAME);
    this.confirmed = new BasicList(DualListComponent.CONFIRMED_LIST_NAME);

    this.servicio.getallPermisos().subscribe(
      data => {
        this.available.sift = <any>data;
        this.available.list = <any>data;
      },
      error => { }
    );

    this.form = this.formBuilder.group({
      activo: [this.rol.activo, Validators.compose([Validators.required])],
      descripcion: [null, Validators.compose([Validators.required, Validators.maxLength(300)])],
      nombre: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      permisos: [null, Validators.compose([])],
      usuarioRequiereAsignarZona: [null, Validators.compose([Validators.required])]
    });

    // Agrega titulos en español del componente DualList
    // this.format = this.DEFAULT_FORMAT;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.dataSource = new RolDatasource(this.servicio);
    this.rol = new Rol();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.rol = new Rol();
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.rol).subscribe(
      data => {
        this.disabledBtn_Login = false;
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.OnGoUrlAdmin();
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
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
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

  /** Método encargado de asignar los permisos seleccionados al objeto rol */
  obtenerPermisosSeleccionados(): any {
    const elementos = [];
    for (let index = 0; index < this.confirmed.list.length; index++) {
      elementos.push(this.confirmed.list[index]);
    }
    this.rol.permisos = elementos;
  }

  /** Método encargado de mostrar mensajes de error en el componente
   * @param message mensaje que se mostrará en snackBar
   * @param action el label for the snackbar.
   */
  public enviarMensaje(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
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
