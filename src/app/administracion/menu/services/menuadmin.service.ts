import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Menu } from '../models/menu.model';
import { MenuCriteria } from '../models/menu-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { MenuService } from 'src/app/theme/components/menu/menu.service';
import { CONST_MENU } from '../constantes-menu';

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
export class MenuadminService {
  /** Constantes a usar en el componente */
  constantes = CONST_MENU;
  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resoruceUrl: string;

   /**
  * Método encargado de construir una instancia de la clase
  *
  * @param http Peticion de protocolo http para realizar envío al servidor
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  * @param tokenStore Componente usado para obtener información del token del usuario
  * @param dataGeneric Referencia al servicio por el cual se obtendrán los datos requeridos
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private menuService: MenuService) {
    this.resoruceUrl = appSettings.settings.hostApi + this.constantes.path_menu;
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: MenuCriteria): Observable<CollectionResponse<Menu>> {
    return this.http.get<CollectionResponse<Menu>>(this.resoruceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de menú de administración
   */
  list (): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de invocar el servicio de refrescar el
   * menú al estado inicial.
   */
  refreshMenu() {
    this.menuService.updateMenu();
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de menú de administración.
   *
   * @param menu Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (menu: Menu): Observable<Menu> {
    if (menu.parent.id === 0) {
      menu.parent= null;
    }
    return this.http.post<Menu>(this.resoruceUrl, menu, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de menú de administración.
  *
  * @param menu Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (menu: Menu): Observable<Menu> {
    if (menu.parent.id === 0) {
      menu.parent = null;
    }
    return this.http.put<Menu>(this.resoruceUrl, menu, httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de menú.
   *
   * @param menuId Objeto de tipo modelo con los datos del
   * registro que se va a consultar
   */
  detail(menuId: number): Observable<Menu> {
    return this.http.get<Menu>(this.resoruceUrl + '/' + menuId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de menú de administración.
  *
  * @param menuId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (menuId: number): Observable<Menu> {
    return this.http.delete<Menu>(this.resoruceUrl + '/' + menuId);
  }

}
