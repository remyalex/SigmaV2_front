import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_PLANILLAOPERACIONES } from '../planillaoperaciones.constant';
import { ItemPlanillaoperaiconesModel } from '../models/planillaoperaciones.model';
import { ItemPlanillaoperacionesCriteria } from '../models/planillaoperaciones-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

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
export class PlanillaoperacionesService {

  private updateListItem = new BehaviorSubject({});
  updateListItem$ = this.updateListItem.asObservable();

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PLANILLAOPERACIONES;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings
  ) {
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_planillaoperaciones;
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<ItemPlanillaoperaiconesModel[]> {
    return this.http.get<ItemPlanillaoperaiconesModel[]>(this.resourceUrl);
  }
  create(newRowPlanillaoperaciones: ItemPlanillaoperaiconesModel): Observable<ItemPlanillaoperaiconesModel> {
    return this.http.post<ItemPlanillaoperaiconesModel>(this.resourceUrl, newRowPlanillaoperaciones, httpOptions);
  }
  search(infoToSearch: ItemPlanillaoperacionesCriteria): Observable<CollectionResponse<ItemPlanillaoperaiconesModel>> {
    return this.http.get<CollectionResponse<ItemPlanillaoperaiconesModel>> (this.resourceUrl + 'search?' + infoToSearch.getUrlParameters());
  }
  update(updateRowPlanillaoperaciones: ItemPlanillaoperaiconesModel): Observable<ItemPlanillaoperaiconesModel>{
    return this.http.put<ItemPlanillaoperaiconesModel>(this.resourceUrl, updateRowPlanillaoperaciones, httpOptions);
  }
  delete(itemID: Number): Observable<ItemPlanillaoperaiconesModel>{
    return this.http.delete<ItemPlanillaoperaiconesModel>(this.resourceUrl + itemID);
  }
  updateListItemInfo(updateListItem) {
    this.updateListItem.next(updateListItem);
  }
}
