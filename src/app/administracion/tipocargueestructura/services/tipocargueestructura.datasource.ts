import { DataSource } from '@angular/cdk/table';
import { Tipocargueestructura } from '../models/tipocargueestructura.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { TipocargueestructuraService } from './tipocargueestructura.service';
import { TipocargueestructuraCriteria } from '../models/tipocargueestructura-criteria.model';
import { CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA } from './../tipocargueestructura.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class TipocargueestructuraDatasource implements DataSource<Tipocargueestructura> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA;
  private tipocargueestructuraSubject = new BehaviorSubject<Tipocargueestructura[]>([]);
  /** Variable usada para notificación a otros componentes de cambios */
  public totalelementsSubject = new BehaviorSubject<number>(0);
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
  public tipocargueestructuraData: any;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: TipocargueestructuraService){}

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Tipocargueestructura[]> {
    return this.tipocargueestructuraSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.tipocargueestructuraSubject.complete ();
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
  loadData(criteria: TipocargueestructuraCriteria ): void {
      this.loadingSubject.next(true);
      if (this.petitionList) {
        this.petitionList.unsubscribe();
      }
      this.petitionList = this.servicio.search(criteria)
          .subscribe(async(data: any) => {
            const datosNuevos = data.content.map(async (tipocargueestructura) => {
              const tipocargueestructura_lista = await this.servicio.searchByList(
              this.constants.path_administracion_tipocargueestructura_listaId, tipocargueestructura.listaId);
              const tipocargueestructura_requerido = await this.servicio.searchByList(
              this.constants.path_administracion_tipocargueestructura_requeridoId, tipocargueestructura.requeridoId);
              const tipocargueestructura_tipoCargue = await this.servicio.searchByList(
              this.constants.path_administracion_tipocargueestructura_tipoCargueId, tipocargueestructura.tipoCargueId);
              const tipocargueestructura_tipoDato = await this.servicio.searchByList(
              this.constants.path_administracion_tipocargueestructura_tipoDatoId, tipocargueestructura.tipoDatoId);
              return {...tipocargueestructura,
              ...{
                listaValor: (typeof tipocargueestructura_lista != 'undefined') ? tipocargueestructura_lista.nombre : this.constants.noEncontrado,
                requeridoValor: (typeof tipocargueestructura_requerido != 'undefined') ? tipocargueestructura_requerido.valor : this.constants.noEncontrado,
                tipoCargueValor: (typeof tipocargueestructura_tipoCargue != 'undefined') ? tipocargueestructura_tipoCargue.valor : this.constants.noEncontrado,
                tipoDatoValor: (typeof tipocargueestructura_tipoDato != 'undefined') ? tipocargueestructura_tipoDato.valor : this.constants.noEncontrado,
              }};
            });
            Promise.all(datosNuevos)
            .then((completed) => {
              data.content = completed;
              this.tipocargueestructuraData = completed;
              this.tipocargueestructuraSubject.next(data.content);
            });
            this.tipocargueestructuraSubject.next(data.content);
            this.totalelementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
          },
          error => {
            this.tipocargueestructuraSubject.next([]);
            this.totalelementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next('No se ha logrado obtener datos para la consulta.');
            this.loadingSubject.next(false);
          }
      );
  }

  
}
