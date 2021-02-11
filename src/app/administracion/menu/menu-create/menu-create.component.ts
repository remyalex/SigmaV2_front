import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ListasCofirmComponent } from './../../listas/listas-confirm/listas-confirm.component';
import { Component, OnInit } from '@angular/core';
import { Menu } from '../models/menu.model';
import { MenuadminService } from '../services/menuadmin.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { PermisosService } from '../../permisos/services/permisos.service';
import { Permiso } from '../../permisos/models/permiso.model';
import { CONST_MENU } from './../constantes-menu';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { AuthService } from 'src/app/seguridad/services/auth.service';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { AppSettings } from 'src/app/app.settings';
import { forkJoin } from 'rxjs';
import { MenuBase } from '../menu-admin/menu-base';

/** Componente encargado de gestionar la creación de Menú */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-menu-create',
  templateUrl: './menu-create.component.html'
})
export class MenuCreateComponent extends MenuBase implements OnInit  {

  /**  Constantes que utiliza el componente */
  constantes = CONST_MENU;
  /** Objeto usado para enviar al servicio de CRUD*/
  menu: Menu = new Menu();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  /** lista de permisos usado en el componente */
  listaPermiso: Permiso[];
  /** data usada en la grilla del componente */
  listaMenu: Menu[];
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

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicioPermiso Servicio Permiso usado en el componente para gestionar las peticiones
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  * @param router Componente usado para redireccionar entre componentes
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param authService Servicio usado en el componente para gestionar las peticiones
  * @param profileService Servicio usado en el componente para gestionar las peticiones
  * @param tokenStorage Componente usado para obtener información del token del usuario
  * @param appSettings Componente usado para retornar los valores de configuración
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private servicioPermiso: PermisosService,
    public formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _utilitiesService: UtilitiesService,
    router: Router,
    servicio: MenuadminService,
    authService: AuthService,
    profileService: ProfileService,
    tokenStorage: TokenStorageService,
    appSettings: AppSettings,
    snackBar: MatSnackBar,
  ) {
    super(servicio, authService, profileService, tokenStorage, appSettings, snackBar, router);
    // super();
    this.form = this.formBuilder.group({
      'id': [this.menu.id],
      'titulo': [this.menu.titulo, Validators.compose([
        Validators.required,
        Validators.maxLength(100),
      ])],
      'descripcion': [this.menu.descripcion, Validators.compose([
          Validators.required,
          Validators.maxLength(300),
      ])],
      'routerLink': [null, Validators.compose([
        Validators.required,
        Validators.maxLength(300),
      ])],
      'href': [null, Validators.compose([
        Validators.maxLength(300),
      ])],
      'target': [null,
        Validators.maxLength(255),
      ],
      'parent': [this.menu.parent],
      'permiso': [this.menu.permiso, Validators.compose([
        Validators.required,
        Validators.maxLength(500),
      ])],
      iconoLista: [this.iconoLista,  Validators.required],
      'orden': [this.menu.orden, Validators.compose([
        Validators.required,
        Validators.max(9999999999999999999),
      ])],
      'hasSubMenu': [this.menu.hasSubMenu],
      'activo': [this.menu.activo, Validators.compose([
        Validators.required
      ])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    this.menu = new Menu();
    this.enviada = false;
    this.tipoEnlace = 'Interno';
    this.servicioPermiso.list().subscribe(data => {
      this.listaPermiso = data;
    });

    this.servicio.list().subscribe((menus: any) => {
      menus = [...[{ id: 0, parent: { id: 0 }, titulo: 'Menú sin padre' }], ...menus];
      menus = menus.filter((menuTemp: Menu) => {
        if (menuTemp.id === this.menu.id) {
          return false;
        }
        return true;
      });
      this.listaMenu = menus.sort((a: Menu, b: Menu) =>  a.titulo.localeCompare(b.titulo) );
    });

    this.parentId = this.menu.parent ? this.menu.parent.id : 0;
    this.permisoId = this.menu.permiso ? this.menu.permiso.id : 0;
  }

  onChangeIconoSeleccionado(iconoSeleccionado: ListaItem) {
    if (typeof(iconoSeleccionado.descripcion) !== 'undefined') {
      this.menu.icon = iconoSeleccionado.descripcion;
    }
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.menu = new Menu();
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.form.value.icon = this.menu.icon;
    this.servicio.create(this.form.value).subscribe(
      data => {
        this.mensaje = 'creado exitosamente!';
        this.actualizarMenuVertical();
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
    // se actualizan las listas con el model
    this.form.value.permiso = this.menu.permiso;
    this.form.value.parent = this.menu.parent;
    this.enviada = true;

    if (this.form.valid === true) {
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
      panelClass: ['error-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 5000,
    });
  }

  /** Método encargado de reemplazar id del menú
   * @param _id valor Id numérico
   */
  seleccionarMenuPadre(_id: number) {
    this.menu.parent = new Menu();
    this.menu.parent.id = _id;
  }

  /** Método encargado de reemplazar id del permiso
   * @param _id valor Id numérico
   */
  seleccionarPermiso(_id: number): void {
    this.menu.permiso = new Permiso();
    this.menu.permiso.id = _id;
  }

  /** Método encargado de reemplazar el objeto tipoEnlace
   * @param _tipoEnlace objeto selecionado
   */
  seleccionarTipoEnlace(_tipoEnlace): void {
    this.tipoEnlace = _tipoEnlace;
    if (_tipoEnlace === 'Interno') {
      this.menu.href = '';
      this.menu.target = null;
    } else {
      this.menu.routerLink = '';
    }
    this.getFormBuilderCustom(this.tipoEnlace);
  }

  /** Personaliza validacion del form de acuerdo al  campo 'Tipo de enlace'
  * @param tipoEnlace objeto tipo String que será evaluado
  */
  getFormBuilderCustom(tipoEnlace): any {
    if (tipoEnlace === 'Interno') {
      this.form.controls['routerLink'].setValidators([Validators.required, Validators.maxLength(300)]);
      this.form.controls['routerLink'].setValue(null);
      this.form.controls['href'].clearValidators();
      this.form.controls['href'].setValue(null);
      this.form.controls['target'].clearValidators();
      this.form.controls['target'].setValue(null);
    } else {
      this.form.controls['routerLink'].clearValidators();
      this.form.controls['routerLink'].setValue(null);
      this.form.controls['href'].setValidators([Validators.required, Validators.maxLength(300)]);
      this.form.controls['href'].setValue(null);
      this.form.controls['target'].setValidators([Validators.required, Validators.maxLength(300)]);
      this.form.controls['target'].setValue(null);
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
          const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
          this.router.navigate([urlBack]);
        }
      }
    );
  }

}
