import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Profile } from '../models/profile';
import { TokenStorageService } from './token-storage.service';
import { AppSettings } from 'src/app/app.settings';
import { takeWhile, delay, debounceTime, auditTime } from 'rxjs/operators';

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profile: Profile;
  private url: string;
  private url_permisos: string;
  permisos: any;
  public petition = null;


  /**
  * Método encargado de construir una instancia
  */
  constructor(private http: HttpClient, private tokenService: TokenStorageService, private appSettings: AppSettings) {
    this.url = appSettings.settings.hostApi + '/api/usuario/profile';
    this.url_permisos = appSettings.settings.hostApi + '/api/usuario/permisos';
    this.permisos = [];
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.url);
  }

  public getUserPermisos(): Observable<any> {
    return this.http.get(this.url_permisos);
  }

  public getPermisos(): Observable<any> {
    const promiseSubject = new BehaviorSubject([]);
    const promise$ = promiseSubject.asObservable();
    if (this.permisos.length > 0) {
      promiseSubject.next(this.permisos);
    } else {
      this.http.get(this.url_permisos)
        .subscribe((permisos: any) => {
          this.permisos = permisos.map((permiso: any) => permiso.nombre);
          promiseSubject.next(this.permisos);
        });
    }
    return promise$;
  }

  isGranted(role: any): Observable<any> {
    const roleSubject = new BehaviorSubject({});
    const role$ = roleSubject.asObservable();
    const permisos = this.tokenService.getStorage2();
    roleSubject.next({ state: permisos.filter(rol => rol == role).length > 0 });
    return role$;
  }

  public isGrantedFunction(permisoName: string): boolean {
    const permisos = this.tokenService.getStorage2();
    return (permisos.filter((permiso: string) => permiso == permisoName).length > 0);
  }

}
