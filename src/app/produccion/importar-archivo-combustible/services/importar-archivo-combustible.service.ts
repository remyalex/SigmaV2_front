import { Injectable } from '@angular/core';
import { CONST_PRODUCCION_IMPORTAR_COMBUSTIBLE_VEHICULO } from '../importar-archivo-combustible.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ArchivoCombustible } from '../models/archivo-combustible.model';
import { CargueConsumoCombustible } from '../models/cargue-consumo-combustible.model';

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
export class ImportarArchivoCombustibleService {

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_IMPORTAR_COMBUSTIBLE_VEHICULO;
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
    this.resourceUrl = appSettings.settings.hostApi + '/api/produccion/archivoCombustible';
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
  list (): Observable<ArchivoCombustible[]> {
    return this.http.get<ArchivoCombustible[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (archivoCombustible: ArchivoCombustible): Observable<ArchivoCombustible> {
    return this.http.post<ArchivoCombustible>(this.resourceUrl, archivoCombustible, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (archivoCombustible: ArchivoCombustible): Observable<ArchivoCombustible> {
    return this.http.put<ArchivoCombustible>(this.resourceUrl, archivoCombustible, httpOptions);
  }

  detail(archivoCombustibleId: number): Observable<ArchivoCombustible> {
    return this.http.get<ArchivoCombustible>(this.resourceUrl + '/' + archivoCombustibleId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (archivoCombustibleId: number): Observable<ArchivoCombustible> {
    return this.http.delete<ArchivoCombustible>(this.resourceUrl + '/' + archivoCombustibleId);
  }

  importarArchivo(archivoCombustible: ArchivoCombustible): Observable<CargueConsumoCombustible[]>{
    const url = this.resourceUrl + '/cargarArchivo'
    return this.http.post<CargueConsumoCombustible[]>(url, archivoCombustible, httpOptions);

  }

  procesarArchivo(archivoCombustible: ArchivoCombustible): Observable<CargueConsumoCombustible[]>{
    const url = this.resourceUrl + '/procesarArchivo'
    return this.http.post<CargueConsumoCombustible[]>(url, archivoCombustible, httpOptions);

  }

  updateArchivoData(archivoUpdated) {
    this.cargueConsumo.next(archivoUpdated);
  }
}