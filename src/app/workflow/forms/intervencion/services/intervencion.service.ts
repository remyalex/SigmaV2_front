import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { Observable } from 'rxjs';
import { MantenimientoTotalModel } from '../models/MantenimientoTotal';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class IntervencionService {
  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    appSettings: AppSettings,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento/findNumeroVisitasSinRealizar';
  }

  buscarTotalMantenimientos(usuario: UsuarioInfo): Observable<MantenimientoTotalModel> {
    return this.http.get<MantenimientoTotalModel>(this.resourceUrl + `?directorObra=${usuario.id}`);
  }
}
