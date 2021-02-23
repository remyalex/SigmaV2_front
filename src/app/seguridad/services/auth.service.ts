import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtResponse } from '../models/jwt-response';
import { AuthLoginInfo } from '../models/auth-login-info';
import { Menu } from '../../theme/components/menu/menu.model';
import { AppSettings } from 'src/app/app.settings';
import { TokenStorageService } from './token-storage.service';
import { Profile } from "../models/profile";

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'events'
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loginUrl: string;
  public menusUrl: string;
  public menuItems: any;


  /**
  * Método encargado de construir una instancia
  */
  constructor(private http: HttpClient, private appSettings: AppSettings, private tokenStorage: TokenStorageService) {
    if (tokenStorage.getMenus() !== null) {
      this.menuItems = [...tokenStorage.getMenus(), ...[{ id: 0, routerLink: '/administracion/dashboard/home' }]];
    } else {
      this.menuItems = [{ id: 0, routerLink: '/administracion/dashboard/home' }];
    }
    this.loginUrl = appSettings.settings.hostApi2 + '/api/usuario/login';
    //this.loginUrl = appSettings.settings.hostApi + '/api/auth/login';
    this.menusUrl = appSettings.settings.hostApi2 + '/api/externo/consume';
    //this.menusUrl = appSettings.settings.hostApi2 + '/api/externo/consume';

  }

  attemptAuth(credentials: AuthLoginInfo): Observable<any> {
    /*TODO: set Response model accordin to hostApi2 ("respuesta": {<userObject>})
            -response Not Token (JwtResponse) -> token in response headers
    */
    return this.http.post<any>(this.loginUrl, credentials, httpOptions);
  }

  getUserMenus(userInfo: string): Observable<any> {
    return this.http.post<any>(this.menusUrl, userInfo, httpOptions);
  }

  validGuardMenu(guard) {
    if (this.tokenStorage.getMenus() !== null) {
      this.menuItems = [...this.tokenStorage.getMenus(), ...this.menuItems];
    }
    const promise = new Promise((resolve) => {
      // resolve(this.menuItems.filter((menu: any) => menu.routerLink.indexOf(guard) >= 0).length > 0);
      resolve(true);
    });
    return promise;
  }

}
