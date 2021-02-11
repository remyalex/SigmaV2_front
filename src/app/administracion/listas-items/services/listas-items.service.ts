import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { ListaItemCriteria } from '../models/listas-items-criteria.model';
import { ListaItem } from '../models/listas-items.model';
import { Lista } from '../../listas/models/lista.model';
import { CONST_ADMINISTRACION_LISTAS_ITEM } from '../listas-items.constant';


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
export class ListaItemsService {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LISTAS_ITEM;
  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resoruceUrl: string;
  /** Variable usada para contruir path url a invocar del servicio de listas
   * según el método de petición requerido */
  private resoruceUrlLista: string;

    /**
  * Método encargado de construir una instancia de la clase
  *
  * @param http Peticion de protocolo http para realizar envío al servidor
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings
    ) {
    this.resoruceUrl = appSettings.settings.hostApi + '/api/administracion/listaitem';
    this.resoruceUrlLista = appSettings.settings.hostApi + this.constants.path_lista;
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: ListaItemCriteria): Observable<CollectionResponse<ListaItem>> {
    return this.http.get<CollectionResponse<ListaItem>>(this.resoruceUrl +
      '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de invocar la busqueda de todos los registros
   * de listaas en el sistema
   */
  public listAll (): Observable<ListaItem[]> {
    return this.http.get<ListaItem[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de listas
   *
   * @param listaId Identificador de la lista por el cual se realizará la búsqueda
   */
  list (listaId: number): Observable<ListaItem[]> {
    return this.http.get<ListaItem[]>(this.resoruceUrl+'/'+listaId+'/list');
  }

  /**
   * Método encargado de listar los items de la lista según el nombre
   * de la lista indicado
   * @param nombreLista Nombre de la lista de la cual se desea obtener los
   * items
   */
  listByNombreLista (nombreLista: string): Observable<ListaItem[]> {
    return this.http.get<ListaItem[]>(this.resoruceUrl+'/nombre-lista/'+nombreLista+'/list');
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * del ítem que corresponde con la lista y el valor indicado
   *
   * @param nombreLista Nombre de la lista a consultar el Valor
   * @param nombreListaItem Nombre de lista item a consultar
   */
  listByNombreListaAndListaItem (nombreLista: string, nombreListaItem: string): Observable<ListaItem[]> {
    return this.http.get<ListaItem[]>(`${this.resoruceUrl}/lista/${nombreLista}/listaitem/${nombreListaItem}`);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro del ítem de la lista.
   *
   * @param listaItem Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (listaItem: ListaItem): Observable<ListaItem> {
    return this.http.post<ListaItem>(this.resoruceUrl, listaItem, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro del item de la lista.
  *
  * @param listaItem Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (listaItem: ListaItem): Observable<ListaItem> {
    return this.http.put<ListaItem>(this.resoruceUrl, listaItem, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de la lista.
  *
  * @param lista Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  updateLista (lista: Lista): Observable<Lista> {
    return this.http.put<Lista>(this.resoruceUrlLista, lista, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de item de la lista.
   *
   * @param listaItemId Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (listaItemId: number): Observable<ListaItem> {
    return this.http.get<ListaItem>(this.resoruceUrl + '/' + listaItemId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de ítem de la lista.
  *
  * @param listaItemId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (listaItemId: number): Observable<ListaItem> {
    return this.http.delete<ListaItem>(this.resoruceUrl + '/' + listaItemId);
  }

}
