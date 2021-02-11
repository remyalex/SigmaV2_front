import { TipointervencionCriteria } from './../models/tipointervencion-criteria.model';
import { Tipointervencion } from './../models/tipointervencion.model';
import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { TipointervencionService } from './tipointervencion.service';
import { CONST_ADMINISTRACION_TIPOINTERVENCION } from './../tipointervencion.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class TipointervencionDatasource implements DataSource<Tipointervencion> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOINTERVENCION;
  private tipointervencionSubject = new BehaviorSubject<Tipointervencion[]>([]);
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
  public tipointervencionData: any;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: TipointervencionService){}

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Tipointervencion[]> {
    return this.tipointervencionSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.tipointervencionSubject.complete ();
    this.loadingSubject.complete();
    this.totalelementsSubject.complete ();
    this.errorSubject.complete ();
    this.errorMessageSubject.complete ();
  }

  /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loadData(criteria: TipointervencionCriteria ): void {
      this.loadingSubject.next(true);
      if (this.petitionList) {
        this.petitionList.unsubscribe();
      }
      this.petitionList = this.servicio.search(criteria)
          .subscribe(async(data: any) => {
            const datosNuevos = data.content.map(async (tipointervencion) => {
              const tipointervencion_tipoSuperficie = await this.servicio.searchByList(
              this.constants.path_administracion_tipointervencion_tipoSuperficieId, tipointervencion.tipoSuperficieId);
              return {...tipointervencion };
            });
            Promise.all(datosNuevos)
            .then((completed) => {
              data.content = completed;
              this.tipointervencionData = completed;
              
              this.tipointervencionSubject.next(data.content);
              this.totalelementsSubject.next(data.totalElements);
              this.errorSubject.next(false);
              this.errorMessageSubject.next('');
              this.loadingSubject.next(false);
            });
          },
          error => {
            this.tipointervencionSubject.next([]);
            this.totalelementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next(this.constants.noResultados);
            this.loadingSubject.next(false);
          }
      );
  }

  
}
