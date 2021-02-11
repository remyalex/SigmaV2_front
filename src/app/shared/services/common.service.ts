import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { OrfeoResponse } from 'src/app/workflow/models/orfeo-response';
import { ImportarExcelModel } from '../models/importar.excel.model';
import { ImportarExcelRespuestaModel } from '../models/importar.excel.respuesta.model';
import { WorkflowTransicionModel } from 'src/app/workflow/models/workflow-transicion.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { SolicitudSmvlGasa } from 'src/app/workflow/models/solicitud-smvl-gasa';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class CommonService {


  private host: string;
  public responsableId: string;

  /**
  * Método encargado de construir una instancia
  */
  constructor(private http: HttpClient, private appSettings: AppSettings) {
    this.host = appSettings.settings.hostApi;
  }

  getMantenimientoPorPK(PK: string): Observable<WorkflowMantenimientoModel> {
    if (PK === undefined) {
      PK = '0';
    }
    return this.http.get<WorkflowMantenimientoModel>(`${this.host}/api/mejoramiento/mantenimiento/${PK}`);
  }

  getMantenimientoPorPKMultiple(pks: string): Observable<WorkflowMantenimientoModel[]> {
    const url = this.host + '/api/mejoramiento/mantenimiento/grupos/';
    // const dataParam = encodeURIComponent('{pks}') + '?pks=' + encodeURIComponent(pks.toString());
    return this.http.get<WorkflowMantenimientoModel[]>(`${url}${pks.toString()}`);
  }

  getListaItemByNombreListaAndValorItem(nombreLista: string, valorItem: string): Observable<ListaItem> {
    return this.http.get<ListaItem>(`${this.host}/api/administracion/lista/${nombreLista}/${valorItem}`);
  }

  getElements(path: string): Observable<any> {
    return this.http.get<any>(`${this.host}${path}`);
  }

  getRadicadoOrfeo(numeroRadicado: string): Observable<OrfeoResponse> {
    return this.http.get<OrfeoResponse>(`${this.host}/api/orfeo/${numeroRadicado}`);
  }

  importFile(importacion: ImportarExcelModel): Observable<ImportarExcelRespuestaModel> {
    const url = this.host + '/api/administracion/archivo/importar-excel';
    return this.http.post<ImportarExcelRespuestaModel>(url, importacion, httpOptions);
  }

  getMantenimientosFile(importacion: ImportarExcelModel): Observable<ImportarExcelRespuestaModel> {
    const url = this.host + '/api/administracion/archivo/obtener-mentenimientos-excel';
    return this.http.post<ImportarExcelRespuestaModel>(url, importacion, httpOptions);
  }

  downloadFormato(tipoFormato: String): Observable<any> {
    return this.http.get(this.host + `/api/administracion/archivo/downloadformato/${tipoFormato}`, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  getTransicionByNombreProcesoAndNombreTransicion(nombreProceso: string, nombreTransicion: string) {
    return this.http.get<WorkflowTransicionModel>(`${this.host}/api/administracion/proceso/${nombreProceso}/${nombreTransicion}`);
  }

  getUsuariosTransicion(mantenimientoId: number, transicionId: number): Observable<UsuarioInfo[]> {
    return this.http.get<UsuarioInfo[]>(`${this.host}/api/usuario/usuariosTransicion/${mantenimientoId}/${transicionId}`);
  }

  getUsuarioAsignado(mantenimientoId: number, transicionId: number): Observable<UsuarioInfo> {
    return this.http.get<UsuarioInfo>(`${this.host}/api/usuario/usuarioAsignado/${mantenimientoId}/${transicionId}`);
  }

  getCondicionById(condicionId: number): Observable<WorkflowCondicionModel> {
    return this.http.get<WorkflowCondicionModel>(`${this.host}/api/administracion/condicion/${condicionId}`);
  }
  getCondicionByNombre(nombreCondicion: string): Observable<WorkflowCondicionModel> {
    return this.http.get<WorkflowCondicionModel>(`${this.host}/api/administracion/condicion/nombre/${nombreCondicion}`);
  }

  getNumeroRadicadoSolicitudActualizacionDiagSmvlGasa(): Observable<any> {
    return this.http.get<any>(`${this.host}/api/workflow/`);
  }

}
