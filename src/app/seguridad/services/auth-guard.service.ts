import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {


  /**
  * Método encargado de construir una instancia
  */
  constructor(private tokenService: TokenStorageService, private router: Router, private authService: AuthService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.tokenService.getToken() != null) {
      const ruta = state.url.split('/').splice(0, state.url.split('/').length - 1).join('/');
      const rutaValida = <boolean>await this.authService.validGuardMenu(ruta);
      if (!rutaValida) {
        this.router.navigate(['seguridad/login'], {
          queryParams: {
            return: state.url
          }
        });
      }
      return rutaValida;
    } else {
      this.router.navigate(['seguridad/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
  }
}
