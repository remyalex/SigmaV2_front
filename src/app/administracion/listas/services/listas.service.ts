import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Lista } from '../models/lista.model';
import { ListaCriteria } from '../models/lista-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { ListaItem } from '../../listas-items/models/listas-items.model';

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
export class ListasService {

  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resoruceUrl: string;
   /** Variable usada para notificación a otros componentes de cambios de las listas */
  private modelIsChangeSubject = new BehaviorSubject({});
   /** Observable usado para tener la totalización de los elementos devueltos de listas actualizadas */
  public modelIsChange$ = this.modelIsChangeSubject.asObservable();

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param http Peticion de protocolo http para realizar envío al servidor
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  * @param dataGeneric Referencia al servicio por el cual se obtendrán los datos requeridos
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
  ) {
    this.resoruceUrl = appSettings.settings.hostApi + '/api/administracion/lista';
  }

  /**
   * Método encargado de construir la petición de solicitud de actualización
   * de datos de listas
   *
   * @param data Objeto de tipo lista con los datos actualizados del modelo
   */
  solicitarActualizacionModel(data: any) {
    this.modelIsChangeSubject.next(data);
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
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: ListaCriteria): Observable<CollectionResponse<Lista>> {
    return this.http.get<CollectionResponse<Lista>>(this.resoruceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de listas
   */
  list (): Observable<Lista[]> {
    return this.http.get<Lista[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para realizar la
   * consulta de la lista por nombre de la lista
   *
   * @param nombreLista Nombre de la lista por la cual se desea realizar
   * el filtro
   */
  listByNombre(nombreLista: string): Observable<ListaItem[]> {
    return this.http.get<ListaItem[]>(this.resoruceUrl + '/' + nombreLista + '/items');
  }

  /**
   * Método encargado de generar la petición de servidor para realizar
   * la consulta de items de la lista por el nombre de la lista
   *
   * @param nombreLista Nombre de la lista de la cual se desea obtener los items
   * @param valorListaItem Valores de la lista identificados
   */
  listByNombreItem(nombreLista: string, valorListaItem): Observable<ListaItem> {
    return this.http.get<ListaItem>(`${this.resoruceUrl}/${nombreLista}/${valorListaItem}`);
  }

  /**
   * Método encargado de generar la petición de obtener el primer item del listado
   * solicitado
   * @param valorListaItem Valor solicitado de la lista
   */
  getFirstItemByValor(valorListaItem: string): Observable<ListaItem> {
    return this.http.get<ListaItem>(`${this.resoruceUrl}/getFirstItemByValor/${valorListaItem}`);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de listas.
   *
   * @param lista Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (lista: Lista): Observable<Lista> {
    return this.http.post<Lista>(this.resoruceUrl, lista, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de listas.
  *
  * @param lista Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (lista: Lista): Observable<Lista> {
    return this.http.put<Lista>(this.resoruceUrl, lista, httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de listas.
   *
   * @param listaId Identificador del objeto de tipo modelo con los datos del
   * registro que se va a consultar
   */
  detail(listaId: number): Observable<Lista> {
    return this.http.get<Lista>(this.resoruceUrl + '/' + listaId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de listas.
  *
  * @param lista Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (listaId: number): Observable<Lista> {
    return this.http.delete<Lista>(this.resoruceUrl + '/' + listaId);
  }

  /**
   * Método encargado de generar la petición para realizar la
   * exportación de la información de los items y de la listas
   */
  exportar(): Observable<Lista> {
    return this.http.get<Lista>(this.resoruceUrl + '/download/Listas-ListasItem.xlsx');
  }

}
