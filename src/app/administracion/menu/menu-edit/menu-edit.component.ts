import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { UtilitiesService } from './../../../shared/services/utilities.service';
import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Menu } from '../models/menu.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MenuadminService } from '../services/menuadmin.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Permiso } from '../../permisos/models/permiso.model';
import { PermisosService } from '../../permisos/services/permisos.service';
import { debug } from 'util';
import { CONST_MENU } from './../constantes-menu';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { IfStmt } from '@angular/compiler';
import { AuthService } from 'src/app/seguridad/services/auth.service';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { AppSettings } from 'src/app/app.settings';
import { MenuBase } from '../menu-admin/menu-base';

/** Componente encargado de gestionar la edición del menú*/
@Component({
  selector: 'sigma-administracion-menu-edit',
  templateUrl: './menu-edit.component.html'
})
export class MenuEditComponent extends MenuBase implements OnInit {

  /**  Constantes que utiliza el componente */
  constantes = CONST_MENU;
  /** Objeto usado para enviar al servicio de CRUD*/
  menu: Menu;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Lista de permisos usada en el componente */
  listaPermiso: Permiso[];
  /** data menus usada en la grilla del componente */
  listaMenu: Menu[];
  /** variable no usada */
  arbolData: Menu[];
  /** variable no usada */
  dataMap = new Map([]);
  /** variable no usada */
  selectedPermiso: Permiso;
  /** objeto que recibe dato para uso del componente */
  tipoEnlace: string = '';
  /** Variable usada para gestionar la seleccion de los iconos de lista */
  iconoLista: ListaItem;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** variable que recibe el Id del objeto parent del menú */
  parentId: any;
  /** variable que recibe el Id del objeto permiso del menú */
  permisoId: any;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};


  /**
  * Método encargado de construir una instancia del componente
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param servicioPermiso Servicio Permiso usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  * @param data Información a procesar
  */
  constructor(
    servicio: MenuadminService,
    private servicioPermiso: PermisosService,
    router: Router,
    public formBuilder: FormBuilder,
    snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MenuEditComponent>,
    private fb: FormBuilder,
    private _utilitiesService: UtilitiesService,
    private dialog: MatDialog,
    authService: AuthService,
    profileService: ProfileService,
    tokenStorage: TokenStorageService,
    appSettings: AppSettings,
    @Inject(MAT_DIALOG_DATA) data: Menu
  ) {
    super(servicio, authService, profileService, tokenStorage, appSettings, snackBar, router);
    this.inicializarForm(fb, data);
  }

  inicializarForm(fb: FormBuilder, data: Menu): void {
    this.menu = data;
    this.selectedPermiso = data.permiso;
    if (this.menu.parent == null) {
      const menuSinPadre = new Menu();
      menuSinPadre.id = 0;
      this.menu.parent = menuSinPadre;
    }
    if (this.menu.routerLink != null) {
      this.tipoEnlace = 'Interno';
    } else {
      this.tipoEnlace = 'Externo';
    }

    this.servicioPermiso.list().subscribe(data => {
      this.listaPermiso = data;
    });

    this.servicio.list().subscribe((menus: any) => {
      menus = [...[{ id: 0, parent: { id: 0 }, titulo: 'Menú sin padre' }], ...menus];
      menus.indexOf(this.menu);
      menus = menus.filter((menuTemp: Menu) => {
        if (menuTemp.id === this.menu.id && menuTemp.id > 0) {
          return false;
        }
        return true;
      });
      this.listaMenu = menus.sort((a: Menu, b: Menu) => a.titulo.localeCompare(b.titulo));
    });

    this.parentId = this.menu.parent ? this.menu.parent.id : 0;
    this.permisoId = this.menu.permiso ? this.menu.permiso.id : 0;

    if ( typeof(this.menu.icon) !== 'undefined') {
      this.iconoLista = new ListaItem();
      this.iconoLista.descripcion = this.menu.icon;
      this.iconoLista.valor = this.menu.icon;
    }

    this.form = this.fb.group({
      id: [this.menu.id],
      titulo: [this.menu.titulo, Validators.compose([Validators.required, Validators.maxLength(100)])],
      descripcion: [this.menu.descripcion, Validators.compose([Validators.required, Validators.maxLength(300)])],
      routerLink: [this.menu.routerLink, Validators.compose([Validators.required, Validators.maxLength(300)])],
      href: [this.menu.href, Validators.compose([Validators.maxLength(300)])],
      target: [this.menu.target, Validators.maxLength(255)],
      parent: [this.menu.parent, Validators.required],
      permiso: [this.menu.permiso, Validators.required],
      iconoLista: [this.iconoLista,  Validators.required],
      icon: [this.menu.icon, null],
      orden: [this.menu.orden, Validators.compose([Validators.required, Validators.max(9999999999999999999)])],
      hasSubMenu: [this.menu.hasSubMenu],
      activo: [this.menu.activo, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.menu));
    this.getFormBuilderCustom(this.tipoEnlace);
  }

  /** Método encargado de la validación de cantidad de caracteres de la descripción */
  validDescripcion(): boolean {
    if (this.form.value.descripcion != null && this.form.value.descripcion.length > 500) {
      return true;
    } else {
      return false;
    }
  }

  onChangeIconoSeleccionado(iconoSeleccionado: ListaItem) {
    if (typeof(iconoSeleccionado.descripcion) !== 'undefined') {
      this.menu.icon = iconoSeleccionado.descripcion;
    }
  }


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
        for (let key in this.menu) {
          this.menu[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.form.value.icon = this.menu.icon;
    this.servicio.update(this.form.value).subscribe(
      data => {
        this.actualizarMenuVertical();
        this.dialogRef.close(this.menu);
      },
      error => {
        this.disabledBtn_Login = false;
        this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    // se actualizan las listas con el model
    this.form.value.permiso = this.menu.permiso;
    this.form.value.parent = this.menu.parent;
    if (this.form.valid == true) {
      this.enviada = true;
      this.disabledBtn_Login = true;
      this.save();
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
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

  /** Método encargado de reemplazar id del permiso
   * @param _id valor Id numérico
   */
  seleccionarPermiso(_id: number): void {
    this.menu.permiso = new Permiso();
    this.menu.permiso.id = _id;
  }

  /** Método encargado de reemplazar id del menú
   * @param _id valor Id numérico
   */
  seleccionarMenuPadre(_id: number) {
    this.menu.parent = new Menu();
    this.menu.parent.id = _id;
  }


  /** Método encargado de reemplazar el objeto tipoEnlace
   * @param _tipoEnlace objeto selecionado
   */
  seleccionarTipoEnlace(_tipoEnlace): void {
    this.tipoEnlace = _tipoEnlace;
    if (_tipoEnlace == 'Interno') {
      this.menu.href = '';
      this.menu.target = null;
    } else {
      this.menu.routerLink = '';
    }
    this.getFormBuilderCustom(_tipoEnlace);
  }

  /** Personaliza validacion del form de acuerdo al  campo 'Tipo de enlace'
  * @param tipoEnlace objeto tipo String que será evaluado
  */
  getFormBuilderCustom(tipoEnlace): any {
    if (tipoEnlace == 'Interno') {
      this.form.controls['routerLink'].setValidators([Validators.required, Validators.maxLength(300)]);
      this.form.controls['href'].setValidators([Validators.maxLength(300)]);
      this.form.controls['href'].setValue(null);
      this.form.controls['target'].setValidators([Validators.maxLength(300)]);
      this.form.controls['target'].setValue(null);
    } else {
      this.form.controls['routerLink'].setValidators([Validators.maxLength(300)]);
      this.form.controls['routerLink'].setValue(null);
      this.form.controls['href'].setValidators([Validators.required, Validators.maxLength(300)]);
      this.form.controls['target'].setValidators([Validators.required, Validators.maxLength(300)]);
    }
  }
}
