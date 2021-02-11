import { Injectable } from '@angular/core';
import { CONST_GESTIONAR_RADICADOS_PQRSFD } from '../gestionar-radicados-pqrsfd.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { RadicadoVinculadoModel } from '../models/radicado-vinculado.model';

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
export class RadicadoVinculadoService {

 /** Constantes a usar en el componente */
  constants = CONST_GESTIONAR_RADICADOS_PQRSFD;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  private resourceUrlPermisos: string;

  public cargueConsumo = new BehaviorSubject({});
  cargueConsumo$ = this.cargueConsumo.asObservable();


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
    private tokenStore: TokenStorageService,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/mejoramiento/radicado';
   }

  /**
   * Método encargado de obtener los datos de una lista
   * dado el path de esta y el id correspondiente.
   *
   * @param path Cadena de texto que indica la ruta de la
   * lista de la cual se obtendrá información
   *
   * @param id Identificador de el item de la lista por el cual
   * se desea filtrar los items de la lista
   **/
  searchByList(path: string, id: number) {
    return this.dataGeneric.buscarListaId(path, id);
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<RadicadoVinculadoModel[]> {
    return this.http.get<RadicadoVinculadoModel[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (radicadoVinculadoModel: RadicadoVinculadoModel): Observable<RadicadoVinculadoModel> {
    return this.http.post<RadicadoVinculadoModel>(this.resourceUrl, radicadoVinculadoModel, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (radicadoVinculadoModel: RadicadoVinculadoModel): Observable<RadicadoVinculadoModel> {
    return this.http.put<RadicadoVinculadoModel>(this.resourceUrl, radicadoVinculadoModel, httpOptions);
  }

  detail(radicadoVinculadoModelId: number): Observable<RadicadoVinculadoModel> {
    return this.http.get<RadicadoVinculadoModel>(this.resourceUrl + '/' + radicadoVinculadoModelId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (radicadoVinculadoModelId: number): Observable<RadicadoVinculadoModel> {
    return this.http.delete<RadicadoVinculadoModel>(this.resourceUrl + '/' + radicadoVinculadoModelId);
  }

  importarArchivo(RadicadoVinculadoModel: RadicadoVinculadoModel): Observable<RadicadoVinculadoModel[]>{
    const url = this.resourceUrl + '/cargarArchivo'
    return this.http.post<RadicadoVinculadoModel[]>(url, RadicadoVinculadoModel, httpOptions);

  }

  updateArchivoData(archivoUpdated) {
    this.cargueConsumo.next(archivoUpdated);
  }
}