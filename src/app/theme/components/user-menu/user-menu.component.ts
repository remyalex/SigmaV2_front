import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';

/** Componente encargado de gestionar los menus de usuario */
@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent implements OnInit {

  /** variable publica con ruta de imagen para uso del componente */
  public userImage = '../assets/img/users/user.jpg';
  /** variable publica que recíbe nombre de usuario de tokenService */
  public nombreUsuario: string;
  /** variable publica que recíbe valor usuario de tokenService */
  public usuario: string;


  /**
  * Método encargado de construir una instancia del componente
  */
  constructor(
    public tokenService: TokenStorageService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.nombreUsuario = this.tokenService.getNombres() + ' ' + this.tokenService.getApellidos();
    this.usuario = this.tokenService.getUsuario();
  }
}
