import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';
import { AuthLoginInfo } from '../models/auth-login-info';
import { ProfileService } from '../services/profile.service';
import { MatSnackBar } from '@angular/material';
import { forkJoin } from 'rxjs';
import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar el Login de la app */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  /** Constantes a usar en el componente */
  constants = CONST_SHARED;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  /** Objeto que recibe valores de configuracion de la app */
  public settings: Settings;
  /** Variable boolean que cambia de valor 'true' al logueo correcto del usuario */
  isLoggedIn = false;
  /** Variable boolean que cambia de valor 'true' sí al logueo del usuario hay errores*/
  isLoginFailed = false;
  /** Variable usada para notificación mensaje de error */
  errorMessage = '';
  /** Objeto que almacena los datos del usuario ingresado */
  private loginInfo: AuthLoginInfo;
  validacion = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** variable usada para ocultar entrada de texto de contraseña*/
  hide = true;


  /**
  * Método encargado de construir una instancia de la clase
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param appSettings Componente usado para retornar los valores de configuración
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param router Componente usado para redireccionar entre componentes
  * @param authService Servicio usado en el componente para gestionar las peticiones
  * @param profileService Servicio usado en el componente para gestionar las peticiones
  * @param tokenStorage Componente usado para obtener información del token del usuario
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private snackBar: MatSnackBar,
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private tokenStorage: TokenStorageService,
    private utilitiesService: UtilitiesService,
  ) {
    this.settings = this.appSettings.settings;
    this.form = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }

  /** Método encargado de realizar validar datos de entrada solicitar
   * almacenamiento de información al método save
   * @param values objeto sin usar
  */
  public onSubmit(values: Object): void {
    if (this.form.valid) {
      this.validacion = true;
      this.disabledBtn_Login = true;
      this.loginInfo = new AuthLoginInfo(this.form.value);
      //this.loginInfo.usuario = this.form.value;
      this.authService.attemptAuth(this.loginInfo).subscribe(
        (data:any) => {
          //TODO: get token from response (data) headers.
          //console.log('el token jeder:',data.headers.get('token'));
          this.tokenStorage.saveToken(data.headers.get('token'));
          //console.log('usuario id: ',data.body.respuesta);
          let userInfo = {
            usuario: data.body.respuesta[0].login,
            json:JSON.stringify({
              "idUsuario": data.body.respuesta[0].id_usuario,
              "usuario": data.body.respuesta[0].login,
              "menu":{"idMenu":1}
            }),
            url: "http://129.213.171.5:8080/Caliope-backend/api/menu/listarMenuUsuarioT"
          };

          this.authService.getUserMenus(JSON.stringify(userInfo)).subscribe((menu) => {
            this.tokenStorage.savePayload(this.tokenStorage.PERFIL, window.btoa(JSON.stringify(data.body.respuesta[0])));
            this.tokenStorage.savePayload(this.tokenStorage.PERMISOS, window.btoa(JSON.stringify(userInfo)));
            this.tokenStorage.savePayload(this.tokenStorage.MENU, window.btoa(JSON.stringify(menu.body.respuesta[0].json)));

            this.appSettings.settings.loadingSpinner = true;
            this.router.navigate(['/administracion/dashboard/home']);
          }, error => {
            this.validacion = false;
            this.disabledBtn_Login = false;
            this.showMessageErrorHttp(error);
          });
        }, error => {
          this.validacion = false;
          this.disabledBtn_Login = false;
          this.showMessageErrorHttp(error);
        }
      );
    } else {
      this.snackBar.open(this.constants.errorForm, 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /** Método encargado de mostrar mensajes de error
   * @param error objeto que contiene el estado del error
   */
  showMessageErrorHttp(error) {
    if (error.status === 0 || error.status === 500) {
      this.snackBar.open(
        this.constants.error500, 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      }
      );
    } else if (error.status === 404) {
      this.snackBar.open(this.constants.urlLoginNoValida, 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      });
    } else if (error.status === 401) {
      let mensaje = this.constants.loginIncorrecto;
      try {
        mensaje = error.error[0].message;
      } catch (error) { }
      this.snackBar.open(mensaje, 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      });
    }
  }

  /** Método encargado de recargar la página actual */
  reloadPage() {
    window.location.reload();
  }

  /** Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }
}
