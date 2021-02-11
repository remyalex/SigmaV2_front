import { DataSource } from '@angular/cdk/table';
import { Insumo } from '../models/insumo.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { InsumoService } from './insumo.service';
import { InsumoCriteria } from '../models/insumo-criteria.model';
import { CONST_ADMINISTRACION_INSUMO } from './../insumo.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class InsumoDatasource implements DataSource<Insumo> {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_INSUMO;
  private insumoSubject = new BehaviorSubject<Insumo[]>([]);
  public  totalelementsSubject = new BehaviorSubject<number>(0);
  /** Variable usada para notificación a otros componentes de cambios */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorMessageSubject = new BehaviorSubject<string>('');

  /** Variable usada para notificación a otros componentes de cambios */
  public totalElements$ = this.totalelementsSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  public loading$ = this.loadingSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  public error$ = this.errorSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  public errorMessage$ = this.errorMessageSubject.asObservable();
  /** Variable con url de peticion a realizar */
  public petitionList = null;
  /** Variable con datos obtenidos de la petición al servidor */
  public insumoData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: InsumoService) {
    this.insumoData = [];
  }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Insumo[]> {
    return this.insumoSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.insumoSubject.complete();
    this.loadingSubject.complete();
    this.totalelementsSubject.complete();
    this.errorSubject.complete();
    this.errorMessageSubject.complete();
  }

 /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loadData(criteria: InsumoCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria).subscribe(
      async (data: any) => {
        const datosNuevos = data.content.map(async (insumo: any) => {
          const clase_insumo = await this.servicio.searchByList(
            CONST_ADMINISTRACION_INSUMO.path_administracion_insumo_claseInsumoId,
            insumo.claseInsumoId
          );
          const unidad_medida = await this.servicio.searchByList(
            CONST_ADMINISTRACION_INSUMO.path_administracion_insumo_unidadMedidaId,
            insumo.unidadMedidaId
          );

          return {
            ...insumo
          };
        });
        Promise.all(datosNuevos).then(completed => {
          data.content = completed;
          this.insumoData = completed;
          this.insumoSubject.next(data.content);

          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        });
      },
      error => {
        this.insumoSubject.next([]);
        this.totalelementsSubject.next(0);
        this.errorSubject.next(true);
        this.errorMessageSubject.next(this.constants.noResultados);
        this.loadingSubject.next(false);
      }
    );
  }
}
